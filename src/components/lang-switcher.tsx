import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const changeLang = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="sm" onClick={() => changeLang('fr')}>FR</Button>
      <Button variant="ghost" size="sm" onClick={() => changeLang('en')}>EN</Button>
      <Button variant="ghost" size="sm" onClick={() => changeLang('de')}>DE</Button>
    </div>
  );
}
