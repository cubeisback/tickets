import { AuthCard } from "@/components/auth/auth-card";
import { LoginForm } from "@/components/auth/auth-forms";

export const metadata = {
  title: "Вход в аккаунт",
  description: "Войдите в ADPASS.EVENT для управления билетами и заказами на мероприятия ADPASS.",
};

export default function LoginPage() {
  return (
    <AuthCard
      title="Вход в аккаунт"
      description={<>Для управления вашими билетами и&nbsp;заказами</>}
    >
      <LoginForm />
    </AuthCard>
  );
}
