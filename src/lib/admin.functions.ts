import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { mergeContent, type Service, type SiteContent, type SiteImage } from "./site-defaults";

type AuthedContext = {
  supabase: {
    rpc: (fn: string, args: Record<string, unknown>) => Promise<{ data: unknown }>;
    from: (table: string) => any;
  };
  userId: string;
};

async function assertAdmin(context: AuthedContext) {
  const { data } = await context.supabase.rpc("has_role", {
    _user_id: context.userId,
    _role: "admin",
  });
  if (data !== true) throw new Error("Доступ запрещён");
}

export type AdminData = {
  content: SiteContent;
  services: Service[];
  images: SiteImage[];
};

export const adminLoadAll = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<AdminData> => {
    await assertAdmin(context as unknown as AuthedContext);
    const supabase = context.supabase;

    const [contentRes, servicesRes, imagesRes] = await Promise.all([
      supabase.from("site_content").select("key, value"),
      supabase.from("services").select("*").order("sort_order", { ascending: true }),
      supabase.from("site_images").select("*").order("sort_order", { ascending: true }),
    ]);

    return {
      content: mergeContent((contentRes.data ?? []) as { key: string; value: unknown }[]),
      services: (servicesRes.data ?? []) as Service[],
      images: (imagesRes.data ?? []) as SiteImage[],
    };
  });

export const saveContentKey = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { key: string; value: Record<string, unknown> }) => input)
  .handler(async ({ data, context }) => {
    await assertAdmin(context as unknown as AuthedContext);
    const { error } = await context.supabase
      .from("site_content")
      .upsert({ key: data.key, value: data.value as never }, { onConflict: "key" });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const saveService = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    (input: {
      id?: string;
      kind: "zone" | "complex";
      title: string;
      description: string | null;
      price: string;
      badge: string | null;
      sort_order: number;
      is_visible: boolean;
    }) => input,
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context as unknown as AuthedContext);
    const row = {
      kind: data.kind,
      title: data.title,
      description: data.description,
      price: data.price,
      badge: data.badge,
      sort_order: data.sort_order,
      is_visible: data.is_visible,
    };
    if (data.id) {
      const { error } = await context.supabase
        .from("services")
        .update(row)
        .eq("id", data.id);
      if (error) throw new Error(error.message);
      return { id: data.id };
    }
    const { data: inserted, error } = await context.supabase
      .from("services")
      .insert(row)
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    return { id: (inserted as { id: string }).id };
  });

export const deleteService = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string }) => input)
  .handler(async ({ data, context }) => {
    await assertAdmin(context as unknown as AuthedContext);
    const { error } = await context.supabase.from("services").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const reorderServices = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { ids: string[] }) => input)
  .handler(async ({ data, context }) => {
    await assertAdmin(context as unknown as AuthedContext);
    for (const [index, id] of data.ids.entries()) {
      const { error } = await context.supabase
        .from("services")
        .update({ sort_order: index + 1 })
        .eq("id", id);
      if (error) throw new Error(error.message);
    }
    return { ok: true };
  });

export const saveImage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    (input: {
      id?: string;
      slot: "hero" | "about" | "gallery";
      url?: string;
      storage_path?: string | null;
      alt?: string;
      sort_order?: number;
      replace?: boolean;
    }) => input,
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context as unknown as AuthedContext);
    const supabase = context.supabase;

    if (data.id) {
      const patch: Record<string, unknown> = {};
      if (data.url !== undefined) patch["url"] = data.url;
      if (data.storage_path !== undefined) patch["storage_path"] = data.storage_path;
      if (data.alt !== undefined) patch["alt"] = data.alt;
      if (data.sort_order !== undefined) patch["sort_order"] = data.sort_order;
      const { error } = await supabase
        .from("site_images")
        .update(patch as never)
        .eq("id", data.id);
      if (error) throw new Error(error.message);
      return { ok: true };
    }

    // single-image slots keep only one row
    if (data.replace && (data.slot === "hero" || data.slot === "about")) {
      await supabase.from("site_images").delete().eq("slot", data.slot);
    }

    const { error } = await supabase.from("site_images").insert({
      slot: data.slot,
      url: data.url ?? "",
      storage_path: data.storage_path ?? null,
      alt: data.alt ?? "",
      sort_order: data.sort_order ?? 1,
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteImage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string }) => input)
  .handler(async ({ data, context }) => {
    await assertAdmin(context as unknown as AuthedContext);
    const { error } = await context.supabase.from("site_images").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const listAdmins = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context as unknown as AuthedContext);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: roles } = await supabaseAdmin
      .from("user_roles")
      .select("user_id")
      .eq("role", "admin");
    const { data: users } = await supabaseAdmin.auth.admin.listUsers();
    const ids = new Set((roles ?? []).map((r) => r.user_id));
    return (users?.users ?? [])
      .filter((u) => ids.has(u.id))
      .map((u) => ({ id: u.id, email: u.email ?? "" }));
  });

