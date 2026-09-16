export type Service = {
  id: string;
  kind: "zone" | "complex";
  title: string;
  description: string | null;
  price: string;
  badge: string | null;
  sort_order: number;
  is_visible: boolean;
};

export type SiteImage = {
  id: string;
  slot: "hero" | "about" | "gallery";
  url: string;
  storage_path: string | null;
  alt: string;
  sort_order: number;
};

export type Brand = {
  first: string;
  second: string;
  tagline: string;
  navCta: string;
};

export type Hero = {
  eyebrow: string;
  title: string;
  titleAccent: string;
  subtitle: string;
  offerLabel: string;
  offerText: string;
  offerPrice: string;
  offerOldPrice: string;
  offerButton: string;
  messengersNote: string;
  replyNote: string;
};

export type Promo = {
  enabled: boolean;
  showInHero: boolean;
  title: string;
  text: string;
  note: string;
  button: string;
};

export type Sections = {
  servicesTitle: string;
  servicesSubtitle: string;
  complexesTitle: string;
  complexesSubtitle: string;
  galleryTitle: string;
  gallerySubtitle: string;
  processTitle: string;
  faqTitle: string;
  contactsTitle: string;
  aboutTitle: string;
};

export type About = { paragraphs: string[] };
export type TitleText = { title: string; text: string };
export type QuestionAnswer = { question: string; answer: string };

export type Contacts = {
  phone: string;
  phoneRaw: string;
  whatsappText: string;
  phoneNote: string;
  address: string;
  addressNote: string;
  hours: string;
  hoursNote: string;
  bookingTitle: string;
  telegram: string;
  telegramChannel: string;
  vkGroup: string;
  vkPersonal: string;
  avito: string;
  showTelegram: boolean;
  showVk: boolean;
  showAvito: boolean;
};

export type Footer = { title: string; subtitle: string; disclaimer: string };
export type Seo = {
  title: string;
  description: string;
  ogTitle: string;
  ogDescription: string;
};

export type SiteContent = {
  brand: Brand;
  hero: Hero;
  promo: Promo;
  sections: Sections;
  about: About;
  why_us: { items: TitleText[] };
  steps: { items: TitleText[] };
  faq: { items: QuestionAnswer[] };
  contacts: Contacts;
  footer: Footer;
  seo: Seo;
};

export type SiteData = {
  content: SiteContent;
  services: Service[];
  images: SiteImage[];
};

