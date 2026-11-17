export const tariffs = {
  "nrf-2026": [
    {
      id: "business",
      name: "Бизнес",
      tag: "Выгодно сейчас",
      description:
        "Оптимальный билет для участия в деловой программе Национального Рекламного Форума.",
      points: [
        "Деловая программа четырёх дней",
        "Культурная программа форума",
        "Доступ к Экспертному клубу НРФ",
        "Презентации спикеров по итогам мероприятия",
      ],
      price: 65000,
      available: 54,
      nextPrice: "Действует до 1 сентября, дальше 72 000 ₽",
      short: "Стандартная категория",
    },
    {
      id: "premium",
      name: "Премиум",
      tag: "Популярный выбор",
      description: "Для тех, кто ценит комфорт и больше возможностей для нетворкинга на форуме.",
      points: [
        "Всё, что входит в тариф «Бизнес»",
        "Отдельный вход и выделенная стойка регистрации",
        "Доступ к лаунж-зоне для встреч и кофе-брейков",
        "Вечеринка и церемония награждения",
      ],
      price: 82500,
      available: 26,
      short: "Приоритетный доступ",
    },
    {
      id: "vip",
      name: "VIP",
      tag: "Закрытый формат",
      description: "Максимальный уровень участия для первых лиц компаний и ключевых игроков рынка.",
      points: [
        "Всё, что входит в тариф «Премиум»",
        "Доступ в специальную VIP-зону форума",
        "Участие только для первых лиц компаний: вход по подтверждению личности",
      ],
      price: 120000,
      available: 10,
      short: "Все привилегии",
    },
  ],
  "regions-2026": [
    {
      id: "standard",
      name: "Стандарт",
      tag: "Базовый",
      description: "Участие в деловой программе двух дней",
      points: [
        "Деловая программа двух дней",
        "Доступ к записям выступлений",
        "Сертификат участника",
      ],
      price: 18000,
      available: 120,
      short: "Деловая программа",
    },
    {
      id: "expert",
      name: "Эксперт",
      tag: "Расширенный",
      description: "Расширенный доступ и нетворкинг с экспертами",
      points: [
        "Всё, что входит в тариф «Стандарт»",
        "Закрытые сессии с экспертами",
        "Нетворкинг-сессия для участников",
      ],
      price: 29000,
      available: 40,
      short: "Расширенный доступ",
    },
  ],
};

export const initialProfile = {
  name: "Александр",
  surname: "Романов",
  email: "romanovalex52@gmail.com",
  phone: "+7 967 297-75-73",
  company: "FUSE MDG",
  requisites: { legalName: "", legalAddress: "", account: "", inn: "", kpp: "", ogrn: "" },
};
export const requisiteFields = [
  ["legalName", "Юридическое наименование"],
  ["legalAddress", "Юридический адрес"],
  ["account", "Расчётный счёт"],
  ["inn", "ИНН"],
  ["kpp", "КПП"],
  ["ogrn", "ОГРН"],
];
export const initialOrders = [
  {
    id: "1001",
    eventId: "nrf-2026",
    date: "15 августа 2026, 14:32",
    shortDate: "15.08.2026",
    status: "paid",
    paymentMethod: "online",
    sum: 130000,
    buyerEmail: "romanovalex52@gmail.com",
    buyerName: "Романов Александр Сергеевич",
    buyerCompany: "ООО «Рекламные технологии»",
    buyerPhone: "+7 (999) 123-45-67",
    participants: [
      {
        id: "1001-01",
        name: "Александр",
        surname: "Романов",
        fullName: "Романов Александр Сергеевич",
        email: "romanovalex52@gmail.com",
        phone: "+7 (999) 123-45-67",
        tariffId: "business",
        tariff: "Бизнес",
        price: 65000,
      },
      {
        id: "1001-02",
        name: "Елена",
        surname: "Смирнова",
        fullName: "Смирнова Елена Викторовна",
        email: "e.smirnova@adtechno.ru",
        phone: "+7 (999) 765-43-21",
        tariffId: "business",
        tariff: "Бизнес",
        price: 65000,
      },
    ],
  },
  {
    id: "1002",
    eventId: "regions-2026",
    date: "11 июня 2026, 10:00",
    shortDate: "11.06.2026",
    status: "pending",
    paymentMethod: "offline",
    sum: 18000,
    buyerEmail: "romanovalex52@gmail.com",
    buyerName: "Романов Александр Сергеевич",
    buyerCompany: "FUSE MDG",
    buyerPhone: "+7 967 297-75-73",
    participants: [
      {
        id: "1002-01",
        name: "Александр",
        surname: "Романов",
        email: "romanovalex52@gmail.com",
        phone: "+7 967 297-75-73",
        tariffId: "standard",
        tariff: "Стандарт",
        price: 18000,
      },
    ],
  },
  {
    id: "1003",
    eventId: "nrf-2026",
    date: "11 июня 2026, 11:00",
    shortDate: "11.06.2026",
    status: "refunded",
    paymentMethod: "online",
    sum: 82500,
    buyerEmail: "romanovalex52@gmail.com",
    buyerName: "Мария Иванова",
    buyerCompany: "FUSE MDG",
    buyerPhone: "+7 916 111-22-33",
    participants: [
      {
        id: "1003-01",
        name: "Мария",
        surname: "Иванова",
        email: "ivanova@company.ru",
        phone: "+7 916 111-22-33",
        tariffId: "premium",
        tariff: "Премиум",
        price: 82500,
      },
    ],
  },
];
export const statuses = { paid: "Оплачен", pending: "Ожидает оплаты", refunded: "Возврат" };
export const paymentLabels = { online: "Онлайн", offline: "По счёту" };
export const formatPrice = (value) => new Intl.NumberFormat("ru-RU").format(value) + " ₽";
export const faqItems = [
  {
    question: "Как оплатить билет?",
    answer:
      "Онлайн — картой или через Yandex Split сразу при оформлении заказа. Юридическим лицам доступна оплата по счету: счёт формируется автоматически на указанные реквизиты и приходит на e-mail заказчика.",
  },
  {
    question: "Можно ли передать билет другому человеку?",
    answer:
      "Билет именной. Если участник меняется, напишите менеджеру мероприятия — данные можно скорректировать до начала форума.",
  },
  {
    question: "Как оформить возврат?",
    answer:
      "В разделе «Мои заказы» откройте нужный заказ и нажмите «Оформить возврат». Возврат оформляется на весь заказ целиком: вернётся оплаченная сумма, все билеты заказа будут аннулированы. Заявку рассматривает организатор в течение трёх рабочих дней, деньги возвращаются тем же способом, которым была произведена оплата.",
  },
  {
    question: "Куда приходят билеты?",
    answer:
      "После оплаты билет на каждого участника отправляется на указанный при регистрации e-mail, а также доступен для скачивания в личном кабинете отдельно по каждому участнику.",
  },
];
