import { assetPath } from "@/lib/paths";
import "./globals.css";

export const metadata = {
  title: { default: "ADPASS.EVENT — билеты на мероприятия", template: "%s | ADPASS.EVENT" },
  description:
    "Билеты на мероприятия ADPASS. Оформление билетов для себя и коллег, заказы и документы в личном кабинете.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <head>
        <link
          rel="preload"
          href={assetPath("/fonts/montserrat-variable.ttf")}
          as="font"
          type="font/ttf"
          crossOrigin="anonymous"
        />
      </head>
      <body className="site">{children}</body>
    </html>
  );
}
