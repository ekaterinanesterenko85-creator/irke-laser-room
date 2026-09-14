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
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  MapPin,
  Clock,
  Phone,
  MessageCircle,
  Send,
  ShieldCheck,
  HeartHandshake,
  Sparkles,
  Menu,
} from "lucide-react";
import cabinet1Asset from "@/assets/cabinet-1.jpg.asset.json";
import cabinet2Asset from "@/assets/cabinet-2.jpg.asset.json";
import cabinet3Asset from "@/assets/cabinet-3.jpg.asset.json";
import irkeAparatusAsset from "@/assets/irke-aparatus.jpg.asset.json";
import irkeMirrorAsset from "@/assets/irke-mirror.jpg.asset.json";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Ирке LaserRoom — лазерная эпиляция в Саратове" },
      {
        name: "description",
        content:
          "Лазерная эпиляция для женщин в центре Саратова. Тщательная, безопасная и комфортная процедура. Запись через WhatsApp, Telegram или VK. Подмышки за 500 ₽ при первом посещении.",
      },
      { property: "og:title", content: "Ирке LaserRoom — лазерная эпиляция в Саратове" },
      {
        property: "og:description",
        content:
          "Лазерная эпиляция для женщин в центре Саратова. Подмышки за 500 ₽ при первом посещении. Запись через WhatsApp, Telegram или VK.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
});

const PHONE = "8 909 332 90 29";
const PHONE_RAW = "79093329029";
const WHATSAPP_LINK = `https://wa.me/${PHONE_RAW}?text=${encodeURIComponent("Здравствуйте, хочу записаться на лазерную эпиляцию")}`;
const TELEGRAM_LINK = "https://t.me/irke_room";
const VK_GROUP_LINK = "https://vk.ru/club225366707";
const VK_PERSONAL_LINK = "https://vk.ru/id460648732";
const AVITO_LINK = "https://www.avito.ru/saratov/predlozheniya_uslug/lazernaya_epilyatsiya_3241838508";

const navItems = [
  { label: "Услуги", href: "#services" },
  { label: "Комплексы", href: "#complexes" },
  { label: "Акция", href: "#promo" },
  { label: "О мастере", href: "#about" },
  { label: "Контакты", href: "#contacts" },
];

const singleZones = [
  { name: "Подмышечные впадины", price: "900 ₽" },
  { name: "Руки до локтя", price: "900 ₽" },
  { name: "Руки выше локтя", price: "900 ₽" },
  { name: "Руки полностью", price: "1 700 ₽" },
  { name: "Классическое бикини", price: "1 000 ₽" },
  { name: "Глубокое бикини", price: "1 200 ₽" },
  { name: "Тотальное бикини", price: "1 400 ₽" },
  { name: "Голени", price: "1 200 ₽" },
  { name: "Бёдра", price: "1 200 ₽" },
  { name: "Ноги полностью", price: "2 200 ₽" },
  { name: "Мини зоны", price: "400 ₽" },
];

const complexes = [
  {
    name: "Мини",
    zones: "Тотальное бикини и подмышки",
    price: "2 200 ₽",
    badge: "Популярный",
  },
  {
    name: "Миди",
    zones: "Голени, тотальное бикини и подмышки",
    price: "3 200 ₽",
    badge: "Самый популярный",
  },
  {
    name: "Классик",
    zones: "Ноги полностью, тотальное бикини и подмышки",
    price: "4 200 ₽",
    badge: null,
  },
  {
    name: "Макси",
    zones: "Ноги полностью, тотальное бикини, руки полностью и подмышки",
    price: "4 900 ₽",
    badge: null,
  },
];

