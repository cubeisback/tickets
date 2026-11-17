import { PageHeading } from "@/components/cabinet/page-heading";
import { OrdersList } from "@/components/cabinet/orders-list";
export const metadata = {
  title: "Мои заказы",
  description: "История покупок и текущие счета для ваших билетов.",
};
export default function Page() {
  return (
    <div className="cabinet-section">
      <PageHeading
        title="Мои заказы"
        description="История покупок и текущие счета для ваших билетов"
      />
      <OrdersList />
    </div>
  );
}
