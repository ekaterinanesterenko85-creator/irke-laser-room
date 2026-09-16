import { createFileRoute } from "@tanstack/react-router";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  MapPin,
  Clock,
  Phone,
  MessageCircle,
  Send,
  ShieldCheck,
  HeartHandshake,
  Signature,
  Sparkles,
  Menu,
  Moon,
  Sun,
} from "lucide-react";
import { useEffect, useState } from "react";
import cabinet1Asset from "@/assets/cabinet-1.jpg.asset.json";
import cabinet2Asset from "@/assets/cabinet-2.jpg.asset.json";
import cabinet3Asset from "@/assets/cabinet-3.jpg.asset.json";
import irkeAparatusAsset from "@/assets/irke-aparatus.jpg.asset.json";
import irkeMirrorAsset from "@/assets/irke-mirror.jpg.asset.json";
import { getSiteData } from "@/lib/site-content.functions";
import { defaultContent, type Contacts as ContactsData, type SiteData } from "@/lib/site-defaults";

export const Route = createFileRoute("/")({
  loader: () => getSiteData(),
  component: Index,
  errorComponent: () => (
    <div className="flex min-h-screen items-center justify-center px-4 text-center">
      <p className="text-muted-foreground">
        Страница временно недоступна. Обновите её, пожалуйста.
      </p>
    </div>
  ),
  head: ({ loaderData }) => {
    const seo = loaderData?.content.seo ?? defaultContent.seo;
    return {
      meta: [
        { title: seo.title },
        { name: "description", content: seo.description },
        { property: "og:title", content: seo.ogTitle },
        { property: "og:description", content: seo.ogDescription },
        { property: "og:type", content: "website" },
        { property: "og:url", content: "/" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: "/" }],
    };
  },
});

const navItems = [
  { label: "Услуги", href: "#services" },
  { label: "Комплексы", href: "#complexes" },
  { label: "Акция", href: "#promo" },
  { label: "О мастере", href: "#about" },
  { label: "Контакты", href: "#contacts" },
];

const whyUsIcons = [Sparkles, HeartHandshake, ShieldCheck, Clock];

const fallbackGallery = [
  { url: cabinet2Asset.url, alt: "Кабинет Ирке LaserRoom" },
  { url: cabinet3Asset.url, alt: "Кабинет Ирке LaserRoom" },
  { url: irkeMirrorAsset.url, alt: "Ирке Маслова в кабинете" },
];

function whatsappLink(contacts: ContactsData, extra?: string) {
  const text = extra ? `${contacts.whatsappText} ${extra}` : contacts.whatsappText;
  return `https://wa.me/${contacts.phoneRaw}?text=${encodeURIComponent(text)}`;
}

function MessengerButtons({
  contacts,
  fullWidth = false,
}: {
  contacts: ContactsData;
  fullWidth?: boolean;
}) {
  return (
    <div className={`flex flex-wrap gap-3 ${fullWidth ? "w-full" : ""}`}>
      <Button asChild variant="default" className={fullWidth ? "flex-1" : ""}>
        <a href={whatsappLink(contacts)} target="_blank" rel="noopener noreferrer">
          <MessageCircle className="mr-2 h-4 w-4" />
          WhatsApp
        </a>
      </Button>
      {contacts.showTelegram && contacts.telegram ? (
        <Button asChild variant="secondary" className={fullWidth ? "flex-1" : ""}>
          <a href={contacts.telegram} target="_blank" rel="noopener noreferrer">
            <Send className="mr-2 h-4 w-4" />
            Telegram
          </a>
        </Button>
      ) : null}
      {contacts.showVk && contacts.vkPersonal ? (
        <Button asChild variant="secondary" className={fullWidth ? "flex-1" : ""}>
          <a href={contacts.vkPersonal} target="_blank" rel="noopener noreferrer">
            VK
          </a>
        </Button>
      ) : null}
    </div>
  );
}

function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("irke-theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const shouldUseDark = savedTheme ? savedTheme === "dark" : prefersDark;

    document.documentElement.classList.toggle("dark", shouldUseDark);
    document.documentElement.style.colorScheme = shouldUseDark ? "dark" : "light";
    setIsDark(shouldUseDark);
  }, []);

  const toggleTheme = () => {
    const nextIsDark = !isDark;
    document.documentElement.classList.toggle("dark", nextIsDark);
    document.documentElement.style.colorScheme = nextIsDark ? "dark" : "light";
    window.localStorage.setItem("irke-theme", nextIsDark ? "dark" : "light");
    setIsDark(nextIsDark);
  };

  const label = isDark ? "Включить светлую тему" : "Включить тёмную тему";

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      className="shrink-0 rounded-full"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
    >
      {isDark ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}
    </Button>
  );
}