const whyUs = [
  {
    icon: Sparkles,
    title: "Тщательность",
    text: "Прорабатываю каждую зону внимательно и смотрю на реакцию кожи в процессе.",
  },
  {
    icon: HeartHandshake,
    title: "Индивидуальный подход",
    text: "Подбираю параметры под тип кожи, волос и ваш предыдущий опыт эпиляции.",
  },
  {
    icon: ShieldCheck,
    title: "Комфорт и безопасность",
    text: "Охлаждение кожи, паузы по запросу, одноразовые расходники и приватный кабинет.",
  },
  {
    icon: Clock,
    title: "Удобное расположение и время",
    text: "Центр Саратова, приём с 09:00 до 21:00, в том числе вечером и выходные.",
  },
];

const steps = [
  {
    title: "Запись в мессенджере",
    text: "Пишете в удобном мессенджере. Уточняем зоны, прошлый опыт и возможные противопоказания.",
  },
  {
    title: "Консультация в кабинете",
    text: "Заполняем карточку клиента, обсуждаем задачи и подбираем режим процедуры.",
  },
  {
    title: "Процедура",
    text: "Щадящая обработка с охлаждением кожи. Всё проходит в спокойной атмосфере.",
  },
  {
    title: "Памятка и план",
    text: "После визита отправляю рекомендации по уходу и помогаю спланировать следующую запись.",
  },
];

const faq = [
  {
    question: "Больно ли делать лазерную эпиляцию?",
    answer:
      "Ощущения индивидуальные. Большинство клиенток описывают их как лёгкое покалывание или тепло. В работе используется охлаждение кожи, а при необходимости делаю паузы.",
  },
  {
    question: "Сколько процедур нужно для результата?",
    answer:
      "Обычно курс состоит из 6–10 процедур с интервалом 4–6 недель. Через 10–14 дней после первого сеанса часть волос выпадает, кожа становится гладче.",
  },
  {
    question: "Подходит ли эпиляция для светлых волос?",
    answer:
      "На светлых и тонких волосах результат развивается дольше, параметры подбираются индивидуально. Точнее скажу на консультации после осмотра зоны.",
  },
  {
    question: "Как подготовиться к процедуре?",
    answer:
      "За 2–3 дня до визита побрить зону станком, не выщипывать и не использовать эпилятор. Не загорать и не наносить крем на зону в день процедуры.",
  },
];

function MessengerButtons({ fullWidth = false }: { fullWidth?: boolean }) {
  return (
    <div className={`flex flex-wrap gap-3 ${fullWidth ? "w-full" : ""}`}>
      <Button asChild variant="default" className={fullWidth ? "flex-1" : ""}>
        <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer">
          <MessageCircle className="mr-2 h-4 w-4" />
          WhatsApp
        </a>
      </Button>
      <Button asChild variant="secondary" className={fullWidth ? "flex-1" : ""}>
        <a href={TELEGRAM_LINK} target="_blank" rel="noopener noreferrer">
          <Send className="mr-2 h-4 w-4" />
          Telegram
        </a>
      </Button>
      <Button asChild variant="secondary" className={fullWidth ? "flex-1" : ""}>
        <a href={VK_PERSONAL_LINK} target="_blank" rel="noopener noreferrer">
          VK
        </a>
      </Button>
    </div>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 lg:px-8">
        <a href="/" className="text-xl font-semibold tracking-tight text-foreground">
          Ирке <span className="text-primary">LaserRoom</span>
        </a>

        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:block">
          <Button asChild size="sm" className="rounded-full px-6">
            <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer">
              Записаться
            </a>
          </Button>
        </div>

        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" aria-label="Открыть меню">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72">
            <div className="flex flex-col gap-6 pt-8">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="text-lg font-medium text-foreground hover:text-primary"
                >
                  {item.label}
                </a>
              ))}
              <Button asChild className="mt-4 w-full">
                <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer">
                  Записаться
                </a>
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <img
          src={heroImage}
          alt="Уютный кабинет лазерной эпиляции Ирке LaserRoom"
          className="h-full w-full object-cover opacity-30"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
      </div>

      <div className="container mx-auto px-4 py-20 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-4 text-sm font-medium uppercase tracking-wider text-primary">
            Лазерная эпиляция для женщин
          </p>
          <h1 className="text-4xl font-semibold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Ирке <span className="text-primary">LaserRoom</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
            Тщательная, безопасная и комфортная процедура в центре Саратова. Без пафоса и обещаний чуда — только честный разговор о вашем результате.
          </p>

          <div className="mx-auto mt-8 inline-flex flex-col items-center gap-4 rounded-2xl border border-border/60 bg-card/80 p-6 shadow-sm backdrop-blur-sm sm:flex-row">
            <div className="text-center sm:text-left">
              <p className="text-sm text-muted-foreground">При первом посещении</p>
              <p className="text-2xl font-semibold text-foreground">
                Подмышки за <span className="text-primary">500 ₽</span>
              </p>
              <p className="text-sm text-muted-foreground line-through">вместо 900 ₽</p>
            </div>
            <Button asChild size="lg" className="rounded-full px-8 shadow-md">
              <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer">
                Записаться по акции
              </a>
            </Button>
          </div>

          <div className="mt-10 flex flex-col items-center gap-3">
            <p className="text-sm text-muted-foreground">Или напишите удобным способом</p>
            <MessengerButtons />
          </div>

          <p className="mt-6 text-sm text-muted-foreground">
            Отвечу за 5–10 минут, если не в процедуре
          </p>
        </div>
      </div>
    </section>
  );
}

