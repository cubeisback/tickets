const TODAY = "17.08.2026";

function coverPlaceholder(from, to, label) {
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="600">` +
    `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">` +
    `<stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/>` +
    `</linearGradient></defs><rect width="1200" height="600" fill="url(#g)"/>` +
    `<text x="64" y="330" font-family="Arial, sans-serif" font-size="72" font-weight="bold" fill="#fff">${label}</text>` +
    `</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function makeCodes(prefix, count, usedCount) {
  return Array.from({ length: count }, (_, i) => ({
    code: `${prefix}${100000 + i * 7}`,
    usedAt: i < usedCount ? "1" + ((i % 7) + 1) + ".08.2026" : null,
    orderId: i < usedCount ? 4000 + i : null,
  }));
}

const EVENT_FORMATS = [
  { id: "forum", name: "Форум", desc: "Многодневные отраслевые форумы", active: true },
  {
    id: "regions",
    name: "Регионы",
    desc: "Региональные программы и локальные площадки",
    active: true,
  },
  {
    id: "conference",
    name: "Конференции",
    desc: "Однодневные тематические конференции",
    active: true,
  },
  { id: "award", name: "Премии", desc: "Церемонии награждения", active: false },
];

const formatById = (id) => EVENT_FORMATS.find((f) => f.id === id) || {};

const EVENTS = [
  {
    id: "nrf",
    formatId: "forum",
    legalEntityId: "le-1",
    name: "Национальный рекламный форум 2026",
    dates: "24–27 сентября 2026",
    dateStart: "2026-09-24",
    dateEnd: "2026-09-27",
    status: "active",
    shortDesc: "Главное отраслевое событие рекламного рынка",
    cover: coverPlaceholder("#1677ff", "#0b3f9e", "НРФ 2026"),
    fullDesc:
      "Четыре дня деловой программы, культурная программа и Экспертный клуб НРФ. " +
      "Более 300 спикеров, 12 тематических треков и площадка для нетворкинга рекламного рынка.",
    tariffs: [
      {
        id: "business",
        name: "Бизнес",
        tag: "Выгодно сейчас",
        limit: 400,
        sold: 346,
        reserved: 22,
        salesEnd: "20.09.2026",
        desc: "Оптимальный билет для участия в деловой программе",
        points: [
          "Деловая программа четырёх дней",
          "Культурная программа форума",
          "Доступ к Экспертному клубу НРФ",
          "Презентации спикеров по итогам мероприятия",
        ],
        prices: [
          { validFrom: "", price: 58000 },
          { validFrom: "01.06.2026", price: 65000 },
          { validFrom: "01.09.2026", price: 72000 },
        ],
      },
      {
        id: "premium",
        name: "Премиум",
        tag: "Популярный выбор",
        limit: 200,
        sold: 174,
        reserved: 9,
        salesEnd: "20.09.2026",
        desc: "Для тех, кто ценит комфорт и больше возможностей для нетворкинга",
        points: [
          "Всё, что входит в тариф «Бизнес»",
          "Отдельный вход и выделенная стойка регистрации",
          "Доступ к лаунж-зоне для встреч и кофе-брейков",
          "Вечеринка и церемония награждения",
        ],
        prices: [
          { validFrom: "", price: 75000 },
          { validFrom: "01.06.2026", price: 82500 },
        ],
      },
      {
        id: "vip",
        name: "VIP",
        tag: "Закрытый формат",
        limit: 60,
        sold: 50,
        reserved: 3,
        salesEnd: "15.09.2026",
        desc: "Максимальный уровень участия для первых лиц компаний",
        points: [
          "Всё, что входит в тариф «Премиум»",
          "Доступ в специальную VIP-зону форума",
          "Участие только для первых лиц компаний",
        ],
        prices: [{ validFrom: "", price: 120000 }],
      },
    ],
    promocodes: [
      {
        id: "p1",
        code: "PARTNER15",
        discountType: "percent",
        value: 15,
        ticketTypeIds: [],
        usageLimit: 50,
        used: 31,
        validUntil: "01.09.2026",
        active: true,
      },
      {
        id: "p2",
        code: "VIPGUEST",
        discountType: "fixed",
        value: 20000,
        ticketTypeIds: ["vip"],
        usageLimit: 10,
        used: 4,
        validUntil: "10.09.2026",
        active: true,
      },
      {
        id: "p3",
        code: "PREMIUM5",
        discountType: "percent",
        value: 5,
        ticketTypeIds: ["premium", "vip"],
        usageLimit: 40,
        used: 12,
        validUntil: "01.09.2026",
        active: true,
      },
      {
        id: "p4",
        code: "SPRING10",
        discountType: "percent",
        value: 10,
        ticketTypeIds: [],
        usageLimit: 100,
        used: 100,
        validUntil: "01.06.2026",
        active: false,
      },
    ],
    promoBatches: [
      {
        id: "b1",
        name: "Партнёрская рассылка 2026",
        discountType: "percent",
        value: 10,
        ticketTypeIds: [],
        validUntil: "01.09.2026",
        active: true,
        codes: makeCodes("NRF26-", 1000, 137),
      },
      {
        id: "b2",
        name: "Гости стенда на выставке",
        discountType: "fixed",
        value: 15000,
        ticketTypeIds: ["business", "premium"],
        validUntil: "15.09.2026",
        active: true,
        codes: makeCodes("EXPO-", 250, 18),
      },
    ],
  },
  {
    id: "nrf-regions",
    formatId: "regions",
    legalEntityId: "le-2",
    name: "НРФ. Регионы 2026",
    dates: "12–13 ноября 2026",
    dateStart: "2026-11-12",
    dateEnd: "2026-11-13",
    status: "active",
    shortDesc: "Региональная программа форума для локальных рынков",
    cover: coverPlaceholder("#13c2c2", "#08616e", "НРФ. Регионы"),
    fullDesc:
      "Двухдневная программа для региональных рекламных рынков: онлайн-трансляция и офлайн-площадки в городах-участниках.",
    tariffs: [
      {
        id: "standard",
        name: "Стандарт",
        tag: "Базовый",
        limit: 500,
        sold: 212,
        reserved: 31,
        salesEnd: "10.11.2026",
        desc: "Участие в деловой программе двух дней",
        points: [
          "Деловая программа двух дней",
          "Доступ к записям выступлений",
          "Сертификат участника",
        ],
        prices: [
          { validFrom: "", price: 18000 },
          { validFrom: "01.10.2026", price: 21000 },
        ],
      },
      {
        id: "expert",
        name: "Эксперт",
        tag: "Расширенный",
        limit: 150,
        sold: 64,
        reserved: 7,
        salesEnd: "10.11.2026",
        desc: "Расширенный доступ и нетворкинг с экспертами",
        points: [
          "Всё, что входит в тариф «Стандарт»",
          "Закрытые сессии с экспертами",
          "Нетворкинг-сессия для участников",
        ],
        prices: [{ validFrom: "", price: 29000 }],
      },
    ],
    promocodes: [
      {
        id: "p6",
        code: "REGIONS20",
        discountType: "percent",
        value: 20,
        ticketTypeIds: [],
        usageLimit: 200,
        used: 47,
        validUntil: "01.11.2026",
        active: true,
      },
    ],
    promoBatches: [],
  },
  {
    id: "nrf-2025",
    formatId: "forum",
    legalEntityId: "le-1",
    name: "Национальный рекламный форум 2025",
    dates: "25–28 сентября 2025",
    dateStart: "2025-09-25",
    dateEnd: "2025-09-28",
    status: "archive",
    shortDesc: "Архив прошлого сезона",
    cover: coverPlaceholder("#8c8c8c", "#434343", "НРФ 2025"),
    fullDesc: "",
    tariffs: [
      {
        id: "business",
        name: "Бизнес",
        tag: "",
        limit: 400,
        sold: 391,
        reserved: 0,
        salesEnd: "20.09.2025",
        desc: "",
        points: [],
        prices: [{ validFrom: "", price: 58000 }],
      },
    ],
    promocodes: [],
    promoBatches: [],
  },
];

const SALES_SERIES = {
  nrf: [
    { label: "01.08", tickets: 12, sum: 810000 },
    { label: "03.08", tickets: 18, sum: 1290000 },
    { label: "05.08", tickets: 9, sum: 640000 },
    { label: "07.08", tickets: 24, sum: 1830000 },
    { label: "09.08", tickets: 31, sum: 2410000 },
    { label: "11.08", tickets: 22, sum: 1620000 },
    { label: "13.08", tickets: 38, sum: 2980000 },
    { label: "15.08", tickets: 44, sum: 3510000 },
    { label: "17.08", tickets: 29, sum: 2140000 },
  ],
  "nrf-regions": [
    { label: "01.08", tickets: 4, sum: 76000 },
    { label: "03.08", tickets: 7, sum: 139000 },
    { label: "05.08", tickets: 11, sum: 219000 },
    { label: "07.08", tickets: 6, sum: 118000 },
    { label: "09.08", tickets: 14, sum: 292000 },
    { label: "11.08", tickets: 9, sum: 183000 },
    { label: "13.08", tickets: 17, sum: 361000 },
    { label: "15.08", tickets: 12, sum: 244000 },
    { label: "17.08", tickets: 8, sum: 158000 },
  ],
  "nrf-2025": [
    { label: "01.09", tickets: 21, sum: 1218000 },
    { label: "08.09", tickets: 44, sum: 2552000 },
    { label: "15.09", tickets: 66, sum: 3828000 },
    { label: "22.09", tickets: 39, sum: 2262000 },
  ],
};

const PEOPLE = [
  ["Александр", "Романов"],
  ["Мария", "Иванова"],
  ["Павел", "Соколов"],
  ["Ольга", "Крылова"],
  ["Игорь", "Лебедев"],
  ["Анна", "Титова"],
  ["Дмитрий", "Гущин"],
  ["Сергей", "Фомин"],
  ["Юлия", "Панова"],
  ["Никита", "Волков"],
  ["Алина", "Миронова"],
  ["Роман", "Ким"],
  ["Елена", "Зайцева"],
  ["Артём", "Белов"],
  ["Ксения", "Орлова"],
  ["Максим", "Дорофеев"],
  ["Ирина", "Савельева"],
  ["Кирилл", "Наумов"],
  ["Полина", "Ершова"],
  ["Виктор", "Астахов"],
];

const COMPANIES = [
  ["ADPASS", "adpass.ru", "Медиа"],
  ["BBDO", "bbdo.ru", "Агентства"],
  ["Сбер", "sber.ru", "Бренды"],
  ["Яндекс Реклама", "yandex-ads.ru", "IT"],
  ["VK", "vk.company", "IT"],
  ["ЕКБ Медиа", "ekb-media.ru", "Медиа"],
  ["СибБренд", "sib-brand.ru", "Бренды"],
  ["МТС", "mts.ru", "Бренды"],
  ["Ozon", "ozon.ru", "IT"],
  ["Восход", "voskhod.agency", "Агентства"],
  ["Лента", "lenta.com", "Бренды"],
  ["Авито", "avito.ru", "IT"],
];

const REQUISITES_SAMPLE = {
  legalName: "ООО «Сбербанк Маркетинг»",
  legalAddress: "117312, Москва, ул. Вавилова, д. 19",
  inn: "7707083893",
  kpp: "773601001",
  ogrn: "1027700132195",
  account: "40702810400000001234",
  bank: "ПАО Сбербанк",
  bik: "044525225",
};

const translit = (s) =>
  s.toLowerCase().replace(
    /[а-яё]/g,
    (c) =>
      ({
        а: "a",
        б: "b",
        в: "v",
        г: "g",
        д: "d",
        е: "e",
        ё: "e",
        ж: "zh",
        з: "z",
        и: "i",
        й: "y",
        к: "k",
        л: "l",
        м: "m",
        н: "n",
        о: "o",
        п: "p",
        р: "r",
        с: "s",
        т: "t",
        у: "u",
        ф: "f",
        х: "h",
        ц: "c",
        ч: "ch",
        ш: "sh",
        щ: "sch",
        ъ: "",
        ы: "y",
        ь: "",
        э: "e",
        ю: "yu",
        я: "ya",
      })[c] || c,
  );

function makeOrders(
  eventId,
  tariffs,
  count,
  startId,
  startDay,
  monthYear = "08.2026",
  checkinDay = "24.09.2026",
) {
  const statuses = [
    "paid",
    "paid",
    "paid",
    "pending",
    "paid",
    "paid",
    "expired",
    "paid",
    "pending",
    "refunded",
  ];
  const orders = [];
  for (let i = 0; i < count; i += 1) {
    const status = statuses[i % statuses.length];
    const payment = i % 3 === 0 ? "invoice" : "online";
    const ticketsCount = (i % 4) + 1;
    const day = Math.max(1, startDay - Math.floor(i / 2));
    const date = `${String(day).padStart(2, "0")}.${monthYear}`;
    const [company, domain, represent] = COMPANIES[(i * 5) % COMPANIES.length];

    const participants = Array.from({ length: ticketsCount }, (_, j) => {
      const [first, last] = PEOPLE[(i * 3 + j) % PEOPLE.length];
      const tariff = tariffs[(i + j) % tariffs.length];
      const ticketStatus =
        status === "refunded"
          ? "refunded"
          : status === "paid"
            ? i % 7 === 0 && j === 0
              ? "used"
              : "valid"
            : "issued";

      return {
        checkedInAt:
          ticketStatus === "used"
            ? `${checkinDay}, ${String(9 + (i % 8)).padStart(2, "0")}:${String((i * 7) % 60).padStart(2, "0")}`
            : null,
        name: `${first} ${last}`,
        email: `${translit(first[0] + last)}@${domain}`,
        phone: `+7 9${String(10 + (i % 80))} ${String(100 + ((i * 7) % 900))}-${String(10 + (i % 90))}-${String(10 + ((j * 13) % 90))}`,
        company,
        represent,
        tariffId: tariff.id,
        tariff: tariff.name,
        price: currentPrice(tariff),
        status: ticketStatus,
      };
    });

    const gross = participants.reduce((acc, x) => acc + x.price, 0);
    const hasPromo = i % 5 === 2;
    const discount = hasPromo ? Math.round(gross * 0.1) : 0;
    const [cFirst, cLast] = PEOPLE[(i * 3) % PEOPLE.length];

    orders.push({
      id: startId + i,
      eventId,
      date,
      customer: `${translit(cFirst[0] + cLast)}@${domain}`,
      customerName: `${cFirst} ${cLast}`,
      company,
      payment,
      status,
      gross,
      discount,
      promoCode: hasPromo ? "PARTNER15" : null,
      sum: gross - discount,

      expiresAt:
        status === "pending" && payment === "online"
          ? `${String(day).padStart(2, "0")}.${monthYear}, ${String(10 + (i % 9)).padStart(2, "0")}:${String(((i * 7) % 45) + 15).padStart(2, "0")}`
          : null,
      requisites:
        payment === "invoice" ? { ...REQUISITES_SAMPLE, legalName: `ООО «${company}»` } : null,
      createdByAdmin: i % 11 === 4 ? "admin@adpass.ru" : null,
      adminComment: i % 11 === 4 ? "Оплата принята на выставке, наличными" : null,
      participants,
    });
  }
  return orders;
}

const NRF = EVENTS[0];
const REGIONS = EVENTS[1];

const ORDERS = [
  {
    id: 4312,
    eventId: "nrf",
    date: "17.08.2026",
    customer: "romanovalex52@gmail.com",
    customerName: "Александр Романов",
    company: "ADPASS",
    payment: "invoice",
    status: "pending",
    gross: 147500,
    discount: 0,
    promoCode: null,
    sum: 147500,
    expiresAt: null,
    requisites: {
      ...REQUISITES_SAMPLE,
      legalName: "ООО «АДПАСС»",
      inn: "7719461178",
      kpp: "771901001",
    },
    createdByAdmin: null,
    adminComment: null,
    participants: [
      {
        name: "Александр Романов",
        email: "romanovalex52@gmail.com",
        phone: "+7 967 297-75-73",
        company: "ADPASS",
        represent: "Медиа",
        tariffId: "business",
        tariff: "Бизнес",
        price: 65000,
        status: "issued",
      },
      {
        name: "Мария Иванова",
        email: "ivanova@adpass.ru",
        phone: "+7 916 111-22-33",
        company: "ADPASS",
        represent: "Медиа",
        tariffId: "premium",
        tariff: "Премиум",
        price: 82500,
        status: "issued",
      },
    ],
  },
  {
    id: 4309,
    eventId: "nrf",
    date: "17.08.2026",
    customer: "p.sokolov@bbdo.ru",
    customerName: "Павел Соколов",
    company: "BBDO",
    payment: "online",
    status: "paid",
    gross: 120000,
    discount: 0,
    promoCode: null,
    sum: 120000,
    expiresAt: null,
    requisites: null,
    createdByAdmin: null,
    adminComment: null,
    participants: [
      {
        name: "Павел Соколов",
        email: "p.sokolov@bbdo.ru",
        phone: "+7 903 445-12-09",
        company: "BBDO",
        represent: "Агентства",
        tariffId: "vip",
        tariff: "VIP",
        price: 120000,
        status: "valid",
      },
    ],
  },
  {
    id: 4301,
    eventId: "nrf",
    date: "16.08.2026",
    customer: "events@sber.ru",
    customerName: "Ольга Крылова",
    company: "Сбер",
    payment: "invoice",
    status: "paid",
    gross: 330000,
    discount: 33000,
    promoCode: "PARTNER15",
    sum: 297000,
    expiresAt: null,
    requisites: { ...REQUISITES_SAMPLE },
    createdByAdmin: null,
    adminComment: null,
    participants: [
      {
        name: "Ольга Крылова",
        email: "krylova@sber.ru",
        phone: "+7 905 220-33-11",
        company: "Сбер",
        represent: "Бренды",
        tariffId: "premium",
        tariff: "Премиум",
        price: 82500,
        status: "valid",
      },
      {
        name: "Игорь Лебедев",
        email: "lebedev@sber.ru",
        phone: "+7 905 220-33-12",
        company: "Сбер",
        represent: "Бренды",
        tariffId: "premium",
        tariff: "Премиум",
        price: 82500,
        status: "valid",
      },
      {
        name: "Анна Титова",
        email: "titova@sber.ru",
        phone: "+7 905 220-33-13",
        company: "Сбер",
        represent: "Бренды",
        tariffId: "premium",
        tariff: "Премиум",
        price: 82500,
        status: "used",
        checkedInAt: "24.09.2026, 10:14",
      },
      {
        name: "Дмитрий Гущин",
        email: "gushin@sber.ru",
        phone: "+7 905 220-33-14",
        company: "Сбер",
        represent: "Бренды",
        tariffId: "premium",
        tariff: "Премиум",
        price: 82500,
        status: "valid",
      },
    ],
  },
  {
    id: 4288,
    eventId: "nrf",
    date: "15.08.2026",
    customer: "volkov@yandex-ads.ru",
    customerName: "Никита Волков",
    company: "Яндекс Реклама",
    payment: "online",
    status: "paid",
    gross: 65000,
    discount: 0,
    promoCode: null,
    sum: 65000,
    expiresAt: null,
    requisites: null,
    createdByAdmin: null,
    adminComment: null,
    participants: [
      {
        name: "Никита Волков",
        email: "volkov@yandex-ads.ru",
        phone: "+7 926 400-19-55",
        company: "Яндекс Реклама",
        represent: "IT",
        tariffId: "business",
        tariff: "Бизнес",
        price: 65000,
        status: "valid",
      },
    ],
  },
  {
    id: 4275,
    eventId: "nrf",
    date: "14.08.2026",
    customer: "a.mironova@vk.company",
    customerName: "Алина Миронова",
    company: "VK",
    payment: "online",
    status: "expired",
    gross: 82500,
    discount: 0,
    promoCode: null,
    sum: 82500,
    expiresAt: "14.08.2026, 16:41",
    requisites: { ...REQUISITES_SAMPLE, legalName: "ООО «ВК»" },
    createdByAdmin: null,
    adminComment: null,
    participants: [
      {
        name: "Алина Миронова",
        email: "a.mironova@vk.company",
        phone: "+7 916 903-55-21",
        company: "VK",
        represent: "IT",
        tariffId: "premium",
        tariff: "Премиум",
        price: 82500,
        status: "void",
      },
    ],
  },
  ...makeOrders("nrf", NRF.tariffs, 18, 4180, 13),
  {
    id: 4296,
    eventId: "nrf-regions",
    date: "16.08.2026",
    customer: "fomin@ekb-media.ru",
    customerName: "Сергей Фомин",
    company: "ЕКБ Медиа",
    payment: "online",
    status: "paid",
    gross: 47000,
    discount: 0,
    promoCode: null,
    sum: 47000,
    expiresAt: null,
    requisites: null,
    createdByAdmin: null,
    adminComment: null,
    participants: [
      {
        name: "Сергей Фомин",
        email: "fomin@ekb-media.ru",
        phone: "+7 922 118-77-40",
        company: "ЕКБ Медиа",
        represent: "Медиа",
        tariffId: "expert",
        tariff: "Эксперт",
        price: 29000,
        status: "valid",
      },
      {
        name: "Юлия Панова",
        email: "panova@ekb-media.ru",
        phone: "+7 922 118-77-41",
        company: "ЕКБ Медиа",
        represent: "Медиа",
        tariffId: "standard",
        tariff: "Стандарт",
        price: 18000,
        status: "valid",
      },
    ],
  },
  {
    id: 4270,
    eventId: "nrf-regions",
    date: "14.08.2026",
    customer: "kim@sib-brand.ru",
    customerName: "Роман Ким",
    company: "СибБренд",
    payment: "invoice",
    status: "paid",
    gross: 36000,
    discount: 0,
    promoCode: null,
    sum: 36000,
    expiresAt: null,
    requisites: { ...REQUISITES_SAMPLE, legalName: "ООО «СибБренд»" },
    createdByAdmin: null,
    adminComment: null,
    participants: [
      {
        name: "Роман Ким",
        email: "kim@sib-brand.ru",
        phone: "+7 913 555-01-02",
        company: "СибБренд",
        represent: "Бренды",
        tariffId: "standard",
        tariff: "Стандарт",
        price: 18000,
        status: "valid",
      },
      {
        name: "Елена Зайцева",
        email: "zaiceva@sib-brand.ru",
        phone: "+7 913 555-01-03",
        company: "СибБренд",
        represent: "Бренды",
        tariffId: "standard",
        tariff: "Стандарт",
        price: 18000,
        status: "valid",
      },
    ],
  },
  ...makeOrders("nrf-regions", REGIONS.tariffs, 9, 4150, 12),

  ...makeOrders("nrf-2025", EVENTS[2].tariffs, 8, 3900, 20, "09.2025", "25.09.2025"),
];

const TICKET_STATUS = {
  issued: { text: "Ожидает оплаты", color: "default" },
  valid: { text: "Действителен", color: "green" },
  used: { text: "Использован", color: "blue" },
  refunded: { text: "Возврат", color: "red" },
  void: { text: "Аннулирован", color: "default" },
};

const ORDER_STATUS = {
  paid: { text: "Оплачен", color: "green" },
  pending: { text: "Ожидает оплаты", color: "gold" },
  expired: { text: "Просрочен", color: "default" },
  refunded: { text: "Возврат", color: "red" },
  cancelled: { text: "Отменён", color: "default" },
};

const PAYMENT_LABEL = { online: "Онлайн", invoice: "По счёту" };

const REFUND_REQUESTS = [
  {
    id: "r-1",
    orderId: 4288,
    eventId: "nrf",
    customer: "volkov@yandex-ads.ru",
    tickets: 1,
    sum: 65000,
    date: "15.08.2026",
    reason: "Изменились планы участника",
    status: "pending",
    comment: null,
  },
  {
    id: "r-2",
    orderId: 4270,
    eventId: "nrf-regions",
    customer: "kim@sib-brand.ru",
    tickets: 2,
    sum: 36000,
    date: "16.08.2026",
    reason: "Отменилась поездка команды",
    status: "pending",
    comment: null,
  },
  {
    id: "r-3",
    orderId: 4301,
    eventId: "nrf",
    customer: "events@sber.ru",
    tickets: 4,
    sum: 297000,
    date: "12.08.2026",
    reason: "Ошибка в количестве билетов, нужен пересчёт",
    status: "rejected",
    comment: "Заказ можно вернуть только целиком. Оформили доплату отдельным заказом.",
  },
  {
    id: "r-4",
    orderId: 4187,
    eventId: "nrf",
    customer: "mivanova@avito.ru",
    tickets: 2,
    sum: 147500,
    date: "10.08.2026",
    reason: "Дубль заказа — оплатили дважды",
    status: "approved",
    comment: "Возврат проведён 11.08.2026",
  },
];

const USERS = (() => {
  const map = new Map();
  ORDERS.forEach((o, i) => {
    if (!map.has(o.customer)) {
      const first = o.participants[0] || {};

      const undetected = i % 7 === 3;
      const site = o.eventId === "nrf-regions" ? "regions.nrf.ru" : "nrf.ru";
      map.set(o.customer, {
        id: `u-${map.size + 1}`,
        email: o.customer,
        name: o.customerName,
        company: o.company,
        phone: first.phone || "",
        registeredAt: `${String(((i * 3) % 28) + 1).padStart(2, "0")}.0${(i % 6) + 1}.2026`,
        requisites: o.requisites || null,
        source: undetected
          ? { site: null, url: "прямой заход", utm: null }
          : {
              site,
              url: `https://${site}/tickets`,
              utm: `utm_source=${site}&utm_medium=site&utm_campaign=tickets`,
            },
      });
    }
  });
  const noPurchase = [
    ["e.gorbunova@mail.ru", "Екатерина Горбунова", "Фриланс", "+7 916 774-01-22", "02.08.2026"],
    ["dmitry@promo-lab.ru", "Дмитрий Соловьёв", "Промо-Лаб", "+7 903 118-45-90", "05.08.2026"],
    ["a.nikitina@retail-x.ru", "Алёна Никитина", "Retail X", "+7 925 330-71-08", "09.08.2026"],
    ["team@digital-way.ru", "Олег Верещагин", "Digital Way", "+7 909 500-12-34", "11.08.2026"],
    ["marina.k@tvhouse.ru", "Марина Кузьмина", "TV House", "+7 915 220-88-17", "14.08.2026"],
    ["it@startup-hub.ru", "Глеб Тарасов", "Startup Hub", "+7 999 001-45-67", "16.08.2026"],
  ].map(([email, name, company, phone, registeredAt], i) => {
    const undetected = i % 3 === 2;
    const site = i % 2 === 0 ? "nrf.ru" : "regions.nrf.ru";
    return {
      id: `u-n${i + 1}`,
      email,
      name,
      company,
      phone,
      registeredAt,
      requisites: null,
      source: undetected
        ? { site: null, url: "ссылка из письма", utm: null }
        : { site, url: `https://${site}/`, utm: `utm_source=${site}&utm_medium=email` },
    };
  });
  return [...map.values(), ...noPurchase];
})();