function Header({ data }: { data: SiteData }) {
  const { brand, contacts } = data.content;
  const items = data.content.promo.enabled
    ? navItems
    : navItems.filter((item) => item.href !== "#promo");

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 lg:px-8">
        <a href="/" className="text-xl font-semibold tracking-tight text-foreground">
          {brand.first} <span className="text-primary">{brand.second}</span>
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {items.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Button asChild size="sm" className="rounded-full px-6">
            <a href={whatsappLink(contacts)} target="_blank" rel="noopener noreferrer">
              {brand.navCta}
            </a>
          </Button>
          <ThemeToggle />
        </div>

        <div className="flex items-center gap-1 md:hidden">
          <ThemeToggle />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Открыть меню">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <div className="flex flex-col gap-6 pt-8">
                {items.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className="text-lg font-medium text-foreground hover:text-primary"
                  >
                    {item.label}
                  </a>
                ))}
                <Button asChild className="mt-4 w-full">
                  <a href={whatsappLink(contacts)} target="_blank" rel="noopener noreferrer">
                    {brand.navCta}
                  </a>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

function Hero({ data }: { data: SiteData }) {
  const { hero, contacts, promo } = data.content;
  const heroImage = data.images.find((image) => image.slot === "hero");
  const imageUrl = heroImage?.url ?? cabinet1Asset.url;
  const imageAlt = heroImage?.alt ?? "Кабинет лазерной эпиляции Ирке LaserRoom";
  const showOffer = promo.enabled && promo.showInHero;

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <img
          src={imageUrl}
          alt={imageAlt}
          className="h-full w-full object-cover opacity-30"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
      </div>

      <div className="container mx-auto px-4 py-20 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-4 text-sm font-medium uppercase tracking-wider text-primary">
            {hero.eyebrow}
          </p>
          <h1 className="text-4xl font-semibold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            {hero.title} <span className="text-primary">{hero.titleAccent}</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">{hero.subtitle}</p>

          {showOffer ? (
            <div className="mx-auto mt-8 inline-flex flex-col items-center gap-4 rounded-2xl border border-border/60 bg-card/80 p-6 shadow-sm backdrop-blur-sm sm:flex-row">
              <div className="text-center sm:text-left">
                <p className="text-sm text-muted-foreground">{hero.offerLabel}</p>
                <p className="text-2xl font-semibold text-foreground">
                  {hero.offerText} <span className="text-primary">{hero.offerPrice}</span>
                </p>
                <p className="text-sm text-muted-foreground line-through">{hero.offerOldPrice}</p>
              </div>
              <Button asChild size="lg" className="rounded-full px-8 shadow-md">
                <a href={whatsappLink(contacts)} target="_blank" rel="noopener noreferrer">
                  {hero.offerButton}
                  <Signature aria-hidden="true" />
                </a>
              </Button>
            </div>
          ) : null}

          <div className="mt-10 flex flex-col items-center gap-3">
            <p className="text-sm text-muted-foreground">{hero.messengersNote}</p>
            <MessengerButtons contacts={contacts} />
          </div>

          <p className="mt-6 text-sm text-muted-foreground">{hero.replyNote}</p>
        </div>
      </div>
    </section>
  );
}

