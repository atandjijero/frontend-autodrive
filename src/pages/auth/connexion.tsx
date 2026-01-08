import { LoginForm } from "@/components/forms/login-form";
import { useTranslation } from "react-i18next";

export default function Connexion() {
  const { t } = useTranslation();
  return (
    <>
      <title>{t('auth.login_title')}</title>
      <main>
        <LoginForm className="w-100 mx-auto" />
      </main>
    </>
  );
}