const LEGAL_ENTITIES = [
  {
    id: "le-1",
    shortName: "АДПАСС ИВЕНТ",
    isDefault: true,
    legalName: "ООО «АДПАСС ИВЕНТ»",
    legalAddress: "123112, Москва, Пресненская наб., д. 12, этаж 45",
    inn: "7719461178",
    kpp: "771901001",
    ogrn: "1197746512345",
    account: "40702810900000012345",
    bank: "АО «Тинькофф Банк»",
    bik: "044525974",
    corrAccount: "30101810145250000974",
    signatoryName: "Романов Александр Сергеевич",
    signatoryPosition: "Генеральный директор",
  },
  {
    id: "le-2",
    shortName: "НРФ РЕГИОНЫ",
    isDefault: false,
    legalName: "ООО «НРФ РЕГИОНЫ»",
    legalAddress: "620014, Екатеринбург, ул. Ленина, д. 25, офис 401",
    inn: "6658123456",
    kpp: "665801001",
    ogrn: "1206600098765",
    account: "40702810600000054321",
    bank: "ПАО Сбербанк",
    bik: "044525225",
    corrAccount: "30101810400000000225",
    signatoryName: "Ковалёва Дарья Игоревна",
    signatoryPosition: "Директор",
  },
];

const legalEntityById = (id) => LEGAL_ENTITIES.find((x) => x.id === id) || {};

