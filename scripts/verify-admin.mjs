import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const assert = require("node:assert/strict");
const fs = require("fs");
const BASE = process.env.VERIFY_URL || "http://127.0.0.1:3000";
const OUT = ".verification/admin";
fs.mkdirSync(OUT, { recursive: true });
(async () => {
  const browser = await chromium.launch({ channel: "msedge", headless: false });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("console", (m) => {
      if (m.type() === "error") errors.push(m.text());
    });
    const routes = [
      "/admin",
      "/admin/dashboard",
      "/admin/events",
      "/admin/events/new",
      "/admin/events/nrf",
      "/admin/events/nrf/tariffs",
      "/admin/events/nrf/stats",
      "/admin/events/nrf/orders",
      "/admin/events/nrf/participants",
      "/admin/events/nrf/orders/new",
      "/admin/orders/4312",
      "/admin/orders/4301",
      "/admin/refunds",
      "/admin/users",
      "/admin/users/u-1",
      "/admin/settings/entities",
      "/admin/settings/formats",
      "/admin/settings/emails",
    ];
    for (const width of [1920, 1280, 768, 375]) {
      await page.setViewportSize({ width, height: 1000 });
      for (const route of routes) {
        const response = await page.goto(BASE + route);
        assert.equal(response.status(), 200, route);
        await page.evaluate(() => document.fonts.ready);
        assert.equal(
          await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
          true,
          route + " overflow " + width,
        );
        await page.screenshot({
          path: OUT + "/" + route.slice(1).replaceAll("/", "-") + "-" + width + ".png",
          fullPage: true,
        });
      }
      console.log("Routes and responsive:", width, "PASS");
    }
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto(BASE + "/admin");
    await page.getByLabel("Электронная почта", { exact: true }).fill("admin@example.com");
    await page.getByLabel("Пароль", { exact: true }).fill("test");
    await page.getByRole("button", { name: "Войти →" }).click();
    await page.waitForURL("**/admin/dashboard");
    await page.getByRole("link", { name: "Мероприятия", exact: true }).click();
    await page.getByRole("link", { name: "＋ Создать мероприятие" }).click();
    await page.getByLabel("Название мероприятия", { exact: true }).fill("Тестовый форум");
    await page.getByLabel("Дата начала", { exact: true }).fill("2026-11-20");
    await page.getByLabel("Дата окончания", { exact: true }).fill("2026-11-21");
    await page.getByLabel("Краткое описание", { exact: true }).fill("Описание тестового события");
    await page.getByRole("button", { name: "Далее: тарифы и промокоды" }).click();
    await page.getByRole("button", { name: "＋ Добавить тариф" }).filter({ visible: true }).click();
    let dialog = page.getByRole("dialog");
    await dialog.getByLabel("Название", { exact: true }).fill("Тестовый тариф");
    await dialog.getByLabel("Цена, ₽", { exact: true }).fill("1500");
    await dialog.getByLabel("Лимит количества", { exact: true }).fill("100");
    await dialog.getByRole("button", { name: "Сохранить тариф" }).click();
    await page.getByRole("button", { name: "Создать мероприятие", exact: true }).click();
    await page.waitForURL(/\/admin\/events\/event-/);
    assert(await page.getByRole("heading", { name: "Тестовый форум", exact: true }).isVisible());
    const eventUrl = page.url();
    await page.getByRole("link", { name: "Тарифы и промокоды", exact: true }).click();
    await page.getByRole("button", { name: "＋ Новый промокод" }).click();
    dialog = page.getByRole("dialog");
    await dialog.getByLabel("Код", { exact: true }).fill("TEST10");
    await dialog.getByLabel("Значение скидки").fill("10");
    await dialog.getByRole("button", { name: "Сохранить", exact: true }).click();
    assert(await page.getByRole("cell", { name: "TEST10", exact: true }).isVisible());
    await page.getByRole("link", { name: "Заказы", exact: true }).click();
    await page.getByRole("link", { name: "＋ Новый заказ вручную" }).click();
    await page.getByLabel("Email заказчика", { exact: true }).fill("buyer@example.com");
    await page.getByLabel("ФИО заказчика", { exact: true }).fill("Тестовый Заказчик");
    await page
      .getByLabel("Тариф", { exact: true })
      .selectOption({ label: "Тестовый тариф — 1 500 ₽" });
    await page.getByLabel("ФИО участника", { exact: true }).fill("Тестовый Участник");
    await page.getByLabel("Email участника", { exact: true }).fill("participant@example.com");
    await page.getByRole("button", { name: "Создать заказ", exact: true }).click();
    await page.waitForURL(/\/admin\/orders\/\d+/);
    assert(await page.getByRole("heading", { name: /Заказ #/ }).isVisible());
    assert(await page.getByText("Тестовый Участник", { exact: true }).isVisible());
    await page.getByRole("button", { name: "Изменить", exact: true }).click();
    dialog = page.getByRole("dialog");
    await dialog.getByLabel("ФИО", { exact: true }).fill("Участник Изменён");
    await dialog.getByRole("button", { name: "Сохранить участника" }).click();
    assert(await page.getByText("Участник Изменён", { exact: true }).isVisible());
    console.log("Create event, tariff, promo, order and edit participant: PASS");
    await page.goto(BASE + "/admin/orders/4312");
    await page.getByRole("button", { name: "Подтвердить оплату", exact: true }).click();
    await page
      .getByRole("dialog")
      .getByRole("button", { name: "Подтвердить", exact: true })
      .click();
    assert(await page.getByText("Оплачен", { exact: true }).isVisible());
    await page.getByRole("link", { name: "Возвраты", exact: true }).click();
    let refundRow = page
      .getByRole("row")
      .filter({ has: page.getByRole("link", { name: "#4288", exact: true }) });
    await refundRow.getByRole("button", { name: "Одобрить", exact: true }).click();
    await page
      .getByRole("dialog")
      .getByRole("button", { name: "Подтвердить", exact: true })
      .click();
    await page.getByLabel("Статус заявки", { exact: true }).selectOption("approved");
    assert(await page.getByRole("link", { name: "#4288", exact: true }).isVisible());
    await page.getByRole("link", { name: "#4288", exact: true }).click();
    assert(await page.getByText("Возврат", { exact: true }).first().isVisible());
    console.log("Payment and refund consistency: PASS");
    await page.goto(BASE + "/admin/settings/formats");
    await page.getByRole("button", { name: "＋ Добавить формат" }).click();
    dialog = page.getByRole("dialog");
    await dialog.getByLabel("Название", { exact: true }).fill("Вебинар");
    await dialog.getByRole("button", { name: "Сохранить формат" }).click();
    assert(await page.getByText("Вебинар", { exact: true }).isVisible());
    await page.getByRole("link", { name: "Юрлица", exact: true }).click();
    await page.getByLabel("Короткое название", { exact: true }).fill("Тестовое юрлицо");
    await page.getByRole("button", { name: "Сохранить реквизиты" }).click();
    assert(await page.getByRole("button", { name: /Тестовое юрлицо/ }).isVisible());
    await page.getByRole("link", { name: "Шаблоны писем", exact: true }).click();
    await page.getByLabel("Тема письма", { exact: true }).fill("Тестовая тема");
    await page.getByRole("textbox", { name: "Текст письма", exact: true }).fill("Тестовый текст");
    await page.getByRole("button", { name: "{{имя}}", exact: true }).click();
    await page.getByRole("button", { name: "Сохранить шаблон" }).click();
    await page.getByRole("button", { name: /Восстановление пароля/ }).click();
    await page.getByRole("button", { name: /Подтверждение регистрации/ }).click();
    assert.equal(
      await page.getByLabel("Тема письма", { exact: true }).inputValue(),
      "Тестовая тема",
    );
    assert(
      (await page.getByRole("textbox", { name: "Текст письма", exact: true }).innerText()).includes(
        "{{имя}}",
      ),
    );
    console.log("Settings and email editing: PASS");
    for (const route of routes.slice(1)) {
      const response = await page.request.get(BASE + route);
      const html = await response.text();
      assert(html.includes('name="robots" content="noindex, nofollow"'), route + " robots");
      assert(html.includes('rel="stylesheet"'), route + " CSS");
    }
    assert.deepEqual(errors, []);
    console.log("All admin checks: PASS");
  } finally {
    await browser.close();
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
