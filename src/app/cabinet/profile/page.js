import { PageHeading } from "@/components/cabinet/page-heading";
import { ProfileForm } from "@/components/cabinet/profile-form";
export const metadata = {
  title: "Настройки профиля",
  description: "Личные данные и корпоративные реквизиты участника ADPASS.EVENT.",
};
export default function Page() {
  return (
    <div className="cabinet-section">
      <PageHeading
        title="Настройки профиля"
        description="Управляйте своими личными данными и корпоративными реквизитами"
      />
      <ProfileForm />
    </div>
  );
}
