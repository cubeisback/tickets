import { PageHeading } from "@/components/cabinet/page-heading";
import { MyEvents } from "@/components/cabinet/my-events";
export const metadata = {
  title: "Мои события",
  description: "Ваши мероприятия, участники и билеты ADPASS.EVENT.",
};
export default function Page() {
  return (
    <div className="cabinet-section">
      <PageHeading
        title="Мои события"
        description="Список конференций и событий, на которые вы зарегистрированы"
      />
      <MyEvents />
    </div>
  );
}
