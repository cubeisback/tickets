import { AuthCard } from "@/components/auth/auth-card";
import { ForgotPasswordForm } from "@/components/auth/auth-forms";

export const metadata = {
  title: "Восстановление пароля",
  description: "Восстановление доступа к аккаунту ADPASS.EVENT.",
};

export default function ForgotPasswordPage() {
  return (
    <AuthCard
      title="Восстановление пароля"
      description="Укажите e-mail, привязанный к аккаунту — пришлём ссылку для сброса пароля."
    >
      <ForgotPasswordForm />
    </AuthCard>
  );
}
