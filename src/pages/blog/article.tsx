import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getBlogPost, resolveUrl } from "@/api/apiClient";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Post } from "@/api/apiClient";

export default function ArticlePage() {
  const params = useParams<{ id?: string; slug?: string }>();
  const id = params.id ?? params.slug;

  const [article, setArticle] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      if (!id) {
        setError("Identifiant de l'article manquant");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.debug("Fetching article with id/slug:", id);
        const res = await getBlogPost(id);
        console.debug("Article response:", res);
        setArticle(res.data);
      } catch (e: any) {
        console.error("Error fetching article:", e);
        setError(e?.response?.data?.message || "Erreur lors du chargement de l'article");
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  useEffect(() => {
    if (article) {
      document.title = `${article.titre} - ${article.categorie} – AutoDrive`;
    }
  }, [article]);

  if (loading) {
    return (
      <div className="p-10 text-center">
        <p>Chargement...</p>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="p-10 text-left max-w-200 mx-auto">
        <div className="flex justify-center items-center h-64">
          <p className="text-red-600">{error || "Article non trouvé"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-10 text-left max-w-200 mx-auto">
      <header className="py-3">
        <h1 className="text-2xl font-bold text-left py-1">{article.titre}</h1>
        <Badge
          className={cn(
            "",
            article.categorie === "Actualité" && "bg-blue-500 text-white",
            article.categorie === "Conseils" && "bg-green-500 text-white",
            article.categorie === "Promo" && "bg-yellow-500 text-white"
          )}
        >
          {article.categorie}
        </Badge>
        <br />
        <p className="py-1">{article.author || article.idAdmin || "Auteur inconnu"}</p>
        <p className="text-sm text-gray-500">Date de rédaction: {article.dateRedaction}</p>
      </header>

      <Separator />

      <div className="py-10">
        {article.photo ? (
          <img
            src={resolveUrl(article.photo)}
            alt={article.titre}
            className="w-full h-48 object-cover rounded-md"
            onError={(e) => (e.currentTarget.src = "/vite.svg")}
          />
        ) : (
          <div className="w-full h-48 flex items-center justify-center bg-gray-200 text-gray-500">
            Pas d'image
          </div>
        )}

        <div className="py-10 space-y-4">
          {article.corps.split("\n\n").map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </div>
    </div>
  );
}
