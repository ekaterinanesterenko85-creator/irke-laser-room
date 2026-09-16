import { createFileRoute } from "@tanstack/react-router";
import { createOpenAI } from "@ai-sdk/openai";
import {
  convertToModelMessages,
  streamText,
  stepCountIs,
  tool,
  type UIMessage,
} from "ai";
import { z } from "zod";
import { getSiteData } from "@/lib/site-content.functions";
import { defaultContent } from "@/lib/site-defaults";

type ChatRequestBody = { messages?: unknown; leadId?: unknown };

function transcriptSummary(messages: UIMessage[]): string {
  const texts = messages
    .filter((message) => message.role === "user")
    .flatMap((message) =>
      message.parts
        .filter((part): part is { type: "text"; text: string } => part.type === "text")
        .map((part) => part.text),
    );
  return texts.join(" · ").slice(0, 400);
}

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = (await request.json()) as ChatRequestBody;
        const messages = body.messages;
        const leadId = typeof body.leadId === "string" ? body.leadId : null;
        if (!Array.isArray(messages)) {
          return new Response("Messages are required", { status: 400 });
        }

        const apiKey = process.env["LOVABLE_API_KEY"];
        if (!apiKey) {
          return new Response("Missing LOVABLE_API_KEY", { status: 500 });
        }

        const site = await getSiteData();
        const chat = site.content.chat ?? defaultContent.chat;
        const contacts = site.content.contacts;
        const zones = site.services.filter((service) => service.kind === "zone");
        const complexes = site.services.filter((service) => service.kind === "complex");

        const priceList = [
          "Отдельные зоны:",
          ...zones.map((zone) => `- ${zone.title}: ${zone.price}`),
          "Комплексы:",
          ...complexes.map(
            (complex) =>
              `- ${complex.title}: ${complex.price}${complex.description ? ` (${complex.description})` : ""}`,
          ),
        ].join("\n");

        const promo = site.content.promo.enabled
          ? `Действующая акция: ${site.content.promo.title}. ${site.content.promo.text}`
          : "Сейчас акций нет.";

        const systemPrompt = [
          chat.instructions,
          "",
          "Данные кабинета:",
          `Адрес: ${contacts.address}. ${contacts.addressNote}`,
          `Часы работы: ${contacts.hours}. ${contacts.hoursNote}`,
          `Телефон и WhatsApp: ${contacts.phone}`,
          "",
          "Прайс (используй только эти цены):",
          priceList,
          "",
          promo,
          "",
          "Правила инструментов: suggest_booking вызывай, когда посетитель выбрал услугу; request_human — когда не можешь ответить по этим данным или посетитель просит человека. После вызова инструмента коротко объясни посетителю, что происходит.",
        ].join("\n");

        const lovable = createOpenAI({
          baseURL: "https://ai.gateway.lovable.dev/v1",
          apiKey,
          headers: {
            "Lovable-API-Key": apiKey,
            "X-Lovable-AIG-SDK": "vercel-ai-sdk",
          },
        });

        async function markLead(patch: Record<string, unknown>) {
          if (!leadId) return;
          const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
          await supabaseAdmin.from("chat_leads").update(patch as never).eq("id", leadId);
        }

        const result = streamText({
          model: lovable.responses("openai/gpt-6-astra"),
          system: systemPrompt,
          messages: await convertToModelMessages(messages as UIMessage[]),
          stopWhen: stepCountIs(50),
          tools: {
            suggest_booking: tool({
              description:
                "Показать посетителю кнопку отправки заявки в WhatsApp с выбранной услугой.",
              inputSchema: z.object({
                service: z.string().describe("Название выбранной услуги или комплекса"),
                note: z.string().nullable().describe("Короткое уточнение или null"),
              }),
              execute: async ({ service, note }) => {
                await markLead({ summary: [service, note].filter(Boolean).join(" — ") });
                return { service, note: note ?? "" };
              },
            }),
            request_human: tool({
              description: "Позвать Ирке, когда бот не может помочь или посетитель просит человека.",
              inputSchema: z.object({
                reason: z.string().describe("Почему нужен ответ Ирке"),
              }),
              execute: async ({ reason }) => {
                await markLead({ needs_human: true, summary: reason.slice(0, 400) });
                return { ok: true, reason };
              },
            }),
          },
          providerOptions: {
            openai: {
              store: false,
              include: ["reasoning.encrypted_content"],
              forceReasoning: true,
              reasoningEffort: "low",
              reasoningSummary: "auto",
            },
          },
        });

        return result.toUIMessageStreamResponse({
          originalMessages: messages as UIMessage[],
          onFinish: async ({ messages: finalMessages }) => {
            if (!leadId) return;
            const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
            const { error } = await supabaseAdmin
              .from("chat_leads")
              .update({
                messages: finalMessages as never,
                summary: transcriptSummary(finalMessages as UIMessage[]),
              } as never)
              .eq("id", leadId);
            if (error) console.error("chat lead save failed", error.message);
          },
        });
      },
    },
  },
});
