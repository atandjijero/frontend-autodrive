import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { articles } from "./blog";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

export default function Articles() {
  const { id } = useParams();

  useEffect(() => {
    const articlesTitre = articles[String(id)]?.titre ?? "articles inexistant";
    const articlesCatego =
      articles[String(id)]?.categorie ?? "articles inexistant";
    document.title = `${articlesTitre} - ${articlesCatego} – AutoDrive`;
  }, [id]);

  return (
    <>
      <div className="p-10 text-left max-w-200 mx-auto">
        <header className="py-3">
          <h1 className="text-2xl font-bold text-left py-1">
            {articles[String(id)]?.titre}
          </h1>

          <Badge className="py-1">{articles[String(id)]?.categorie}</Badge>
          <br />
          <p className="py-1">
            {/* Nom de l'auteur */ articles[String(id)]?.idAdmin + ": un admin"}
          </p>
        </header>
        <Separator />
        <div className="py-10">
          {articles.photo ? (
            <img
              src={`${articles.photo}`}
              alt={`${articles.photo}`}
              className="w-full h-48 object-cover rounded-md"
              onError={(e) => (e.currentTarget.src = "/placeholder.png")}
            />
          ) : (
            <div className="w-full h-48 flex items-center justify-center bg-gray-200 text-gray-500">
              Pas d'image
            </div>
          )}
          <div className="py-10">
            <p>{articles[String(id)]?.corps}</p>
          </div>
        </div>
      </div>
    </>
  );
}