function Services() {
  return (
    <section id="services" className="py-16 lg:py-24">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Услуги и цены
          </h2>
          <p className="mt-4 text-muted-foreground">
            Отдельные зоны — выбирайте только то, что нужно
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {singleZones.map((zone) => (
            <Card
              key={zone.name}
              className="group transition-shadow hover:shadow-md"
            >
              <CardContent className="flex items-center justify-between p-5">
                <span className="font-medium text-foreground">{zone.name}</span>
                <span className="text-lg font-semibold text-primary">{zone.price}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function Complexes() {
  return (
    <section id="complexes" className="bg-muted/50 py-16 lg:py-24">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Комплексы
          </h2>
          <p className="mt-4 text-muted-foreground">
            Выгоднее, чем покупать зоны по отдельности
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {complexes.map((complex) => (
            <Card
              key={complex.name}
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
                <CardTitle className="text-2xl">{complex.name}</CardTitle>
                <CardDescription>{complex.zones}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col justify-end">
                <p className="text-3xl font-semibold text-primary">{complex.price}</p>
                <Button asChild variant="outline" className="mt-4 w-full">
                  <a
                    href={`${WHATSAPP_LINK}%20на%20комплекс%20${encodeURIComponent(complex.name)}`}
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

function Promo() {
  return (
    <section id="promo" className="py-16 lg:py-24">
      <div className="container mx-auto px-4 lg:px-8">
        <Card className="mx-auto max-w-3xl overflow-hidden border-primary/20 bg-gradient-to-br from-primary/10 to-background">
          <CardContent className="flex flex-col items-center gap-6 p-8 text-center md:flex-row md:text-left lg:p-12">
            <div className="flex-1">
              <h2 className="text-3xl font-semibold tracking-tight text-foreground">
                Гладкие подмышки
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                При первом посещении — подмышки за{" "}
                <span className="font-semibold text-primary">500 ₽</span> вместо 900 ₽.
                Акция действует один месяц с даты запуска.
              </p>
              <p className="mt-3 text-sm text-muted-foreground">
                Напишите «Хочу на подмышки по акции».
              </p>
            </div>
            <Button asChild size="lg" className="rounded-full px-8 shadow-md">
              <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer">
                Хочу на подмышки по акции
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="bg-muted/50 py-16 lg:py-24">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="mx-auto grid max-w-5xl items-center gap-12 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              О мастере
            </h2>
            <p className="mt-6 text-lg text-muted-foreground">
              Меня зовут Ирке Маслова. Я работаю с лазерной эпиляцией с июня 2023 года, прошла
              профильное обучение и подобрала аппарат, которому доверяю.
            </p>
            <p className="mt-4 text-muted-foreground">
              В кабинете важно не только качество процедуры, но и атмосфера. Сюда можно прийти
              со своими вопросами и неловкими сомнениями — я отвечу честно и спокойно, без
              давления и «волшебных обещаний».
            </p>
            <p className="mt-4 text-muted-foreground">
              Моя задача — сделать так, чтобы вы чувствовали себя комфортно, знали, чего ждать,
              и остались довольны результатом.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {whyUs.map((item) => (
              <Card key={item.title} className="transition-shadow hover:shadow-md">
                <CardContent className="p-5">
                  <item.icon className="h-8 w-8 text-primary" />
                  <h3 className="mt-4 font-semibold text-foreground">{item.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{item.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Process() {
  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Как проходит визит
          </h2>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
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

function FAQ() {
  return (
    <section className="bg-muted/50 py-16 lg:py-24">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-center text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Частые вопросы
          </h2>
          <Accordion type="single" collapsible className="mt-12">
            {faq.map((item, index) => (
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

function Contacts() {
  return (
    <section id="contacts" className="py-16 lg:py-24">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Контакты
          </h2>

          <Card className="mt-12">
            <CardContent className="grid gap-8 p-8 md:grid-cols-2">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <MapPin className="mt-1 h-5 w-5 shrink-0 text-primary" />
                  <div>
                    <p className="font-medium text-foreground">Саратов, ул. Чапаева, 38/40</p>
                    <p className="text-sm text-muted-foreground">Кабинет 2.9, вход через «Мегаспорт»</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Clock className="mt-1 h-5 w-5 shrink-0 text-primary" />
                  <div>
                    <p className="font-medium text-foreground">С 09:00 до 21:00</p>
                    <p className="text-sm text-muted-foreground">В том числе вечером и выходные</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Phone className="mt-1 h-5 w-5 shrink-0 text-primary" />
                  <div>
                    <p className="font-medium text-foreground">{PHONE}</p>
                    <p className="text-sm text-muted-foreground">Предпочитаю WhatsApp</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <p className="font-medium text-foreground">Запись удобным способом</p>
                <MessengerButtons fullWidth />

                <div className="mt-6 flex flex-wrap gap-3">
                  <Button asChild variant="ghost" size="sm">
                    <a href={TELEGRAM_LINK} target="_blank" rel="noopener noreferrer">
                      <Send className="mr-2 h-4 w-4" />
                      Telegram-канал
                    </a>
                  </Button>
                  <Button asChild variant="ghost" size="sm">
                    <a href={VK_GROUP_LINK} target="_blank" rel="noopener noreferrer">
                      VK-сообщество
                    </a>
                  </Button>
                  <Button asChild variant="ghost" size="sm">
                    <a href={AVITO_LINK} target="_blank" rel="noopener noreferrer">
                      Авито
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border/60 bg-muted/50 py-10">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="text-center md:text-left">
            <p className="font-semibold text-foreground">Ирке LaserRoom</p>
            <p className="text-sm text-muted-foreground">
              Лазерная эпиляция для женщин в Саратове
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground"
              aria-label="WhatsApp"
            >
              <MessageCircle className="h-5 w-5" />
            </a>
            <a
              href={TELEGRAM_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground"
              aria-label="Telegram"
            >
              <Send className="h-5 w-5" />
            </a>
            <a
              href={VK_GROUP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground"
              aria-label="VK"
            >
              VK
            </a>
            <a
              href={AVITO_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Авито
            </a>
          </div>
        </div>

        <p className="mt-8 text-center text-xs text-muted-foreground">
          Результат индивидуален и зависит от особенностей кожи и волос. Для достижения устойчивого
          эффекта обычно требуется курс процедур.
        </p>
      </div>
    </footer>
  );
}

function Index() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <Services />
        <Complexes />
        <Promo />
        <About />
        <Process />
        <FAQ />
        <Contacts />
      </main>
      <Footer />
    </div>
  );
}
