import { useEffect, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { MessageCircle, X, RotateCcw, Send } from "lucide-react";
import { toast } from "sonner";
import { createChatLead } from "@/lib/chat.functions";
import { useServerFn } from "@tanstack/react-start";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputSubmit,
} from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";
import assistantAvatar from "@/assets/chat-assistant.png";
import type { Chat as ChatSettings, Contacts } from "@/lib/site-defaults";

const LEAD_KEY = "irke-chat-lead";
const MESSAGES_KEY = "irke-chat-messages";

type Lead = { leadId: string; name: string; phone: string };

function readLead(): Lead | null {
  try {
    const raw = window.localStorage.getItem(LEAD_KEY);
    return raw ? (JSON.parse(raw) as Lead) : null;
  } catch {
    return null;
  }
}

function readMessages(): UIMessage[] {
  try {
    const raw = window.localStorage.getItem(MESSAGES_KEY);
    const parsed = raw ? (JSON.parse(raw) as UIMessage[]) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function messageText(message: UIMessage) {
  return message.parts
    .filter((part): part is { type: "text"; text: string } => part.type === "text")
    .map((part) => part.text)
    .join("");
}

type ToolState = { service: string | null; needsHuman: boolean };

function readToolState(messages: UIMessage[]): ToolState {
  let service: string | null = null;
  let needsHuman = false;
  for (const message of messages) {
    for (const part of message.parts as { type: string; output?: unknown }[]) {
      if (part.type === "tool-suggest_booking" && part.output) {
        const output = part.output as { service?: string; note?: string };
        service = [output.service, output.note].filter(Boolean).join(" — ") || service;
      }
      if (part.type === "tool-request_human" && part.output) needsHuman = true;
    }
  }
  return { service, needsHuman };
}

export function ChatWidget({
  chat,
  contacts,
}: {
  chat: ChatSettings;
  contacts: Contacts;
}) {
  const [open, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [lead, setLead] = useState<Lead | null>(null);
  const [initialMessages, setInitialMessages] = useState<UIMessage[]>([]);

  useEffect(() => {
    setLead(readLead());
    setInitialMessages(readMessages());
    setHydrated(true);
  }, []);

  if (!chat.enabled) return null;

  return (
    <>
      {!open ? (
        <Button
          type="button"
          onClick={() => setOpen(true)}
          className="fixed bottom-4 right-4 z-50 h-14 rounded-full px-5 shadow-lg"
          aria-label={chat.buttonLabel}
        >
          <MessageCircle aria-hidden="true" />
          <span className="hidden sm:inline">{chat.buttonLabel}</span>
        </Button>
      ) : null}

      {open && hydrated ? (
        <div className="fixed bottom-4 right-4 z-50 flex h-[min(34rem,calc(100dvh-2rem))] w-[min(24rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-xl">
          <div className="flex items-center gap-3 border-b border-border px-4 py-3">
            <img
              src={assistantAvatar}
              alt=""
              className="h-9 w-9 rounded-full"
              width={36}
              height={36}
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-foreground">{chat.windowTitle}</p>
              <p className="truncate text-xs text-muted-foreground">{chat.windowSubtitle}</p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Закрыть чат"
              onClick={() => setOpen(false)}
            >
              <X aria-hidden="true" />
            </Button>
          </div>

          {lead ? (
            <ChatConversation
              chat={chat}
              contacts={contacts}
              lead={lead}
              initialMessages={initialMessages}
              onReset={() => {
                window.localStorage.removeItem(MESSAGES_KEY);
                window.localStorage.removeItem(LEAD_KEY);
                setInitialMessages([]);
                setLead(null);
              }}
            />
          ) : (
            <LeadForm
              chat={chat}
              onReady={(next) => {
                window.localStorage.setItem(LEAD_KEY, JSON.stringify(next));
                setLead(next);
              }}
            />
          )}
        </div>
      ) : null}
    </>
  );
}

function LeadForm({
  chat,
  onReady,
}: {
  chat: ChatSettings;
  onReady: (lead: Lead) => void;
}) {
  const create = useServerFn(createChatLead);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    try {
      const { leadId } = await create({ data: { name, phone, consent } });
      onReady({ leadId, name: name.trim(), phone: phone.trim() });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Не удалось начать чат");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
      <div>
        <p className="text-sm font-medium text-foreground">{chat.formTitle}</p>
        <p className="mt-1 text-xs text-muted-foreground">{chat.formNote}</p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="chat-name">Имя</Label>
        <Input
          id="chat-name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          autoComplete="name"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="chat-phone">Телефон</Label>
        <Input
          id="chat-phone"
          type="tel"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          autoComplete="tel"
          placeholder="+7 909 332 90 29"
          required
        />
      </div>
      <div className="flex items-start gap-3">
        <Checkbox
          id="chat-consent"
          checked={consent}
          onCheckedChange={(checked) => setConsent(checked === true)}
        />
        <Label htmlFor="chat-consent" className="text-xs font-normal leading-relaxed">
          {chat.consentText}{" "}
          <a href="/privacy" target="_blank" rel="noreferrer" className="underline">
            {chat.privacyTitle}
          </a>
        </Label>
      </div>
      <Button type="submit" disabled={!consent || saving}>
        {saving ? "Открываю чат…" : chat.startButton}
      </Button>
    </form>
  );
}

function ChatConversation({
  chat,
  contacts,
  lead,
  initialMessages,
  onReset,
}: {
  chat: ChatSettings;
  contacts: Contacts;
  lead: Lead;
  initialMessages: UIMessage[];
  onReset: () => void;
}) {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { messages, sendMessage, status, error } = useChat({
    id: lead.leadId,
    messages: initialMessages,
    transport: new DefaultChatTransport({
      api: "/api/chat",
      body: { leadId: lead.leadId },
    }),
    onError: (chatError) => {
      toast.error(
        chatError.message.includes("402")
          ? "Помощник временно недоступен. Напишите, пожалуйста, в WhatsApp."
          : "Не удалось получить ответ. Попробуйте ещё раз или напишите в WhatsApp.",
      );
    },
  });

  useEffect(() => {
    textareaRef.current?.focus();
  }, [status]);

  useEffect(() => {
    if (messages.length > 0) {
      window.localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
    }
  }, [messages]);

  const isBusy = status === "submitted" || status === "streaming";
  const { service, needsHuman } = readToolState(messages);

  const bookingText = [
    `Здравствуйте! Меня зовут ${lead.name}, телефон ${lead.phone}.`,
    service ? `Хочу записаться: ${service}.` : contacts.whatsappText,
  ].join(" ");
  const bookingLink = `https://wa.me/${contacts.phoneRaw}?text=${encodeURIComponent(bookingText)}`;

  async function handleSubmit(_message: unknown, event: React.FormEvent) {
    event.preventDefault();
    const text = input.trim();
    if (!text || isBusy) return;
    setInput("");
    await sendMessage({ text });
  }

  return (
    <>
      <Conversation className="flex-1">
        <ConversationContent className="gap-4 p-4">
          <Message from="assistant">
            <MessageContent>
              <MessageResponse>{chat.greeting}</MessageResponse>
            </MessageContent>
          </Message>

          {messages.map((message) => {
            const text = messageText(message);
            if (!text) return null;
            return (
              <Message key={message.id} from={message.role === "user" ? "user" : "assistant"}>
                <MessageContent>
                  <MessageResponse>{text}</MessageResponse>
                </MessageContent>
              </Message>
            );
          })}

          {status === "submitted" ? <Shimmer>Печатает…</Shimmer> : null}

          {needsHuman ? (
            <p className="rounded-xl border border-border bg-muted/60 p-3 text-xs text-muted-foreground">
              {chat.humanNote}
            </p>
          ) : null}

          {error ? (
            <p className="text-xs text-destructive">
              Помощник не ответил. Напишите, пожалуйста, в WhatsApp — Ирке ответит лично.
            </p>
          ) : null}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      <div className="space-y-2 border-t border-border p-3">
        {service || needsHuman ? (
          <Button asChild className="w-full">
            <a href={bookingLink} target="_blank" rel="noopener noreferrer">
              <Send aria-hidden="true" />
              {needsHuman && !service ? "Написать Ирке в WhatsApp" : chat.bookingButton}
            </a>
          </Button>
        ) : null}

        <PromptInput onSubmit={handleSubmit}>
          <PromptInputTextarea
            ref={textareaRef}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder={chat.placeholder}
          />
          <PromptInputFooter className="justify-between">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onReset}
              aria-label="Начать заново"
            >
              <RotateCcw aria-hidden="true" />
              Заново
            </Button>
            <PromptInputSubmit status={status} disabled={!input.trim() && !isBusy} />
          </PromptInputFooter>
        </PromptInput>
      </div>
    </>
  );
}
