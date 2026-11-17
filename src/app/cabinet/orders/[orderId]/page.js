import { initialOrders } from "@/data/cabinet";
import { OrderDetail } from "@/components/cabinet/order-detail";
export function generateStaticParams() {
  return initialOrders.map((order) => ({ orderId: order.id }));
}
export async function generateMetadata({ params }) {
  const { orderId } = await params;
  return { title: `Заказ #${orderId}` };
}
export default async function Page({ params }) {
  const { orderId } = await params;
  return <OrderDetail orderId={orderId} />;
}