export const defaultContent: SiteContent = {
  brand: {
    first: "Ирке",
    second: "LaserRoom",
    tagline: "Лазерная эпиляция для женщин в Саратове",
    navCta: "Записаться",
  },
  hero: {
    eyebrow: "Лазерная эпиляция для женщин",
    title: "Ирке",
    titleAccent: "LaserRoom",
    subtitle:
      "Тщательная, безопасная и комфортная процедура в центре Саратова. Без пафоса и обещаний чуда — только честный разговор о вашем результате.",
    offerLabel: "При первом посещении",
    offerText: "Подмышки за",
    offerPrice: "500 ₽",
    offerOldPrice: "вместо 900 ₽",
    offerButton: "Записаться по акции",
    messengersNote: "Или напишите удобным способом",
    replyNote: "Отвечу за 5–10 минут, если не в процедуре",
  },
  promo: {
    enabled: true,
    showInHero: true,
    title: "Гладкие подмышки",
    text: "При первом посещении — подмышки за 500 ₽ вместо 900 ₽. Акция действует один месяц с даты запуска.",
    note: "Напишите «Хочу на подмышки по акции».",
    button: "Хочу на подмышки по акции",
  },
  sections: {
    servicesTitle: "Услуги и цены",
    servicesSubtitle: "Отдельные зоны — выбирайте только то, что нужно",
    complexesTitle: "Комплексы",
    complexesSubtitle: "Выгоднее, чем покупать зоны по отдельности",
    galleryTitle: "Кабинет",
    gallerySubtitle: "Уютное пространство для комфортной процедуры",
    processTitle: "Как проходит визит",
    faqTitle: "Частые вопросы",
    contactsTitle: "Контакты",
    aboutTitle: "О мастере",
  },
  about: {
    paragraphs: [
      "Меня зовут Ирке Маслова. Я работаю с лазерной эпиляцией с июня 2023 года, прошла профильное обучение и подобрала аппарат, которому доверяю.",
      "В кабинете важно не только качество процедуры, но и атмосфера. Сюда можно прийти со своими вопросами и неловкими сомнениями — я отвечу честно и спокойно, без давления и «волшебных обещаний».",
      "Моя задача — сделать так, чтобы вы чувствовали себя комфортно, знали, чего ждать, и остались довольны результатом.",
    ],
  },
  why_us: {
    items: [
      {
        title: "Тщательность",
        text: "Прорабатываю каждую зону внимательно и смотрю на реакцию кожи в процессе.",
      },
      {
        title: "Индивидуальный подход",
        text: "Подбираю параметры под тип кожи, волос и ваш предыдущий опыт эпиляции.",
      },
      {
        title: "Комфорт и безопасность",
        text: "Охлаждение кожи, паузы по запросу, одноразовые расходники и приватный кабинет.",
      },
      {
        title: "Удобное расположение и время",
        text: "Центр Саратова, приём с 09:00 до 21:00, в том числе вечером и выходные.",
      },
    ],
  },
  steps: {
    items: [
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
    ],
  },
  faq: {
    items: [
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
    ],
  },
  contacts: {
    phone: "8 909 332 90 29",
    phoneRaw: "79093329029",
    whatsappText: "Здравствуйте, хочу записаться на лазерную эпиляцию",
    phoneNote: "Предпочитаю WhatsApp",
    address: "Саратов, ул. Чапаева, 38/40",
    addressNote: "Кабинет 2.9, вход через «Мегаспорт»",
    hours: "С 09:00 до 21:00",
    hoursNote: "В том числе вечером и выходные",
    bookingTitle: "Запись удобным способом",
    telegram: "https://t.me/irke_room",
    telegramChannel: "https://t.me/irke_room",
    vkGroup: "https://vk.ru/club225366707",
    vkPersonal: "https://vk.ru/id460648732",
    avito:
      "https://www.avito.ru/saratov/predlozheniya_uslug/lazernaya_epilyatsiya_3241838508",
    showTelegram: true,
    showVk: true,
    showAvito: true,
  },
  footer: {
    title: "Ирке LaserRoom",
    subtitle: "Лазерная эпиляция для женщин в Саратове",
    disclaimer:
      "Результат индивидуален и зависит от особенностей кожи и волос. Для достижения устойчивого эффекта обычно требуется курс процедур.",
  },
  seo: {
    title: "Ирке LaserRoom — лазерная эпиляция в Саратове",
    description:
      "Лазерная эпиляция для женщин в центре Саратова. Тщательная, безопасная и комфортная процедура. Запись через WhatsApp, Telegram или VK.",
    ogTitle: "Ирке LaserRoom — лазерная эпиляция в Саратове",
    ogDescription:
      "Лазерная эпиляция для женщин в центре Саратова. Запись через WhatsApp, Telegram или VK.",
  },
};

export const defaultSiteData: SiteData = {
  content: defaultContent,
  services: [],
  images: [],
};

export function mergeContent(
  rows: { key: string; value: unknown }[] | null,
): SiteContent {
  const result = structuredClone(defaultContent) as unknown as Record<
    string,
    Record<string, unknown>
  >;
  for (const row of rows ?? []) {
    if (row.key in result && row.value && typeof row.value === "object") {
      result[row.key] = {
        ...result[row.key],
        ...(row.value as Record<string, unknown>),
      };
    }
  }
  return result as unknown as SiteContent;
}
