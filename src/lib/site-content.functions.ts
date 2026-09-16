import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import {
  defaultSiteData,
  mergeContent,
  type Service,
  type SiteData,
  type SiteImage,
} from "./site-defaults";

function publicClient() {
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  const url = process.env["SUPABASE_URL"]!;
  return createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const headers = new Headers(init?.headers);
        if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) {
          headers.delete("Authorization");
        }
        headers.set("apikey", key);
        return fetch(input, { ...init, headers });
      },
    },
  });
}

export const getSiteData = createServerFn({ method: "GET" }).handler(
  async (): Promise<SiteData> => {
    try {
      const supabase = publicClient();
      const [contentRes, servicesRes, imagesRes] = await Promise.all([
        supabase.from("site_content").select("key, value"),
        supabase
          .from("services")
          .select("id, kind, title, description, price, badge, sort_order, is_visible")
          .eq("is_visible", true)
          .order("sort_order", { ascending: true }),
        supabase
          .from("site_images")
          .select("id, slot, url, storage_path, alt, sort_order")
          .order("sort_order", { ascending: true }),
      ]);

      return {
        content: mergeContent(
          (contentRes.data ?? []) as { key: string; value: unknown }[],
        ),
        services: (servicesRes.data ?? []) as Service[],
        images: (imagesRes.data ?? []) as SiteImage[],
      };
    } catch (error) {
      console.error("getSiteData failed", error);
      return defaultSiteData;
    }
  },
);