function Services({ data }: { data: SiteData }) {
  const { sections } = data.content;
  const zones = data.services.filter((service) => service.kind === "zone");
  if (zones.length === 0) return null;

  return (
    <section id="services" className="py-16 lg:py-24">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            {sections.servicesTitle}
          </h2>
          <p className="mt-4 text-muted-foreground">{sections.servicesSubtitle}</p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {zones.map((zone) => (
            <Card key={zone.id} className="group transition-shadow hover:shadow-md">
              <CardContent className="flex items-center justify-between p-5">
                <span className="font-medium text-foreground">{zone.title}</span>
                <span className="text-lg font-semibold text-primary">{zone.price}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function Complexes({ data }: { data: SiteData }) {
  const { sections, contacts } = data.content;
  const complexes = data.services.filter((service) => service.kind === "complex");
  if (complexes.length === 0) return null;

  return (
    <section id="complexes" className="bg-muted/50 py-16 lg:py-24">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            {sections.complexesTitle}
          </h2>
          <p className="mt-4 text-muted-foreground">{sections.complexesSubtitle}</p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {complexes.map((complex) => (
            <Card
              key={complex.id}
              className={`relative flex flex-col transition-shadow hover:shadow-md ${
                complex.badge ? "border-primary/30" : ""
              }`}
            >
              {complex.badge && (
                <span className="absolute -top-3 left-4 rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                  {complex.badge}
                </span>
              )}
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl">{complex.title}</CardTitle>
                <CardDescription>{complex.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col justify-end">
                <p className="text-3xl font-semibold text-primary">{complex.price}</p>
                <Button asChild variant="outline" className="mt-4 w-full">
                  <a
                    href={whatsappLink(contacts, `на комплекс ${complex.title}`)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Записаться
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function Promo({ data }: { data: SiteData }) {
  const { promo, contacts } = data.content;
  if (!promo.enabled) return null;

  return (
    <section id="promo" className="py-16 lg:py-24">
      <div className="container mx-auto px-4 lg:px-8">
        <Card className="mx-auto max-w-3xl overflow-hidden border-primary/20 bg-gradient-to-br from-primary/10 to-background">
          <CardContent className="flex flex-col items-center gap-6 p-8 text-center md:flex-row md:text-left lg:p-12">
            <div className="flex-1">
              <h2 className="text-3xl font-semibold tracking-tight text-foreground">
                {promo.title}
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">{promo.text}</p>
              {promo.note ? (
                <p className="mt-3 text-sm text-muted-foreground">{promo.note}</p>
              ) : null}
            </div>
            <Button asChild size="lg" className="rounded-full px-8 shadow-md">
              <a
                href={whatsappLink(contacts, promo.title)}
                target="_blank"
                rel="noopener noreferrer"
              >
                {promo.button}
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

function About({ data }: { data: SiteData }) {
  const { sections, about, why_us: whyUs } = data.content;
  const aboutImage = data.images.find((image) => image.slot === "about");

  return (
    <section id="about" className="bg-muted/50 py-16 lg:py-24">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="mx-auto grid max-w-6xl items-stretch gap-8 lg:grid-cols-[5fr_7fr] lg:gap-12">
          <div className="relative flex">
            <img
              src={aboutImage?.url ?? irkeAparatusAsset.url}
              alt={aboutImage?.alt ?? "Ирке Маслова — мастер лазерной эпиляции"}
              className="h-full min-h-[28rem] w-full rounded-2xl object-cover shadow-md"
              width={800}
              height={1000}
              loading="lazy"
            />
          </div>
          <div className="flex flex-col justify-between">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                {sections.aboutTitle}
              </h2>
              {about.paragraphs.map((paragraph, index) => (
                <p
                  key={index}
                  className={
                    index === 0
                      ? "mt-6 text-lg text-muted-foreground"
                      : "mt-4 text-muted-foreground"
                  }
                >
                  {paragraph}
                </p>
              ))}
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {whyUs.items.map((item, index) => {
                const Icon = whyUsIcons[index % whyUsIcons.length]!;
                return (
                  <Card key={item.title} className="transition-shadow hover:shadow-md">
                    <CardContent className="p-5">
                      <Icon className="h-8 w-8 text-primary" />
                      <h3 className="mt-4 font-semibold text-foreground">{item.title}</h3>
                      <p className="mt-2 text-sm text-muted-foreground">{item.text}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Gallery({ data }: { data: SiteData }) {
  const { sections } = data.content;
  const gallery = data.images.filter((image) => image.slot === "gallery");
  const items = gallery.length > 0 ? gallery : fallbackGallery;
  if (items.length === 0) return null;

  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            {sections.galleryTitle}
          </h2>
          <p className="mt-4 text-muted-foreground">{sections.gallerySubtitle}</p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((image, index) => (
            <div key={index} className="overflow-hidden rounded-2xl">
              <img
                src={image.url}
                alt={image.alt}
                className="h-64 w-full object-cover transition-transform duration-500 hover:scale-105"
                width={600}
                height={400}
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Process({ data }: { data: SiteData }) {
  const { sections, steps } = data.content;
  if (steps.items.length === 0) return null;

  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            {sections.processTitle}
          </h2>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.items.map((step, index) => (
            <div key={step.title} className="relative">
              <Card className="h-full transition-shadow hover:shadow-md">
                <CardContent className="p-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                    {index + 1}
                  </div>
                  <h3 className="mt-4 font-semibold text-foreground">{step.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{step.text}</p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQ({ data }: { data: SiteData }) {
  const { sections, faq } = data.content;
  if (faq.items.length === 0) return null;

  return (
    <section className="bg-muted/50 py-16 lg:py-24">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-center text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            {sections.faqTitle}
          </h2>
          <Accordion type="single" collapsible className="mt-12">
            {faq.items.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left text-foreground">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}

function Contacts({ data }: { data: SiteData }) {
  const { sections, contacts } = data.content;

  return (
    <section id="contacts" className="py-16 lg:py-24">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            {sections.contactsTitle}
          </h2>

          <Card className="mt-12">
            <CardContent className="grid gap-8 p-8 md:grid-cols-2">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <MapPin className="mt-1 h-5 w-5 shrink-0 text-primary" />
                  <div>
                    <p className="font-medium text-foreground">{contacts.address}</p>
                    <p className="text-sm text-muted-foreground">{contacts.addressNote}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Clock className="mt-1 h-5 w-5 shrink-0 text-primary" />
                  <div>
                    <p className="font-medium text-foreground">{contacts.hours}</p>
                    <p className="text-sm text-muted-foreground">{contacts.hoursNote}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Phone className="mt-1 h-5 w-5 shrink-0 text-primary" />
                  <div>
                    <p className="font-medium text-foreground">{contacts.phone}</p>
                    <p className="text-sm text-muted-foreground">{contacts.phoneNote}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <p className="font-medium text-foreground">{contacts.bookingTitle}</p>
                <MessengerButtons contacts={contacts} fullWidth />

                <div className="mt-6 flex flex-wrap gap-3">
                  {contacts.showTelegram && contacts.telegramChannel ? (
                    <Button asChild variant="ghost" size="sm">
                      <a
                        href={contacts.telegramChannel}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Send className="mr-2 h-4 w-4" />
                        Telegram-канал
                      </a>
                    </Button>
                  ) : null}
                  {contacts.showVk && contacts.vkGroup ? (
                    <Button asChild variant="ghost" size="sm">
                      <a href={contacts.vkGroup} target="_blank" rel="noopener noreferrer">
                        VK-сообщество
                      </a>
                    </Button>
                  ) : null}
                  {contacts.showAvito && contacts.avito ? (
                    <Button asChild variant="ghost" size="sm">
                      <a href={contacts.avito} target="_blank" rel="noopener noreferrer">
                        Авито
                      </a>
                    </Button>
                  ) : null}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

function Footer({ data }: { data: SiteData }) {
  const { footer, contacts } = data.content;

  return (
    <footer className="border-t border-border/60 bg-muted/50 py-10">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="text-center md:text-left">
            <p className="font-semibold text-foreground">{footer.title}</p>
            <p className="text-sm text-muted-foreground">{footer.subtitle}</p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href={whatsappLink(contacts)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground"
              aria-label="WhatsApp"
            >
              <MessageCircle className="h-5 w-5" />
            </a>
            {contacts.showTelegram && contacts.telegram ? (
              <a
                href={contacts.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground"
                aria-label="Telegram"
              >
                <Send className="h-5 w-5" />
              </a>
            ) : null}
            {contacts.showVk && contacts.vkGroup ? (
              <a
                href={contacts.vkGroup}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground"
                aria-label="VK"
              >
                VK
              </a>
            ) : null}
            {contacts.showAvito && contacts.avito ? (
              <a
                href={contacts.avito}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Авито
              </a>
            ) : null}
          </div>
        </div>

        <p className="mt-8 text-center text-xs text-muted-foreground">{footer.disclaimer}</p>
      </div>
    </footer>
  );
}

function Index() {
  const data = Route.useLoaderData();

  return (
    <div className="flex min-h-screen flex-col">
      <Header data={data} />
      <main className="flex-1">
        <Hero data={data} />
        <Services data={data} />
        <Complexes data={data} />
        <Promo data={data} />
        <About data={data} />
        <Gallery data={data} />
        <Process data={data} />
        <FAQ data={data} />
        <Contacts data={data} />
      </main>
      <Footer data={data} />
    </div>
  );
}
