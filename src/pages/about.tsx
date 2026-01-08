import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

export default function About() {
  const { t } = useTranslation();
  return (
    <div className="p-6 max-w-3xl mx-auto space-y-8">
      <h1 className="text-4xl font-bold text-center mb-6">{t('about.title')}</h1>

      <Card className="shadow-md hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle>{t('about.mission.title')}</CardTitle>
          <CardDescription>{t('about.mission.desc')}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">{t('about.mission.content')}</p>
        </CardContent>
      </Card>

      <Card className="shadow-md hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle>{t('about.why.title')}</CardTitle>
          <CardDescription>{t('about.why.desc')}</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="list-none space-y-3">
            <li>
              <Badge variant="secondary">🚘</Badge> {t('about.advantages.item1')}
            </li>
            <li>
              <Badge variant="secondary">💰</Badge> {t('about.advantages.item2')}
            </li>
            <li>
              <Badge variant="secondary">🤝</Badge> {t('about.advantages.item3')}
            </li>
            <li>
              <Badge variant="secondary">🌍</Badge> {t('about.advantages.item4')}
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card className="shadow-md hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle>{t('about.vision.title')}</CardTitle>
          <CardDescription>{t('about.vision.desc')}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">{t('about.vision.content')}</p>
        </CardContent>
      </Card>

      <Separator className="my-6" />

      <p className="text-center text-sm text-muted-foreground">© 2025 AutoDrive – {t('about.partner')}</p>
    </div>
  );
}
