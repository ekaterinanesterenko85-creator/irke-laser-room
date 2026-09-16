import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { deleteImage, saveImage } from "@/lib/admin.functions";
import type { SiteImage } from "@/lib/site-defaults";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = { images: SiteImage[]; reload: () => Promise<unknown> };

async function uploadFile(file: File) {
  const extension = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const path = `${crypto.randomUUID()}.${extension}`;
  const { error } = await supabase.storage.from("site-images").upload(path, file, {
    contentType: file.type || "image/jpeg",
  });
  if (error) throw new Error(error.message);
  return { path, url: `/api/public/site-image/${path}` };
}

export function ImagesTab({ images, reload }: Props) {
  return (
    <div className="space-y-8">
      <SlotSection
        slot="hero"
        title="Фото на первом экране"
        description="Одно фото — фон верхней части сайта."
        single
        images={images}
        reload={reload}
      />
      <SlotSection
        slot="about"
        title="Фото в разделе «О мастере»"
        description="Одно фото рядом с текстом о вас."
        single
        images={images}
        reload={reload}
      />
      <SlotSection
        slot="gallery"
        title="Галерея кабинета"
        description="Несколько фото, показываются в разделе «Кабинет»."
        images={images}
        reload={reload}
      />
    </div>
  );
}

function SlotSection({
  slot,
  title,
  description,
  single,
  images,
  reload,
}: Props & {
  slot: "hero" | "about" | "gallery";
  title: string;
  description: string;
  single?: boolean;
}) {
  const save = useServerFn(saveImage);
  const remove = useServerFn(deleteImage);
  const [busy, setBusy] = useState(false);

  const list = images
    .filter((image) => image.slot === slot)
    .sort((a, b) => a.sort_order - b.sort_order);

  async function handleUpload(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    try {
      const { path, url } = await uploadFile(file);
      await save({
        data: {
          slot,
          url,
          storage_path: path,
          alt: title,
          sort_order: single ? 1 : list.length + 1,
          replace: Boolean(single),
        },
      });
      await reload();
      toast.success("Фото загружено");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Не удалось загрузить фото");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((image) => (
            <ImageCard
              key={image.id}
              image={image}
              onSaveAlt={async (alt) => {
                await save({ data: { id: image.id, slot, alt } });
                await reload();
                toast.success("Сохранено");
              }}
              onDelete={async () => {
                await remove({ data: { id: image.id } });
                await reload();
                toast.success("Фото удалено");
              }}
            />
          ))}
        </div>

        <div>
          <Label htmlFor={`upload-${slot}`} className="sr-only">
            Загрузить фото
          </Label>
          <input
            id={`upload-${slot}`}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(event) => {
              void handleUpload(event.target.files?.[0]);
              event.target.value = "";
            }}
          />
          <Button
            variant="outline"
            disabled={busy}
            onClick={() => document.getElementById(`upload-${slot}`)?.click()}
          >
            <Upload aria-hidden="true" />
            {busy ? "Загрузка…" : single && list.length > 0 ? "Заменить фото" : "Загрузить фото"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function ImageCard({
  image,
  onSaveAlt,
  onDelete,
}: {
  image: SiteImage;
  onSaveAlt: (alt: string) => Promise<void>;
  onDelete: () => Promise<void>;
}) {
  const [alt, setAlt] = useState(image.alt);
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
    <div className="space-y-2 rounded-xl border border-border p-3">
      <img
        src={image.url}
        alt={image.alt}
        className="aspect-[4/3] w-full rounded-lg object-cover"
        loading="lazy"
      />
      <Label className="text-xs">Описание фото</Label>
      <Input value={alt} onChange={(event) => setAlt(event.target.value)} />
      <div className="flex gap-2">
        <Button size="sm" disabled={saving} onClick={() => run(() => onSaveAlt(alt))}>
          Сохранить
        </Button>
        <Button
          size="sm"
          variant="outline"
          disabled={saving}
          onClick={() => {
            if (confirm("Удалить это фото?")) void run(onDelete);
          }}
        >
          <Trash2 aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
}
