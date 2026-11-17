import { AuthCard } from "@/components/auth/auth-card";
import { RegisterForm } from "@/components/auth/auth-forms";

export const metadata = {
  title: "Регистрация",
  description: "Регистрация участника на платформе ADPASS.EVENT.",
};

export default function RegisterPage() {
  return (
    <AuthCard title="Регистрация">
      <RegisterForm />
    </AuthCard>
  );
}
