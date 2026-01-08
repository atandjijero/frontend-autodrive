import { SignupForm } from "@/components/forms/signup-form";
import { useTranslation } from "react-i18next";

export default function Inscription() {
  const { t } = useTranslation();
  return (
    <>
      <title>{t('auth.signup_title')}</title>
      <SignupForm className="w-100 mx-auto" />
    </>
  );
}