const EMAIL_TEMPLATES = [
  {
    id: "t1",
    code: "user_registered",
    name: "Подтверждение регистрации",
    active: true,
    audience: "Заказчику",
    subject: "Добро пожаловать в личный кабинет ADPASS.EVENT",
    body: '<p>Здравствуйте, {{имя}}!</p><p>Вы зарегистрировались в личном кабинете ADPASS.EVENT. Подтвердите email по ссылке: <a href="{{ссылка}}">подтвердить email</a>.</p><p>Если регистрацию начинали не вы — просто проигнорируйте это письмо.</p>',
  },
  {
    id: "t2",
    code: "password_reset",
    name: "Восстановление пароля",
    active: true,
    audience: "Заказчику",
    subject: "Восстановление пароля",
    body: '<p>Здравствуйте, {{имя}}!</p><p>Чтобы задать новый пароль, перейдите по <a href="{{ссылка}}">ссылке</a>. Она действует 24 часа.</p>',
  },
  {
    id: "t3",
    code: "order_created",
    name: "Заказ создан, ожидает оплаты",
    active: true,
    audience: "Заказчику",
    subject: "Заказ № {{номер_заказа}} — счёт на оплату",
    body: "<p>Здравствуйте, {{имя}}!</p><p>Вы оформили заказ № {{номер_заказа}} на мероприятие «{{мероприятие}}».</p><ul><li>Сумма к оплате: {{сумма}}</li><li>Оплатить до: {{срок_оплаты}}</li></ul><p>Счёт во вложении.</p>",
  },
  {
    id: "t4",
    code: "order_paid",
    name: "Оплата получена, билеты",
    active: true,
    audience: "Заказчику",
    subject: "Билеты на «{{мероприятие}}»",
    body: "<h2>Оплата получена</h2><p>Здравствуйте, {{имя}}!</p><p>Оплата по заказу № {{номер_заказа}} получена. Билеты всех участников во вложении — можно переслать их коллегам.</p><p>До встречи на «{{мероприятие}}»!</p>",
  },
  {
    id: "t5",
    code: "ticket_to_participant",
    name: "Именной билет участнику",
    active: true,
    audience: "Участнику",
    subject: "Ваш билет на «{{мероприятие}}»",
    body: "<h2>Ваш билет</h2><p>Здравствуйте, {{имя}}!</p><p>Для вас оформлен именной билет на «{{мероприятие}}», тариф «{{тариф}}».</p><ul><li>Даты: {{дата_начала}}</li><li>Билет во вложении — QR-код нужен на входе</li></ul><p>Билет именной и действует только для вас.</p>",
  },
  {
    id: "t6",
    code: "invoice_reminder",
    name: "Напоминание о неоплаченном счёте",
    active: true,
    audience: "Заказчику",
    subject: "Счёт по заказу № {{номер_заказа}} ещё не оплачен",
    body: "<p>Здравствуйте, {{имя}}!</p><p>Напоминаем, что счёт по заказу № {{номер_заказа}} на сумму {{сумма}} ожидает оплаты до {{срок_оплаты}}.</p><p>После этой даты заказ будет отменён, а билеты вернутся в продажу.</p>",
  },
  {
    id: "t7",
    code: "refund_received",
    name: "Заявка на возврат принята",
    active: true,
    audience: "Заказчику",
    subject: "Заявка на возврат по заказу № {{номер_заказа}}",
    body: "<p>Здравствуйте, {{имя}}!</p><p>Мы получили заявку на возврат по заказу № {{номер_заказа}}. Рассмотрим её в течение трёх рабочих дней и сообщим решение.</p>",
  },
  {
    id: "t8",
    code: "refund_resolved",
    name: "Решение по возврату",
    active: true,
    audience: "Заказчику",
    subject: "Решение по возврату — заказ № {{номер_заказа}}",
    body: "<p>Здравствуйте, {{имя}}!</p><p>По заявке на возврат по заказу № {{номер_заказа}} принято решение: {{решение}}.</p><p>{{комментарий}}</p>",
  },
  {
    id: "t9",
    code: "event_reminder",
    name: "Напоминание о мероприятии",
    active: false,
    audience: "Участнику",
    subject: "Скоро «{{мероприятие}}»",
    body: "<p>Здравствуйте, {{имя}}!</p><p>Напоминаем: «{{мероприятие}}» начинается {{дата_начала}}.</p><p>Билет участника во вложении — не забудьте его на входе.</p>",
  },
];

