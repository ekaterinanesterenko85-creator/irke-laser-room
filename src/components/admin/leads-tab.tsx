import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";
import { Trash2, UserRound, CheckCheck } from "lucide-react";
import {
  listChatLeads,
  setChatLeadStatus,
  deleteChatLead,
  type ChatLead,
} from "@/lib/admin.functions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type LeadMessage = { role?: string; parts?: { type?: string; text?: string }[] };

function transcript(messages: unknown): { role: string; text: string }[] {
  if (!Array.isArray(messages)) return [];
  return (messages as LeadMessage[])
    .map((message) => ({
      role: message.role === "user" ? "Посетитель" : "Помощник",
      text: (message.parts ?? [])
        .filter((part) => part.type === "text" && part.text)
        .map((part) => part.text)
        .join(""),
    }))
    .filter((item) => item.text);
}

export function LeadsTab() {
  const load = useServerFn(listChatLeads);
  const setStatus = useServerFn(setChatLeadStatus);
  const remove = useServerFn(deleteChatLead);
  const [openId, setOpenId] = useState<string | null>(null);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["chat-leads"],
    queryFn: () => load(),
  });

  async function markDone(lead: ChatLead) {
    try {
      await setStatus({ data: { id: lead.id, status: lead.status === "done" ? "new" : "done" } });
      await refetch();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Не удалось сохранить");
    }
  }

  async function handleDelete(lead: ChatLead) {
    if (!window.confirm(`Удалить заявку от ${lead.name}?`)) return;
    try {
      await remove({ data: { id: lead.id } });
      toast.success("Заявка удалена");
      await refetch();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Не удалось удалить");
    }
  }

  if (isLoading) return <p className="text-sm text-muted-foreground">Загрузка…</p>;

  const leads = data ?? [];
  if (leads.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Заявок пока нет. Здесь появятся имя, телефон и переписка каждого, кто напишет помощнику.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {leads.map((lead) => {
        const lines = transcript(lead.messages);
        return (
          <Card key={lead.id}>
            <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3">
              <div className="min-w-0">
                <CardTitle className="text-base">
                  {lead.name} · {lead.phone}
                </CardTitle>
                <p className="mt-1 text-xs text-muted-foreground">
                  {new Date(lead.created_at).toLocaleString("ru-RU")}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {lead.needs_human ? (
                  <Badge variant="destructive">
                    <UserRound aria-hidden="true" /> Нужна Ирке
                  </Badge>
                ) : null}
                <Badge variant={lead.status === "done" ? "secondary" : "default"}>
                  {lead.status === "done" ? "Обработана" : "Новая"}
                </Badge>
                <Button variant="outline" size="sm" asChild>
                  <a
                    href={`https://wa.me/${lead.phone.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    WhatsApp
                  </a>
                </Button>
                <Button variant="outline" size="sm" onClick={() => markDone(lead)}>
                  <CheckCheck aria-hidden="true" />
                  {lead.status === "done" ? "Вернуть в новые" : "Обработана"}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Удалить заявку"
                  onClick={() => handleDelete(lead)}
                >
                  <Trash2 aria-hidden="true" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {lead.summary ? (
                <p className="text-sm text-foreground">{lead.summary}</p>
              ) : (
                <p className="text-sm text-muted-foreground">Пожеланий пока нет.</p>
              )}
              {lines.length > 0 ? (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setOpenId(openId === lead.id ? null : lead.id)}
                  >
                    {openId === lead.id ? "Скрыть переписку" : `Переписка (${lines.length})`}
                  </Button>
                  {openId === lead.id ? (
                    <div className="space-y-2 rounded-lg border border-border bg-muted/40 p-3">
                      {lines.map((line, index) => (
                        <p key={index} className="text-sm">
                          <span className="font-medium text-foreground">{line.role}: </span>
                          <span className="text-muted-foreground">{line.text}</span>
                        </p>
                      ))}
                    </div>
                  ) : null}
                </>
              ) : null}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
