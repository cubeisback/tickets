"use client";
import { useAppRouter as useRouter } from "@/lib/navigation";
import { AuthShell } from "@/components/auth/auth-shell";
import { AuthCard } from "@/components/auth/auth-card";
import { TextField } from "@/components/ui/text-field";
import { PasswordField } from "@/components/ui/password-field";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

export function AdminLogin() {
  const router = useRouter();
  return (
    <AuthShell>
      <AuthCard
        title="Вход в панель управления"
        description="Администрирование билетной платформы ADPASS.EVENT"
      >
        <form
          className="auth-form"
          onSubmit={(event) => {
            event.preventDefault();
            router.push("/admin/dashboard");
          }}
        >
          <div className="auth-form__fields">
            <TextField
              id="admin-email"
              label="Электронная почта"
              name="email"
              type="email"
              autoComplete="username"
              placeholder="admin@adpass.ru"
              required
            />
            <PasswordField
              id="admin-password"
              name="password"
              autoComplete="current-password"
              required
            />
          </div>
          <Checkbox id="admin-remember">Запомнить меня</Checkbox>
          <Button type="submit">Войти →</Button>
        </form>
      </AuthCard>
    </AuthShell>
  );
}
