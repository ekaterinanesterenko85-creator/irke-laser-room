import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { saveContentKey } from "@/lib/admin.functions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

export type Field = {
  name: string;
  label: string;
  type?: "text" | "textarea" | "switch";
};

type Values = Record<string, unknown>;

export function ContentSection({
  contentKey,
  title,
  description,
  fields,
  values,
  reload,
}: {
  contentKey: string;
  title: string;
  description?: string;
  fields: Field[];
  values: Values;
  reload: () => Promise<unknown>;
}) {
  const save = useServerFn(saveContentKey);
  const [draft, setDraft] = useState<Values>(values);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      await save({ data: { key: contentKey, value: draft } });
      await reload();
      toast.success("Сохранено");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Не удалось сохранить");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          {fields.map((field) => (
            <div
              key={field.name}
              className={`space-y-2 ${field.type === "textarea" ? "md:col-span-2" : ""}`}
            >
              {field.type === "switch" ? (
                <div className="flex items-center gap-3 pt-2">
                  <Switch
                    id={`${contentKey}-${field.name}`}
                    checked={Boolean(draft[field.name])}
                    onCheckedChange={(checked) =>
                      setDraft({ ...draft, [field.name]: checked })
                    }
                  />
                  <Label htmlFor={`${contentKey}-${field.name}`}>{field.label}</Label>
                </div>
              ) : (
                <>
                  <Label htmlFor={`${contentKey}-${field.name}`}>{field.label}</Label>
                  {field.type === "textarea" ? (
                    <Textarea
                      id={`${contentKey}-${field.name}`}
                      rows={3}
                      value={String(draft[field.name] ?? "")}
                      onChange={(event) =>
                        setDraft({ ...draft, [field.name]: event.target.value })
                      }
                    />
                  ) : (
                    <Input
                      id={`${contentKey}-${field.name}`}
                      value={String(draft[field.name] ?? "")}
                      onChange={(event) =>
                        setDraft({ ...draft, [field.name]: event.target.value })
                      }
                    />
                  )}
                </>
              )}
            </div>
          ))}
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Сохранение…" : "Сохранить"}
        </Button>
      </CardContent>
    </Card>
  );
}

export function ParagraphsSection({
  contentKey,
  title,
  description,
  paragraphs,
  reload,
}: {
  contentKey: string;
  title: string;
  description?: string;
  paragraphs: string[];
  reload: () => Promise<unknown>;
}) {
  const save = useServerFn(saveContentKey);
  const [items, setItems] = useState<string[]>(paragraphs);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      await save({
        data: { key: contentKey, value: { paragraphs: items.filter((item) => item.trim()) } },
      });
      await reload();
      toast.success("Сохранено");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Не удалось сохранить");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>
      <CardContent className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="space-y-2">
            <Label htmlFor={`${contentKey}-p-${index}`}>Абзац {index + 1}</Label>
            <div className="flex gap-2">
              <Textarea
                id={`${contentKey}-p-${index}`}
                rows={3}
                value={item}
                onChange={(event) => {
                  const next = [...items];
                  next[index] = event.target.value;
                  setItems(next);
                }}
              />
              <Button
                variant="outline"
                size="icon"
                aria-label="Удалить абзац"
                onClick={() => setItems(items.filter((_, i) => i !== index))}
              >
                <Trash2 aria-hidden="true" />
              </Button>
            </div>
          </div>
        ))}
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setItems([...items, ""])}>
            <Plus aria-hidden="true" />
            Добавить абзац
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Сохранение…" : "Сохранить"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function ListSection<T extends Record<string, string>>({
  contentKey,
  title,
  description,
  items: initialItems,
  fields,
  emptyItem,
  reload,
}: {
  contentKey: string;
  title: string;
  description?: string;
  items: T[];
  fields: { name: keyof T & string; label: string; type?: "text" | "textarea" }[];
  emptyItem: T;
  reload: () => Promise<unknown>;
}) {
  const save = useServerFn(saveContentKey);
  const [items, setItems] = useState<T[]>(initialItems);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      await save({ data: { key: contentKey, value: { items } } });
      await reload();
      toast.success("Сохранено");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Не удалось сохранить");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>
      <CardContent className="space-y-6">
        {items.map((item, index) => (
          <div key={index} className="space-y-3 rounded-xl border border-border p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">Пункт {index + 1}</p>
              <Button
                variant="outline"
                size="icon"
                aria-label="Удалить пункт"
                onClick={() => setItems(items.filter((_, i) => i !== index))}
              >
                <Trash2 aria-hidden="true" />
              </Button>
            </div>
            {fields.map((field) => (
              <div key={field.name} className="space-y-2">
                <Label htmlFor={`${contentKey}-${index}-${field.name}`}>{field.label}</Label>
                {field.type === "textarea" ? (
                  <Textarea
                    id={`${contentKey}-${index}-${field.name}`}
                    rows={3}
                    value={item[field.name] ?? ""}
                    onChange={(event) => {
                      const next = [...items];
                      next[index] = { ...item, [field.name]: event.target.value };
                      setItems(next);
                    }}
                  />
                ) : (
                  <Input
                    id={`${contentKey}-${index}-${field.name}`}
                    value={item[field.name] ?? ""}
                    onChange={(event) => {
                      const next = [...items];
                      next[index] = { ...item, [field.name]: event.target.value };
                      setItems(next);
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        ))}
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setItems([...items, { ...emptyItem }])}>
            <Plus aria-hidden="true" />
            Добавить пункт
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Сохранение…" : "Сохранить"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
