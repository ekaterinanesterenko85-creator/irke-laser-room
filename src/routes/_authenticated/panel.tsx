import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { adminLoadAll } from "@/lib/admin.functions";
import { ServicesTab } from "@/components/admin/services-tab";
import { ImagesTab } from "@/components/admin/images-tab";
import { AccessTab } from "@/components/admin/access-tab";
import {
  ContentSection,
  ListSection,
  ParagraphsSection,
} from "@/components/admin/content-editor";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/_authenticated/panel")({
  component: PanelPage,
  head: () => ({
    meta: [
      { title: "Панель управления — Ирке LaserRoom" },
      { name: "description", content: "Управление ценами, текстами и фото сайта." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Панель управления — Ирке LaserRoom" },
      { property: "og:description", content: "Управление ценами, текстами и фото сайта." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

function PanelPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const loadAll = useServerFn(adminLoadAll);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["admin-data"],
    queryFn: () => loadAll(),
  });

  const reload = async () => {
    await refetch();
  };

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/admin", replace: true });
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
          <div>
            <h1 className="text-lg font-semibold">Панель управления</h1>
            <p className="text-sm text-muted-foreground">Ирке LaserRoom</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <a href="/" target="_blank" rel="noreferrer">
                Открыть сайт
              </a>
            </Button>
            <Button variant="outline" onClick={signOut}>
              <LogOut aria-hidden="true" />
              Выйти
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Загрузка…</p>
        ) : error || !data ? (
          <p className="text-sm text-destructive">
            Не удалось загрузить данные. Обновите страницу или войдите заново.
          </p>
        ) : (
          <Tabs defaultValue="services">
            <TabsList className="flex-wrap">
              <TabsTrigger value="services">Услуги и цены</TabsTrigger>
              <TabsTrigger value="promo">Акция</TabsTrigger>
              <TabsTrigger value="images">Фотографии</TabsTrigger>
              <TabsTrigger value="contacts">Контакты</TabsTrigger>
              <TabsTrigger value="texts">Тексты</TabsTrigger>
              <TabsTrigger value="leads">Заявки</TabsTrigger>
              <TabsTrigger value="chat">Чат-бот</TabsTrigger>
              <TabsTrigger value="access">Доступ</TabsTrigger>
            </TabsList>

            <TabsContent value="services" className="mt-6">
              <ServicesTab services={data.services} reload={reload} />
            </TabsContent>

            <TabsContent value="promo" className="mt-6">
              <ContentSection
                contentKey="promo"
                title="Акция"
                description="Выключите переключатель — блок акции и кнопка на первом экране исчезнут."
                values={data.content.promo as unknown as Record<string, unknown>}
                reload={reload}
                fields={[
                  { name: "enabled", label: "Показывать акцию на сайте", type: "switch" },
                  { name: "showInHero", label: "Показывать акцию на первом экране", type: "switch" },
                  { name: "title", label: "Название акции" },
                  { name: "button", label: "Текст кнопки" },
                  { name: "text", label: "Условия акции", type: "textarea" },
                  { name: "note", label: "Приписка под условиями", type: "textarea" },
                ]}
              />
            </TabsContent>

            <TabsContent value="images" className="mt-6">
              <ImagesTab images={data.images} reload={reload} />
            </TabsContent>

            <TabsContent value="contacts" className="mt-6">
              <ContentSection
                contentKey="contacts"
                title="Контакты и запись"
                description="Ссылки на мессенджеры, адрес и часы работы."
                values={data.content.contacts as unknown as Record<string, unknown>}
                reload={reload}
                fields={[
                  { name: "phone", label: "Телефон (как показывать)" },
                  { name: "phoneRaw", label: "Номер для WhatsApp, только цифры" },
                  { name: "phoneNote", label: "Приписка к телефону" },
                  { name: "whatsappText", label: "Текст сообщения при записи" },
                  { name: "address", label: "Адрес" },
                  { name: "addressNote", label: "Как найти" },
                  { name: "hours", label: "Часы работы" },
                  { name: "hoursNote", label: "Приписка к часам" },
                  { name: "bookingTitle", label: "Заголовок блока записи" },
                  { name: "telegram", label: "Ссылка на Telegram для записи" },
                  { name: "telegramChannel", label: "Ссылка на Telegram-канал" },
                  { name: "vkGroup", label: "Ссылка на ВК-сообщество" },
                  { name: "vkPersonal", label: "Ссылка на личную страницу ВК" },
                  { name: "avito", label: "Ссылка на Авито" },
                  { name: "showTelegram", label: "Показывать Telegram", type: "switch" },
                  { name: "showVk", label: "Показывать ВК", type: "switch" },
                  { name: "showAvito", label: "Показывать Авито", type: "switch" },
                ]}
              />
            </TabsContent>

            <TabsContent value="texts" className="mt-6 space-y-6">
              <ContentSection
                contentKey="hero"
                title="Первый экран"
                values={data.content.hero as unknown as Record<string, unknown>}
                reload={reload}
                fields={[
                  { name: "eyebrow", label: "Надпись сверху" },
                  { name: "title", label: "Название, первая часть" },
                  { name: "titleAccent", label: "Название, вторая часть" },
                  { name: "subtitle", label: "Описание", type: "textarea" },
                  { name: "offerLabel", label: "Плашка предложения" },
                  { name: "offerText", label: "Текст предложения" },
                  { name: "offerPrice", label: "Цена по акции" },
                  { name: "offerOldPrice", label: "Обычная цена" },
                  { name: "offerButton", label: "Текст кнопки" },
                  { name: "messengersNote", label: "Подпись над мессенджерами" },
                  { name: "replyNote", label: "Приписка про ответ" },
                ]}
              />
              <ContentSection
                contentKey="brand"
                title="Название и меню"
                values={data.content.brand as unknown as Record<string, unknown>}
                reload={reload}
                fields={[
                  { name: "first", label: "Название, первая часть" },
                  { name: "second", label: "Название, вторая часть" },
                  { name: "tagline", label: "Подпись под названием" },
                  { name: "navCta", label: "Кнопка в верхней панели" },
                ]}
              />
              <ContentSection
                contentKey="sections"
                title="Заголовки разделов"
                values={data.content.sections as unknown as Record<string, unknown>}
                reload={reload}
                fields={[
                  { name: "servicesTitle", label: "Услуги — заголовок" },
                  { name: "servicesSubtitle", label: "Услуги — подзаголовок" },
                  { name: "complexesTitle", label: "Комплексы — заголовок" },
                  { name: "complexesSubtitle", label: "Комплексы — подзаголовок" },
                  { name: "aboutTitle", label: "О мастере — заголовок" },
                  { name: "galleryTitle", label: "Кабинет — заголовок" },
                  { name: "gallerySubtitle", label: "Кабинет — подзаголовок" },
                  { name: "processTitle", label: "Как проходит визит — заголовок" },
                  { name: "faqTitle", label: "Вопросы — заголовок" },
                  { name: "contactsTitle", label: "Контакты — заголовок" },
                ]}
              />
              <ParagraphsSection
                contentKey="about"
                title="О мастере"
                description="Текст рядом с фото. Каждый абзац — отдельное поле."
                paragraphs={data.content.about.paragraphs}
                reload={reload}
              />
              <ListSection
                contentKey="why_us"
                title="Почему выбирают"
                items={data.content.why_us.items}
                emptyItem={{ title: "", text: "" }}
                reload={reload}
                fields={[
                  { name: "title", label: "Заголовок" },
                  { name: "text", label: "Текст", type: "textarea" },
                ]}
              />
              <ListSection
                contentKey="steps"
                title="Как проходит визит"
                items={data.content.steps.items}
                emptyItem={{ title: "", text: "" }}
                reload={reload}
                fields={[
                  { name: "title", label: "Заголовок шага" },
                  { name: "text", label: "Текст шага", type: "textarea" },
                ]}
              />
              <ListSection
                contentKey="faq"
                title="Вопросы и ответы"
                items={data.content.faq.items}
                emptyItem={{ question: "", answer: "" }}
                reload={reload}
                fields={[
                  { name: "question", label: "Вопрос" },
                  { name: "answer", label: "Ответ", type: "textarea" },
                ]}
              />
              <ContentSection
                contentKey="footer"
                title="Подвал сайта"
                values={data.content.footer as unknown as Record<string, unknown>}
                reload={reload}
                fields={[
                  { name: "title", label: "Название" },
                  { name: "subtitle", label: "Подпись" },
                  { name: "disclaimer", label: "Дисклеймер", type: "textarea" },
                ]}
              />
              <ContentSection
                contentKey="seo"
                title="Как сайт выглядит в поиске"
                values={data.content.seo as unknown as Record<string, unknown>}
                reload={reload}
                fields={[
                  { name: "title", label: "Заголовок страницы" },
                  { name: "description", label: "Описание страницы", type: "textarea" },
                  { name: "ogTitle", label: "Заголовок при отправке ссылки" },
                  { name: "ogDescription", label: "Описание при отправке ссылки", type: "textarea" },
                ]}
              />
            </TabsContent>

            <TabsContent value="access" className="mt-6">
              <AccessTab />
            </TabsContent>
          </Tabs>
        )}
      </main>
    </div>
  );
}
