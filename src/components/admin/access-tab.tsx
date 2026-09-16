import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { addAdmin, listAdmins, removeAdmin } from "@/lib/admin.functions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AccessTab() {
  const load = useServerFn(listAdmins);
  const create = useServerFn(addAdmin);
  const remove = useServerFn(removeAdmin);

  const [admins, setAdmins] = useState<{ id: string; email: string }[]>([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function refresh() {
    try {
      setAdmins(await load());
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Не удалось загрузить список");
    }
  }

  useEffect(() => {
    void refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Кто может входить</CardTitle>
          <CardDescription>
            Доступ есть только у этих людей. Посторонние зарегистрироваться не могут.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {admins.map((admin) => (
            <div
              key={admin.id}
              className="flex items-center justify-between rounded-xl border border-border p-3"
            >
              <span className="text-sm">{admin.email}</span>
              <Button
                variant="outline"
                size="icon"
                aria-label="Убрать доступ"
                disabled={busy}
                onClick={async () => {
                  if (!confirm(`Убрать доступ у ${admin.email}?`)) return;
                  setBusy(true);
                  try {
                    await remove({ data: { userId: admin.id } });
                    await refresh();
                    toast.success("Доступ убран");
                  } catch (error) {
                    toast.error(error instanceof Error ? error.message : "Не удалось убрать доступ");
                  } finally {
                    setBusy(false);
                  }
                }}
              >
                <Trash2 aria-hidden="true" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Добавить человека</CardTitle>
          <CardDescription>
            Придумайте пароль и передайте его лично — он сможет менять всё то же, что и вы.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="new-admin-email">Почта</Label>
              <Input
                id="new-admin-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-admin-password">Пароль (от 8 символов)</Label>
              <Input
                id="new-admin-password"
                type="text"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>
          </div>
          <Button
            disabled={busy || !email || password.length < 8}
            onClick={async () => {
              setBusy(true);
              try {
                await create({ data: { email: email.trim(), password } });
                setEmail("");
                setPassword("");
                await refresh();
                toast.success("Доступ создан");
              } catch (error) {
                toast.error(error instanceof Error ? error.message : "Не удалось создать доступ");
              } finally {
                setBusy(false);
              }
            }}
          >
            Создать доступ
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
