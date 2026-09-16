import { createFileRoute } from "@tanstack/react-router";
import { getSiteData } from "@/lib/site-content.functions";
import { defaultContent } from "@/lib/site-defaults";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/privacy")({
  loader: () => getSiteData(),
  component: PrivacyPage,
  head: ({ loaderData }) => {
    const chat = loaderData?.content.chat ?? defaultContent.chat;
    const title = `${chat.privacyTitle} — Ирке LaserRoom`;
    const description =
      "Как кабинет лазерной эпиляции Ирке LaserRoom обрабатывает имя и телефон, оставленные в чате на сайте.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary" },
      ],
      links: [{ rel: "canonical", href: "/privacy" }],
    };
  },
});

function PrivacyPage() {
  const data = Route.useLoaderData();
  const chat = data.content.chat ?? defaultContent.chat;
  const paragraphs = chat.privacyText.split("\n").filter((line) => line.trim());

  return (
    <main className="min-h-screen bg-background py-16">
      <div className="container mx-auto max-w-2xl px-4">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          {chat.privacyTitle}
        </h1>
        <div className="mt-6 space-y-4">
          {paragraphs.map((paragraph, index) => (
            <p key={index} className="text-muted-foreground">
              {paragraph}
            </p>
          ))}
        </div>
        <Button asChild variant="outline" className="mt-10">
          <a href="/">На главную</a>
        </Button>
      </div>
    </main>
  );
}
