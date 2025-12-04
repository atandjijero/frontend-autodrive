import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

type Articles = {
  [id: string]: {
    titre: string;
    categorie: "Actualité" | "Conseils" | "Promo";
    extrait: string;
    corps: string;
    photo?: string;
    idAdmin: string;
    dateRedaction: string;
  };
};

export const articles: Articles = {
  "1": {
    titre: "Nouveau model de BMW",
    categorie: "Actualité",
    extrait:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore necessitatibus vero voluptates! Nobis provident aspernatur quaerat asperiores quos?",
    corps: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore necessitatibus vero voluptates! Nobis provident aspernatur quaerat asperiores quos porro labore atque itaque pariatur amet doloribus, illum animi consequatur laboriosam ea?
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore necessitatibus vero voluptates! Nobis provident aspernatur quaerat asperiores quos porro labore atque itaque pariatur amet doloribus, illum animi consequatur laboriosam ea?
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore necessitatibus vero voluptates! Nobis provident aspernatur quaerat asperiores quos porro labore atque itaque pariatur amet doloribus, illum animi consequatur laboriosam ea?
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore necessitatibus vero voluptates! Nobis provident aspernatur quaerat asperiores quos porro labore atque itaque pariatur amet doloribus, illum animi consequatur laboriosam ea?
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore necessitatibus vero voluptates! Nobis provident aspernatur quaerat asperiores quos porro labore atque itaque pariatur amet doloribus, illum animi consequatur laboriosam ea?
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore necessitatibus vero voluptates! Nobis provident aspernatur quaerat asperiores quos porro labore atque itaque pariatur amet doloribus, illum animi consequatur laboriosam ea?
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore necessitatibus vero voluptates! Nobis provident aspernatur quaerat asperiores quos porro labore atque itaque pariatur amet doloribus, illum animi consequatur laboriosam ea?
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore necessitatibus vero voluptates! Nobis provident aspernatur quaerat asperiores quos porro labore atque itaque pariatur amet doloribus, illum animi consequatur laboriosam ea?
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore necessitatibus vero voluptates! Nobis provident aspernatur quaerat asperiores quos porro labore atque itaque pariatur amet doloribus, illum animi consequatur laboriosam ea?
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore necessitatibus vero voluptates! Nobis provident aspernatur quaerat asperiores quos porro labore atque itaque pariatur amet doloribus, illum animi consequatur laboriosam ea?
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore necessitatibus vero voluptates! Nobis provident aspernatur quaerat asperiores quos porro labore atque itaque pariatur amet doloribus, illum animi consequatur laboriosam ea?
     \n
     \n
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore necessitatibus vero voluptates! Nobis provident aspernatur quaerat asperiores quos porro labore atque itaque pariatur amet doloribus, illum animi consequatur laboriosam ea?
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore necessitatibus vero voluptates! Nobis provident aspernatur quaerat asperiores quos porro labore atque itaque pariatur amet doloribus, illum animi consequatur laboriosam ea?
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore necessitatibus vero voluptates! Nobis provident aspernatur quaerat asperiores quos porro labore atque itaque pariatur amet doloribus, illum animi consequatur laboriosam ea?
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore necessitatibus vero voluptates! Nobis provident aspernatur quaerat asperiores quos porro labore atque itaque pariatur amet doloribus, illum animi consequatur laboriosam ea?
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore necessitatibus vero voluptates! Nobis provident aspernatur quaerat asperiores quos porro labore atque itaque pariatur amet doloribus, illum animi consequatur laboriosam ea?
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore necessitatibus vero voluptates! Nobis provident aspernatur quaerat asperiores quos porro labore atque itaque pariatur amet doloribus, illum animi consequatur laboriosam ea?
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore necessitatibus vero voluptates! Nobis provident aspernatur quaerat asperiores quos porro labore atque itaque pariatur amet doloribus, illum animi consequatur laboriosam ea?
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore necessitatibus vero voluptates! Nobis provident aspernatur quaerat asperiores quos porro labore atque itaque pariatur amet doloribus, illum animi consequatur laboriosam ea?
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore necessitatibus vero voluptates! Nobis provident aspernatur quaerat asperiores quos porro labore atque itaque pariatur amet doloribus, illum animi consequatur laboriosam ea?
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore necessitatibus vero voluptates! Nobis provident aspernatur quaerat asperiores quos porro labore atque itaque pariatur amet doloribus, illum animi consequatur laboriosam ea?
    \n
    \n
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore necessitatibus vero voluptates! Nobis provident aspernatur quaerat asperiores quos porro labore atque itaque pariatur amet doloribus, illum animi consequatur laboriosam ea?
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore necessitatibus vero voluptates! Nobis provident aspernatur quaerat asperiores quos porro labore atque itaque pariatur amet doloribus, illum animi consequatur laboriosam ea?
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore necessitatibus vero voluptates! Nobis provident aspernatur quaerat asperiores quos porro labore atque itaque pariatur amet doloribus, illum animi consequatur laboriosam ea?
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore necessitatibus vero voluptates! Nobis provident aspernatur quaerat asperiores quos porro labore atque itaque pariatur amet doloribus, illum animi consequatur laboriosam ea?
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore necessitatibus vero voluptates! Nobis provident aspernatur quaerat asperiores quos porro labore atque itaque pariatur amet doloribus, illum animi consequatur laboriosam ea?
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore necessitatibus vero voluptates! Nobis provident aspernatur quaerat asperiores quos porro labore atque itaque pariatur amet doloribus, illum animi consequatur laboriosam ea?
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore necessitatibus vero voluptates! Nobis provident aspernatur quaerat asperiores quos porro labore atque itaque pariatur amet doloribus, illum animi consequatur laboriosam ea?
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore necessitatibus vero voluptates! Nobis provident aspernatur quaerat asperiores quos porro labore atque itaque pariatur amet doloribus, illum animi consequatur laboriosam ea?
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore necessitatibus vero voluptates! Nobis provident aspernatur quaerat asperiores quos porro labore atque itaque pariatur amet doloribus, illum animi consequatur laboriosam ea?
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore necessitatibus vero voluptates! Nobis provident aspernatur quaerat asperiores quos porro labore atque itaque pariatur amet doloribus, illum animi consequatur laboriosam ea?`,
    idAdmin: "5",
    dateRedaction: "string",
  },
  "2": {
    titre: "Comment changer de batterie",
    categorie: "Conseils",
    extrait:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore necessitatibus vero voluptates! Nobis provident aspernatur quaerat asperiores quos?",
    corps: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore necessitatibus vero voluptates! Nobis provident aspernatur quaerat asperiores quos porro labore atque itaque pariatur amet doloribus, illum animi consequatur laboriosam ea?
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore necessitatibus vero voluptates! Nobis provident aspernatur quaerat asperiores quos porro labore atque itaque pariatur amet doloribus, illum animi consequatur laboriosam ea?
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore necessitatibus vero voluptates! Nobis provident aspernatur quaerat asperiores quos porro labore atque itaque pariatur amet doloribus, illum animi consequatur laboriosam ea?
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore necessitatibus vero voluptates! Nobis provident aspernatur quaerat asperiores quos porro labore atque itaque pariatur amet doloribus, illum animi consequatur laboriosam ea?
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore necessitatibus vero voluptates! Nobis provident aspernatur quaerat asperiores quos porro labore atque itaque pariatur amet doloribus, illum animi consequatur laboriosam ea?
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore necessitatibus vero voluptates! Nobis provident aspernatur quaerat asperiores quos porro labore atque itaque pariatur amet doloribus, illum animi consequatur laboriosam ea?
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore necessitatibus vero voluptates! Nobis provident aspernatur quaerat asperiores quos porro labore atque itaque pariatur amet doloribus, illum animi consequatur laboriosam ea?`,
    idAdmin: "6",
    dateRedaction: "string",
  },
  "3": {
    titre: "Roulez 100k pour la moitié du prix",
    categorie: "Promo",
    extrait:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore necessitatibus vero voluptates! Nobis provident aspernatur quaerat asperiores quos?",
    corps: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore necessitatibus vero voluptates! Nobis provident aspernatur quaerat asperiores quos porro labore atque itaque pariatur amet doloribus, illum animi consequatur laboriosam ea?
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore necessitatibus vero voluptates! Nobis provident aspernatur quaerat asperiores quos porro labore atque itaque pariatur amet doloribus, illum animi consequatur laboriosam ea?
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore necessitatibus vero voluptates! Nobis provident aspernatur quaerat asperiores quos porro labore atque itaque pariatur amet doloribus, illum animi consequatur laboriosam ea?
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore necessitatibus vero voluptates! Nobis provident aspernatur quaerat asperiores quos porro labore atque itaque pariatur amet doloribus, illum animi consequatur laboriosam ea?
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore necessitatibus vero voluptates! Nobis provident aspernatur quaerat asperiores quos porro labore atque itaque pariatur amet doloribus, illum animi consequatur laboriosam ea?
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore necessitatibus vero voluptates! Nobis provident aspernatur quaerat asperiores quos porro labore atque itaque pariatur amet doloribus, illum animi consequatur laboriosam ea?
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore necessitatibus vero voluptates! Nobis provident aspernatur quaerat asperiores quos porro labore atque itaque pariatur amet doloribus, illum animi consequatur laboriosam ea?`,
    idAdmin: "7",
    dateRedaction: "string",
  },
};

export default function Blog() {
  return (
    <>
      <title>Blog - AutoDrive</title>

      <h1 className="text-2xl font-bold">Blog</h1>

      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Object.entries(articles).map(([id, article]) => (
          <Card key={id} className="overflow-hidden pt-0">
            <CardHeader className={cn("relative p-0")}>
              <Badge className={cn("absolute top-1 left-1 z-10")}>
                {article.categorie}
              </Badge>
              {article.photo ? (
                <img
                  src={article.photo[0]}
                  alt={`${article.photo}`}
                  className="w-full h-48 object-cover rounded-md"
                  onError={(e) => (e.currentTarget.src = "/placeholder.png")}
                />
              ) : (
                <div className="w-full h-48 flex items-center justify-center bg-gray-200 text-gray-500">
                  Pas d'image
                </div>
              )}
              <CardTitle>{article.titre}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mt-4 space-y-2 text-left">
                <p>{article.extrait}</p>
              </div>
              <div className="mt-4 flex justify-end">
                <Link to={`article/${id}`}>
                  <Button variant="outline">Lire</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
