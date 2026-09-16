-- roles
create type public.app_role as enum ('admin');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  role public.app_role not null default 'admin',
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role = _role
  )
$$;

create policy "Users can read own roles"
on public.user_roles for select to authenticated
using (auth.uid() = user_id);

-- services
create table public.services (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('zone','complex')),
  title text not null,
  description text,
  price text not null,
  badge text,
  sort_order integer not null default 0,
  is_visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

grant select on public.services to anon;
grant select, insert, update, delete on public.services to authenticated;
grant all on public.services to service_role;
alter table public.services enable row level security;

create policy "Anyone can read services"
on public.services for select to anon, authenticated using (true);

create policy "Admins manage services"
on public.services for all to authenticated
using (public.has_role(auth.uid(), 'admin'))
with check (public.has_role(auth.uid(), 'admin'));

-- site content key/value
create table public.site_content (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

grant select on public.site_content to anon;
grant select, insert, update, delete on public.site_content to authenticated;
grant all on public.site_content to service_role;
alter table public.site_content enable row level security;

create policy "Anyone can read site content"
on public.site_content for select to anon, authenticated using (true);

create policy "Admins manage site content"
on public.site_content for all to authenticated
using (public.has_role(auth.uid(), 'admin'))
with check (public.has_role(auth.uid(), 'admin'));

-- site images
create table public.site_images (
  id uuid primary key default gen_random_uuid(),
  slot text not null check (slot in ('hero','about','gallery')),
  url text not null,
  storage_path text,
  alt text not null default '',
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

grant select on public.site_images to anon;
grant select, insert, update, delete on public.site_images to authenticated;
grant all on public.site_images to service_role;
alter table public.site_images enable row level security;

create policy "Anyone can read site images"
on public.site_images for select to anon, authenticated using (true);

create policy "Admins manage site images"
on public.site_images for all to authenticated
using (public.has_role(auth.uid(), 'admin'))
with check (public.has_role(auth.uid(), 'admin'));

-- updated_at trigger
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger services_touch before update on public.services
for each row execute function public.touch_updated_at();
create trigger site_content_touch before update on public.site_content
for each row execute function public.touch_updated_at();

-- seed services
insert into public.services (kind, title, description, price, badge, sort_order) values
('zone','Подмышечные впадины',null,'900 ₽',null,1),
('zone','Руки до локтя',null,'900 ₽',null,2),
('zone','Руки выше локтя',null,'900 ₽',null,3),
('zone','Руки полностью',null,'1 700 ₽',null,4),
('zone','Классическое бикини',null,'1 000 ₽',null,5),
('zone','Глубокое бикини',null,'1 200 ₽',null,6),
('zone','Тотальное бикини',null,'1 400 ₽',null,7),
('zone','Голени',null,'1 200 ₽',null,8),
('zone','Бёдра',null,'1 200 ₽',null,9),
('zone','Ноги полностью',null,'2 200 ₽',null,10),
('zone','Мини зоны',null,'400 ₽',null,11),
('complex','Мини','Тотальное бикини и подмышки','2 200 ₽','Популярный',1),
('complex','Миди','Голени, тотальное бикини и подмышки','3 200 ₽','Самый популярный',2),
('complex','Классик','Ноги полностью, тотальное бикини и подмышки','4 200 ₽',null,3),
('complex','Макси','Ноги полностью, тотальное бикини, руки полностью и подмышки','4 900 ₽',null,4);

-- seed content
insert into public.site_content (key, value) values
('brand', $j${"first":"Ирке","second":"LaserRoom","tagline":"Лазерная эпиляция для женщин в Саратове","navCta":"Записаться"}$j$),
('hero', $j${"eyebrow":"Лазерная эпиляция для женщин","title":"Ирке","titleAccent":"LaserRoom","subtitle":"Тщательная, безопасная и комфортная процедура в центре Саратова. Без пафоса и обещаний чуда — только честный разговор о вашем результате.","offerLabel":"При первом посещении","offerText":"Подмышки за","offerPrice":"500 ₽","offerOldPrice":"вместо 900 ₽","offerButton":"Записаться по акции","messengersNote":"Или напишите удобным способом","replyNote":"Отвечу за 5–10 минут, если не в процедуре"}$j$),
('promo', $j${"enabled":true,"showInHero":true,"title":"Гладкие подмышки","text":"При первом посещении — подмышки за 500 ₽ вместо 900 ₽. Акция действует один месяц с даты запуска.","note":"Напишите «Хочу на подмышки по акции».","button":"Хочу на подмышки по акции"}$j$),
('sections', $j${"servicesTitle":"Услуги и цены","servicesSubtitle":"Отдельные зоны — выбирайте только то, что нужно","complexesTitle":"Комплексы","complexesSubtitle":"Выгоднее, чем покупать зоны по отдельности","galleryTitle":"Кабинет","gallerySubtitle":"Уютное пространство для комфортной процедуры","processTitle":"Как проходит визит","faqTitle":"Частые вопросы","contactsTitle":"Контакты","aboutTitle":"О мастере"}$j$),
('about', $j${"paragraphs":["Меня зовут Ирке Маслова. Я работаю с лазерной эпиляцией с июня 2023 года, прошла профильное обучение и подобрала аппарат, которому доверяю.","В кабинете важно не только качество процедуры, но и атмосфера. Сюда можно прийти со своими вопросами и неловкими сомнениями — я отвечу честно и спокойно, без давления и «волшебных обещаний».","Моя задача — сделать так, чтобы вы чувствовали себя комфортно, знали, чего ждать, и остались довольны результатом."]}$j$),
('why_us', $j${"items":[{"title":"Тщательность","text":"Прорабатываю каждую зону внимательно и смотрю на реакцию кожи в процессе."},{"title":"Индивидуальный подход","text":"Подбираю параметры под тип кожи, волос и ваш предыдущий опыт эпиляции."},{"title":"Комфорт и безопасность","text":"Охлаждение кожи, паузы по запросу, одноразовые расходники и приватный кабинет."},{"title":"Удобное расположение и время","text":"Центр Саратова, приём с 09:00 до 21:00, в том числе вечером и выходные."}]}$j$),
('steps', $j${"items":[{"title":"Запись в мессенджере","text":"Пишете в удобном мессенджере. Уточняем зоны, прошлый опыт и возможные противопоказания."},{"title":"Консультация в кабинете","text":"Заполняем карточку клиента, обсуждаем задачи и подбираем режим процедуры."},{"title":"Процедура","text":"Щадящая обработка с охлаждением кожи. Всё проходит в спокойной атмосфере."},{"title":"Памятка и план","text":"После визита отправляю рекомендации по уходу и помогаю спланировать следующую запись."}]}$j$),
('faq', $j${"items":[{"question":"Больно ли делать лазерную эпиляцию?","answer":"Ощущения индивидуальные. Большинство клиенток описывают их как лёгкое покалывание или тепло. В работе используется охлаждение кожи, а при необходимости делаю паузы."},{"question":"Сколько процедур нужно для результата?","answer":"Обычно курс состоит из 6–10 процедур с интервалом 4–6 недель. Через 10–14 дней после первого сеанса часть волос выпадает, кожа становится гладче."},{"question":"Подходит ли эпиляция для светлых волос?","answer":"На светлых и тонких волосах результат развивается дольше, параметры подбираются индивидуально. Точнее скажу на консультации после осмотра зоны."},{"question":"Как подготовиться к процедуре?","answer":"За 2–3 дня до визита побрить зону станком, не выщипывать и не использовать эпилятор. Не загорать и не наносить крем на зону в день процедуры."}]}$j$),
('contacts', $j${"phone":"8 909 332 90 29","phoneRaw":"79093329029","whatsappText":"Здравствуйте, хочу записаться на лазерную эпиляцию","phoneNote":"Предпочитаю WhatsApp","address":"Саратов, ул. Чапаева, 38/40","addressNote":"Кабинет 2.9, вход через «Мегаспорт»","hours":"С 09:00 до 21:00","hoursNote":"В том числе вечером и выходные","bookingTitle":"Запись удобным способом","telegram":"https://t.me/irke_room","telegramChannel":"https://t.me/irke_room","vkGroup":"https://vk.ru/club225366707","vkPersonal":"https://vk.ru/id460648732","avito":"https://www.avito.ru/saratov/predlozheniya_uslug/lazernaya_epilyatsiya_3241838508","showTelegram":true,"showVk":true,"showAvito":true}$j$),
('footer', $j${"title":"Ирке LaserRoom","subtitle":"Лазерная эпиляция для женщин в Саратове","disclaimer":"Результат индивидуален и зависит от особенностей кожи и волос. Для достижения устойчивого эффекта обычно требуется курс процедур."}$j$),
('seo', $j${"title":"Ирке LaserRoom — лазерная эпиляция в Саратове","description":"Лазерная эпиляция для женщин в центре Саратова. Тщательная, безопасная и комфортная процедура. Запись через WhatsApp, Telegram или VK. Подмышки за 500 ₽ при первом посещении.","ogTitle":"Ирке LaserRoom — лазерная эпиляция в Саратове","ogDescription":"Лазерная эпиляция для женщин в центре Саратова. Подмышки за 500 ₽ при первом посещении. Запись через WhatsApp, Telegram или VK."}$j$);

-- seed images (existing photos)
insert into public.site_images (slot, url, alt, sort_order) values
('hero','/__l5e/assets-v1/0213a074-1835-4054-8084-a11cbdab621e/cabinet-1.jpg','Кабинет лазерной эпиляции Ирке LaserRoom',1),
('about','/__l5e/assets-v1/a12d67d6-d138-47db-a4b9-3e1dc2b34e5b/irke-aparatus.jpg','Ирке Маслова — мастер лазерной эпиляции',1),
('gallery','/__l5e/assets-v1/84481231-1f30-4c90-9326-f1062db3d025/cabinet-2.jpg','Фото кабинета Ирке LaserRoom 1',1),
('gallery','/__l5e/assets-v1/65e09aee-729d-4cd0-b9ae-0c9b31683b57/cabinet-3.jpg','Фото кабинета Ирке LaserRoom 2',2),
('gallery','/__l5e/assets-v1/4aa45fc5-1d04-4391-aa48-53f89e38fe0e/irke-mirror.jpg','Ирке в кабинете у зеркала',3);