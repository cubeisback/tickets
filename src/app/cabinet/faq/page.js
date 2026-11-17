import { PageHeading } from "@/components/cabinet/page-heading";
import { Faq } from "@/components/cabinet/faq";
export const metadata = {
  title: "Часто задаваемые вопросы",
  description: "Ответы на вопросы о покупке и обмене билетов, оплате и документах.",
};
export default function Page() {
  return (
    <div className="cabinet-section">
      <PageHeading
        title="Часто задаваемые вопросы (FAQ)"
        description="Ответы на популярные вопросы о покупке, обмене билетов и закрывающих документах"
      />
      <Faq />
    </div>
  );
}
