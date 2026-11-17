import { Suspense } from "react";
import { QueryOrder } from "@/components/cabinet/query-order";

export const metadata = { title: "Заказ" };

export default function OrderPage() {
  return (
    <Suspense fallback={<p>Открываем заказ…</p>}>
      <QueryOrder />
    </Suspense>
  );
}
