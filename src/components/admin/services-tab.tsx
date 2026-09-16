import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { deleteService, reorderServices, saveService } from "@/lib/admin.functions";
import type { Service } from "@/lib/site-defaults";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Props = { services: Service[]; reload: () => Promise<unknown> };

export function ServicesTab({ services, reload }: Props) {
  return (
    <Tabs defaultValue="zone">
      <TabsList>
        <TabsTrigger value="zone">Отдельные зоны</TabsTrigger>
        <TabsTrigger value="complex">Комплексы</TabsTrigger>
      </TabsList>
      <TabsContent value="zone" className="mt-6">
        <ServiceList kind="zone" services={services} reload={reload} />
      </TabsContent>
      <TabsContent value="complex" className="mt-6">
        <ServiceList kind="complex" services={services} reload={reload} />
      </TabsContent>
    </Tabs>
  );
}

function ServiceList({
  kind,
  services,
  reload,
}: Props & { kind: "zone" | "complex" }) {
  const save = useServerFn(saveService);
  const remove = useServerFn(deleteService);
  const reorder = useServerFn(reorderServices);
  const [busy, setBusy] = useState(false);

  const list = services
    .filter((service) => service.kind === kind)
    .sort((a, b) => a.sort_order - b.sort_order);

  async function move(index: number, direction: -1 | 1) {
    const next = [...list];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    const current = next[index]!;
    next[index] = next[target]!;
    next[target] = current;
    setBusy(true);
    try {
      await reorder({ data: { ids: next.map((service) => service.id) } });
      await reload();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Не удалось изменить порядок");
    } finally {
      setBusy(false);
    }
  }

  async function addNew() {
    setBusy(true);
    try {
      await save({
        data: {
          kind,
          title: kind === "zone" ? "Новая зона" : "Новый комплекс",
          description: null,
          price: "0 ₽",
          badge: null,
          sort_order: list.length + 1,
          is_visible: true,
        },
      });
      await reload();
      toast.success("Добавлено");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Не удалось добавить");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      {list.map((service, index) => (
        <ServiceRow
          key={service.id}
          service={service}
          busy={busy}
          onMoveUp={index > 0 ? () => move(index, -1) : undefined}
          onMoveDown={index < list.length - 1 ? () => move(index, 1) : undefined}
          onSave={async (patch) => {
            await save({ data: { ...service, ...patch, id: service.id } });
            await reload();
            toast.success("Сохранено");
          }}
          onDelete={async () => {
            await remove({ data: { id: service.id } });
            await reload();
            toast.success("Удалено");
          }}
        />
      ))}
      <Button variant="outline" onClick={addNew} disabled={busy}>
        <Plus aria-hidden="true" />
        {kind === "zone" ? "Добавить зону" : "Добавить комплекс"}
      </Button>
    </div>
  );
}

function ServiceRow({
  service,
  busy,
  onSave,
  onDelete,
  onMoveUp,
  onMoveDown,
}: {
  service: Service;
  busy: boolean;
  onSave: (patch: Partial<Service>) => Promise<void>;
  onDelete: () => Promise<void>;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
}) {
  const [draft, setDraft] = useState(service);
  const [saving, setSaving] = useState(false);

  async function run(action: () => Promise<void>) {
    setSaving(true);
    try {
      await action();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Не удалось сохранить");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card>
      <CardContent className="grid gap-4 pt-6 md:grid-cols-[2fr_1fr_1fr_auto]">
        <div className="space-y-2">
          <Label>Название</Label>
          <Input
            value={draft.title}
            onChange={(event) => setDraft({ ...draft, title: event.target.value })}
          />
          <Label className="pt-2">Описание (необязательно)</Label>
          <Input
            value={draft.description ?? ""}
            onChange={(event) =>
              setDraft({ ...draft, description: event.target.value || null })
            }
          />
        </div>
        <div className="space-y-2">
          <Label>Цена</Label>
          <Input
            value={draft.price}
            onChange={(event) => setDraft({ ...draft, price: event.target.value })}
          />
          <Label className="pt-2">Плашка (например «Популярный»)</Label>
          <Input
            value={draft.badge ?? ""}
            onChange={(event) => setDraft({ ...draft, badge: event.target.value || null })}
          />
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Switch
              id={`visible-${service.id}`}
              checked={draft.is_visible}
              onCheckedChange={(checked) => setDraft({ ...draft, is_visible: checked })}
            />
            <Label htmlFor={`visible-${service.id}`}>Показывать на сайте</Label>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              aria-label="Выше"
              disabled={!onMoveUp || busy}
              onClick={onMoveUp}
            >
              <ArrowUp aria-hidden="true" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              aria-label="Ниже"
              disabled={!onMoveDown || busy}
              onClick={onMoveDown}
            >
              <ArrowDown aria-hidden="true" />
            </Button>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Button disabled={saving} onClick={() => run(() => onSave(draft))}>
            Сохранить
          </Button>
          <Button
            variant="outline"
            disabled={saving}
            aria-label="Удалить"
            onClick={() => {
              if (confirm(`Удалить «${service.title}»?`)) void run(onDelete);
            }}
          >
            <Trash2 aria-hidden="true" />
            Удалить
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
