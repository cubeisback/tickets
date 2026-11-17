"use client";

import { assetPath } from "@/lib/paths";

import Link from "@/components/ui/app-link";
import { useAppRouter as useRouter } from "@/lib/navigation";
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/text-field";
import { PasswordField } from "@/components/ui/password-field";
import { Checkbox } from "@/components/ui/checkbox";
import { Divider } from "@/components/ui/divider";

function preventSubmit(event) {
  event.preventDefault();
}

export function LoginForm() {
  const router = useRouter();
  function login(event) {
    event.preventDefault();
    const { email, password } = event.currentTarget.elements;
    for (const field of [email, password]) {
      if (!field.value.trim()) {
        field.setCustomValidity("Заполните e-mail и пароль");
        field.reportValidity();
        return;
      }
    }
    router.push("/cabinet");
  }
  return (
    <form
      className="auth-form"
      method="post"
      onSubmit={login}
      onInput={(event) => event.target.setCustomValidity?.("")}
    >
      <Button variant="secondary">
        <img src={assetPath("/assets/yandex.svg")} alt="" width="20" height="20" />
        Войти через Яндекс ID
      </Button>
      <Divider>или войти с помощью почты</Divider>
      <div className="auth-form__fields">
        <TextField
          id="email"
          name="email"
          label="Электронная почта"
          type="text"
          inputMode="email"
          autoComplete="username"
          placeholder="you@company.ru"
          required
        />
        <PasswordField
          name="password"
          autoComplete="current-password"
          placeholder="••••••••••••"
          required
        />
      </div>
      <Button type="submit">Войти →</Button>
      <div className="auth-form__links">
        <p>
          Забыли пароль?{" "}
          <Link className="text-link" href="/forgot-password">
            Восстановить
          </Link>
        </p>
        <p>
          Нет аккаунта?{" "}
          <Link className="text-link" href="/register">
            Зарегистрироваться
          </Link>
        </p>
      </div>
    </form>
  );
}

export function RegisterForm() {
  function checkConfirmation(event) {
    const confirmation = event.currentTarget.elements.passwordConfirm;
    const password = event.currentTarget.elements.password;
    confirmation.setCustomValidity(
      confirmation.value && confirmation.value !== password.value ? "Пароли не совпадают" : "",
    );
  }

  return (
    <form className="auth-form" method="post" onSubmit={preventSubmit} onInput={checkConfirmation}>
      <div className="auth-form__fields">
        <div className="auth-form__row">
          <TextField id="name" name="name" label="Имя" autoComplete="given-name" required />
          <TextField
            id="surname"
            name="surname"
            label="Фамилия"
            autoComplete="family-name"
            required
          />
        </div>
        <TextField
          id="email"
          name="email"
          label="Электронная почта"
          type="email"
          autoComplete="email"
          placeholder="you@company.ru"
          required
        />
        <TextField
          id="phone"
          name="phone"
          label="Телефон"
          type="tel"
          autoComplete="tel"
          placeholder="+7 999 000-00-00"
        />
        <div className="auth-form__row">
          <PasswordField name="password" autoComplete="new-password" required />
          <PasswordField
            id="passwordConfirm"
            name="passwordConfirm"
            label="Повторите пароль"
            autoComplete="new-password"
            required
          />
        </div>
      </div>
      <Checkbox id="agree" name="agree" required>
        Я согласен с условиями использования сервиса и политикой обработки персональных данных
      </Checkbox>
      <Button type="submit">Создать аккаунт →</Button>
      <div className="auth-form__links">
        <p>
          Уже есть аккаунт?{" "}
          <Link className="text-link" href="/">
            Войти
          </Link>
        </p>
      </div>
    </form>
  );
}

export function ForgotPasswordForm() {
  const router = useRouter();
  function submit(event) {
    event.preventDefault();
    router.push("/forgot-password/sent");
  }
  return (
    <form className="auth-form" method="post" onSubmit={submit}>
      <TextField
        id="email"
        name="email"
        label="Электронная почта"
        type="email"
        autoComplete="email"
        placeholder="you@company.ru"
        required
      />
      <Button type="submit">Отправить ссылку →</Button>
      <div className="auth-form__links">
        <Link className="text-link" href="/">
          Вернуться ко входу
        </Link>
      </div>
    </form>
  );
}