const EMAIL_VARIABLES = [
  "{{имя}}",
  "{{email}}",
  "{{мероприятие}}",
  "{{номер_заказа}}",
  "{{тариф}}",
  "{{сумма}}",
  "{{срок_оплаты}}",
  "{{дата_начала}}",
  "{{ссылка}}",
  "{{промокод}}",
];

const REGISTERED_USERS = 1284;

function formatPrice(n) {
  return n.toLocaleString("ru-RU") + " ₽";
}

function formatNumber(n) {
  return n.toLocaleString("ru-RU");
}

function plural(n, forms) {
  const a = Math.abs(n) % 100;
  const b = a % 10;
  if (a > 10 && a < 20) return forms[2];
  if (b > 1 && b < 5) return forms[1];
  if (b === 1) return forms[0];
  return forms[2];
}

function dateKey(d) {
  if (!d) return 0;
  const [dd, mm, yyyy] = d.split(".");
  return Number(`${yyyy}${mm}${dd}`);
}

function sortedPrices(t) {
  return [...(t.prices || [])].sort((a, b) => dateKey(a.validFrom) - dateKey(b.validFrom));
}

function currentPrice(t) {
  const list = sortedPrices(t);
  if (!list.length) return 0;
  const today = dateKey(TODAY);
  const active = list.filter((r) => dateKey(r.validFrom) <= today);
  return (active.length ? active[active.length - 1] : list[0]).price;
}

