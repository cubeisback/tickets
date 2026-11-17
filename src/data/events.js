import { assetPath } from "@/lib/paths";
export const eventFormats = [
  { id: "all", label: "Все мероприятия" },
  { id: "forum", label: "Форум" },
  { id: "regions", label: "Регионы" },
];

export const events = [
  {
    id: "nrf-2026",
    formatId: "forum",
    title: "Национальный рекламный форум 2026",
    dates: "24-27 сентября 2026",
    description:
      "Главное отраслевое событие российского рекламного рынка. Четыре дня плотного нетворкинга, ключевые индустриальные тренды и встречи со всеми лидерами медиа-индустрии.",
    background: assetPath("/assets/cabinet/forum-background.png"),
    image: assetPath("/assets/cabinet/forum.png"),
    imageWidth: 1920,
    imageHeight: 1080,
  },
  {
    id: "regions-2026",
    formatId: "regions",
    title: "НРФ. Регионы 2026",
    dates: "12-13 ноября 2026",
    description:
      "Региональная программа форума, сфокусированная на развитии локальных рекламных рынков, агентской специфике за пределами столицы и новых инструментах роста.",
    background: assetPath("/assets/cabinet/regions-background.png"),
    image: assetPath("/assets/cabinet/regions.png"),
    imageWidth: 592,
    imageHeight: 444,
  },
];
