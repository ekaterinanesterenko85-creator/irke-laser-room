import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { adminExists, bootstrapAdmin } from "@/lib/admin.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export const Route = createFileRoute("/admin")({
  component: AdminAuthPage,
  head: () => ({
    meta: [
      { title: "Вход в панель управления — Ирке LaserRoom" },
      { name: "description", content: "Вход для администраторов сайта Ирке LaserRoom." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Вход в панель управления — Ирке LaserRoom" },
      { property: "og:description", content: "Вход для администраторов сайта Ирке LaserRoom." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

function AdminAuthPage() {
  const navigate = useNavigate();
  const checkAdmin = useServerFn(adminExists);
  const createFirstAdmin = useServerFn(bootstrapAdmin);

  const [mode, setMode] = useState<"loading" | "login" | "setup">("loading");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        navigate({ to: "/panel", replace: true });
        return;
      }
      try {
        const result = await checkAdmin();
        if (active) setMode(result.exists ? "login" : "setup");
      } catch {
        if (active) setMode("login");
      }
    })();
    return () => {
      active = false;
    };
  }, [checkAdmin, navigate]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    try {
      if (mode === "setup") {
        await createFirstAdmin({ data: { email: email.trim(), password } });
      }
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error) throw new Error("Неверная почта или пароль");
      navigate({ to: "/panel", replace: true });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Не удалось войти");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-16">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">
            {mode === "setup" ? "Создание доступа" : "Панель управления"}
          </CardTitle>
          <CardDescription>
            {mode === "setup"
              ? "Задайте почту и пароль — это будет первый администратор сайта."
              : "Войдите, чтобы менять цены, тексты и фотографии на сайте."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {mode === "loading" ? (
            <p className="text-sm text-muted-foreground">Загрузка…</p>
          ) : (
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="email">Почта</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Пароль</Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete={mode === "setup" ? "new-password" : "current-password"}
                  required
                  minLength={8}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </div>
              <Button type="submit" className="w-full" disabled={busy}>
                {busy ? "Подождите…" : mode === "setup" ? "Создать доступ" : "Войти"}
              </Button>
            </form>
          )}
          <div className="mt-6 text-center">
            <a href="/" className="text-sm text-muted-foreground hover:text-foreground">
              Вернуться на сайт
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
