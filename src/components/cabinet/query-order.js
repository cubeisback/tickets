"use client";

import { useSearchParams } from "next/navigation";
import { OrderDetail } from "./order-detail";

export function QueryOrder() {
  const search = useSearchParams();
  const orderId = search.get("id") || "";
  return <OrderDetail key={orderId} orderId={orderId} />;
}
