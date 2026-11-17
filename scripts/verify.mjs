import { createRequire } from "node:module";
import assert from "node:assert/strict";
import fs from "node:fs";

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const baseURL = process.env.VERIFY_URL || "http://127.0.0.1:3000";
fs.mkdirSync(".verification", { recursive: true });
const browser = await chromium.launch({ channel: "msedge", headless: false });
try {
  const page = await browser.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  for (const [width, height] of [
    [1920, 920],
    [1440, 863],
    [768, 1024],
    [375, 812],
  ]) {
    await page.setViewportSize({ width, height });
    for (const route of ["/", "/register", "/forgot-password", "/forgot-password/sent"]) {
      const response = await page.goto(`${baseURL}${route}`);
      assert.equal(response.status(), 200, route);
      await page.evaluate(() => document.fonts.ready);
      assert.equal(
        await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
        true,
        `Overflow at ${width} ${route}`,
      );
      assert.equal(
        await page
          .locator("img")
          .evaluateAll((images) => images.every((i) => i.complete && i.naturalWidth > 0)),
        true,
      );
      assert.equal(await page.getByRole("status").count(), 0);
      assert.equal(
        await page
          .locator("[class]")
          .evaluateAll((elements) =>
            elements.every((element) =>
              element.className
                .split(/\s+/)
                .every((c) => /^[a-z][a-z0-9-]*(?:__[a-z0-9-]+)?(?:--[a-z0-9-]+)?$/.test(c)),
            ),
          ),
        true,
        "BEM classes",
      );
      await page.screenshot({
        path: `.verification/${route.replaceAll("/", "-") || "login"}-${width}.png`,
        fullPage: true,
      });
    }
  }
  await page.goto(baseURL);
  await page.getByLabel("Электронная почта").fill("test@example.com");
  await page.locator("#password").fill("demo-password");
  await page.getByRole("button", { name: "Показать пароль" }).click();
  assert.equal(await page.locator("#password").getAttribute("type"), "text");
  await page.getByRole("button", { name: "Скрыть пароль" }).click();
  assert.equal(await page.locator("#password").getAttribute("type"), "password");
  await page.getByRole("button", { name: "Войти →", exact: true }).click();
  await page.waitForURL("**/cabinet");
  await page.getByRole("link", { name: "Выйти", exact: true }).click();
  await page.waitForURL(baseURL + "/");
  assert.equal(await page.getByRole("status").count(), 0);
  await page.getByRole("link", { name: "Зарегистрироваться" }).click();
  await page.waitForURL("**/register");
  await page.getByLabel("Имя", { exact: true }).fill("Иван");
  await page.getByLabel("Фамилия").fill("Иванов");
  await page.getByLabel("Электронная почта").fill("test@example.com");
  await page.locator("#password").fill("example-password");
  await page.locator("#passwordConfirm").fill("different-password");
  await page.locator("#agree").check();
  assert.equal(
    await page.locator("#passwordConfirm").evaluate((e) => e.validationMessage),
    "Пароли не совпадают",
  );
  await page.locator("#passwordConfirm").fill("example-password");
  assert.equal(await page.locator("form").evaluate((e) => e.checkValidity()), true);
  await page.locator("#password").fill("changed-password");
  assert.equal(
    await page.locator("#passwordConfirm").evaluate((e) => e.validity.customError),
    true,
  );
  await page.getByRole("link", { name: "Войти", exact: true }).click();
  await page.getByRole("link", { name: "Восстановить", exact: true }).click();
  await page.waitForURL("**/forgot-password");
  await page.getByLabel("Электронная почта").fill("test@example.com");
  await page.getByRole("button", { name: "Отправить ссылку →" }).click();
  await page.waitForURL("**/forgot-password/sent");
  assert.equal(await page.getByRole("heading", { name: "Письмо отправлено" }).count(), 1);
  const noJS = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 1920, height: 920 },
  });
  const staticPage = await noJS.newPage();
  for (const [route, title] of [
    ["/", "Вход в аккаунт"],
    ["/register", "Регистрация"],
    ["/forgot-password", "Восстановление пароля"],
    ["/forgot-password/sent", "Письмо отправлено"],
  ]) {
    const response = await staticPage.goto(`${baseURL}${route}`);
    const html = await response.text();
    for (const text of [
      title,
      "ПЛАТФОРМА ДЛЯ УЧАСТНИКОВ",
      "stylesheet",
      "/fonts/montserrat-cyrillic.woff2",
    ])
      assert.ok(html.includes(text));
    assert.equal(
      await staticPage.locator("h1").evaluate((e) => getComputedStyle(e).fontSize),
      "48px",
    );
    assert.equal(await staticPage.locator(".auth-card").isVisible(), true);
  }
  await staticPage.screenshot({ path: ".verification/login-no-js.png", fullPage: true });
  await noJS.close();

  const cold = await browser.newContext({ viewport: { width: 1920, height: 920 } });
  const coldPage = await cold.newPage();
  await coldPage.addInitScript(() => {
    window.__shifts = [];
    new PerformanceObserver((list) =>
      list.getEntries().forEach((e) => {
        if (!e.hadRecentInput) window.__shifts.push(e.value);
      }),
    ).observe({ type: "layout-shift", buffered: true });
  });
  await coldPage.route("**/_next/**/*.js", async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    await route.continue();
  });
  await coldPage.goto(baseURL, { waitUntil: "domcontentloaded" });
  await coldPage.evaluate(() => document.fonts.ready);
  const before = await coldPage.locator(".auth-card").boundingBox();
  await coldPage.waitForLoadState("networkidle");
  const after = await coldPage.locator(".auth-card").boundingBox();
  assert.deepEqual(before, after, "Hydration must not change card geometry");
  assert.equal(
    await coldPage.evaluate(() => window.__shifts.reduce((sum, value) => sum + value, 0)),
    0,
    "No layout shifts on cold load",
  );
  await coldPage.emulateMedia({ reducedMotion: "reduce" });
  assert.equal(
    await coldPage
      .locator(".button")
      .first()
      .evaluate((e) => getComputedStyle(e).transitionDuration),
    "0s",
  );
  await cold.close();
  assert.deepEqual(errors, []);
  console.log(
    "PASS: four routes × four widths, BEM, registration validation, recovery flow, local assets, no-JS HTML/CSS, cold-load layout, reduced motion",
  );
} finally {
  await browser.close();
}
