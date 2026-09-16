import { createServerFn } from "@tanstack/react-start";

/** Public: visitor leaves name + phone and consent before the chat starts. */
export const createChatLead = createServerFn({ method: "POST" })
  .inputValidator((input: { name: string; phone: string; consent: boolean }) => input)
  .handler(async ({ data }) => {
    const name = data.name.trim().slice(0, 80);
    const phone = data.phone.trim().slice(0, 40);
    if (name.length < 2) throw new Error("Укажите, пожалуйста, имя");
    if (phone.replace(/\D/g, "").length < 10) throw new Error("Укажите, пожалуйста, телефон");
    if (!data.consent) throw new Error("Нужно согласие на обработку данных");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: inserted, error } = await supabaseAdmin
      .from("chat_leads")
      .insert({ name, phone, consent: true })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    return { leadId: (inserted as { id: string }).id };
  });