export const addAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { email: string; password: string }) => input)
  .handler(async ({ data, context }) => {
    await assertAdmin(context as unknown as AuthedContext);
    if (data.password.length < 8) throw new Error("Пароль должен быть не короче 8 символов");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: created, error } = await supabaseAdmin.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: true,
    });
    if (error || !created.user) throw new Error(error?.message ?? "Не удалось создать доступ");

    const { error: roleError } = await supabaseAdmin
      .from("user_roles")
      .insert({ user_id: created.user.id, role: "admin" });
    if (roleError) throw new Error(roleError.message);
    return { ok: true };
  });

export const removeAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { userId: string }) => input)
  .handler(async ({ data, context }) => {
    await assertAdmin(context as unknown as AuthedContext);
    if (data.userId === context.userId) throw new Error("Нельзя удалить свой собственный доступ");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin.from("user_roles").delete().eq("user_id", data.userId);
    await supabaseAdmin.auth.admin.deleteUser(data.userId);
    return { ok: true };
  });

/** One-time bootstrap: works only while no admin exists yet. */
export const bootstrapAdmin = createServerFn({ method: "POST" })
  .inputValidator((input: { email: string; password: string }) => input)
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { count } = await supabaseAdmin
      .from("user_roles")
      .select("id", { count: "exact", head: true })
      .eq("role", "admin");
    if ((count ?? 0) > 0) throw new Error("Доступ уже настроен — войдите по своим данным");
    if (data.password.length < 8) throw new Error("Пароль должен быть не короче 8 символов");

    const { data: created, error } = await supabaseAdmin.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: true,
    });
    if (error || !created.user) throw new Error(error?.message ?? "Не удалось создать доступ");

    const { error: roleError } = await supabaseAdmin
      .from("user_roles")
      .insert({ user_id: created.user.id, role: "admin" });
    if (roleError) throw new Error(roleError.message);
    return { ok: true };
  });

export type ChatLead = {
  id: string;
  name: string;
  phone: string;
  summary: string | null;
  needs_human: boolean;
  status: string;
  created_at: string;
  messages: unknown;
};

export const listChatLeads = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<ChatLead[]> => {
    await assertAdmin(context as unknown as AuthedContext);
    const { data, error } = await context.supabase
      .from("chat_leads")
      .select("id, name, phone, summary, needs_human, status, created_at, messages")
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) throw new Error(error.message);
    return (data ?? []) as ChatLead[];
  });

export const setChatLeadStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string; status: string }) => input)
  .handler(async ({ data, context }) => {
    await assertAdmin(context as unknown as AuthedContext);
    const { error } = await context.supabase
      .from("chat_leads")
      .update({ status: data.status } as never)
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteChatLead = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string }) => input)
  .handler(async ({ data, context }) => {
    await assertAdmin(context as unknown as AuthedContext);
    const { error } = await context.supabase.from("chat_leads").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminExists = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { count } = await supabaseAdmin
    .from("user_roles")
    .select("id", { count: "exact", head: true })
    .eq("role", "admin");
  return { exists: (count ?? 0) > 0 };
});