function nextPriceChange(t) {
  const today = dateKey(TODAY);
  return sortedPrices(t).find((r) => dateKey(r.validFrom) > today) || null;
}

function eventStats(ev, allOrders) {
  if (!ev) return { sold: 0, reserved: 0, revenue: 0, pendingCount: 0, pendingSum: 0, orders: [] };
  const orders = (allOrders || ORDERS).filter((o) => o.eventId === ev.id);
  const sold = ev.tariffs.reduce((s, t) => s + t.sold, 0);
  const reserved = ev.tariffs.reduce((s, t) => s + t.reserved, 0);

  const revenue = ev.tariffs.reduce((s, t) => s + t.sold * currentPrice(t), 0);
  const pendingOrders = orders.filter((o) => o.status === "pending");
  const pendingSum = pendingOrders.reduce((s, o) => s + o.sum, 0);
  return { sold, reserved, revenue, pendingCount: pendingOrders.length, pendingSum, orders };
}

export {
  TODAY,
  EVENT_FORMATS,
  EVENTS,
  ORDERS,
  USERS,
  REFUND_REQUESTS,
  LEGAL_ENTITIES,
  EMAIL_TEMPLATES,
  EMAIL_VARIABLES,
  TICKET_STATUS,
  ORDER_STATUS,
  PAYMENT_LABEL,
  SALES_SERIES,
  currentPrice,
  sortedPrices,
  nextPriceChange,
  dateKey,
  formatPrice,
  formatNumber,
  plural,
  makeCodes,
};
