import Link from "@/components/ui/app-link";
import { AuthCard } from "@/components/auth/auth-card";

export const metadata = { title: "Письмо отправлено", robots: { index: false, follow: false } };

export default function ResetSentPage() {
  return (
    <AuthCard title="Письмо отправлено">
      <p className="auth-card__description">
        Проверьте почту, указанную при регистрации — там будет ссылка для восстановления пароля.
      </p>
      <div className="auth-form__links">
        <Link className="text-link" href="/">
          Вернуться ко входу
        </Link>
      </div>
    </AuthCard>
  );
}
