import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getBlogPost, resolveUrl } from "@/api/apiClient";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Post } from "@/api/apiClient";
import { Footer } from "@/components/layout/Footer";
import { Helmet } from "react-helmet-async";
import { 
  Loader2, 
  Calendar, 
  ChevronLeft, 
  Share2, 
  Clock, 
  Bookmark,
  Check
} from "lucide-react";
import { toast } from "sonner";

export default function ArticlePage() {
  const params = useParams<{ id?: string; slug?: string }>();
  const id = params.id ?? params.slug;

  const [article, setArticle] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isShared, setIsShared] = useState(false);

  useEffect(() => {
    const fetchArticle = async () => {
      if (!id) {
        setError("L'identifiant de l'article est manquant.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const res = await getBlogPost(id);
        const articleData = (res.data as any).data || res.data;
        setArticle(articleData);
        
        // Check if favorite
        const favorites = JSON.parse(localStorage.getItem("blog_favorites") || "[]");
        setIsFavorite(favorites.includes(articleData.id || id));
      } catch (e: any) {
        console.error("Error fetching article:", e);
        setError(e?.response?.data?.message || "Impossible de charger cet article.");
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  const handleToggleFavorite = () => {
    if (!article) return;
    const articleId = article.id || id || "";
    const favorites = JSON.parse(localStorage.getItem("blog_favorites") || "[]");
    
    let newFavorites;
    if (favorites.includes(articleId)) {
      newFavorites = favorites.filter((fid: string) => fid !== articleId);
      setIsFavorite(false);
      toast.success("Retiré des favoris");
    } else {
      newFavorites = [...favorites, articleId];
      setIsFavorite(true);
      toast.success("Ajouté aux favoris");
    }
    
    localStorage.setItem("blog_favorites", JSON.stringify(newFavorites));
  };

  const handleShare = async () => {
    if (!article) return;
    
    const shareData = {
      title: article.titre,
      text: article.extrait || article.titre,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        toast.success("Lien partagé !");
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setIsShared(true);
        toast.success("Lien copié dans le presse-papier");
        setTimeout(() => setIsShared(false), 2000);
      }
    } catch (err) {
      console.error("Error sharing:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 pt-20">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
        <p className="text-slate-500 font-medium animate-pulse">Chargement de l'article...</p>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen flex flex-col pt-20 bg-slate-50 dark:bg-slate-950">
        <main className="flex-grow container mx-auto px-4 py-20 text-center">
          <div className="max-w-md mx-auto p-10 bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-xl">
             <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">🏜️</span>
             </div>
             <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4">Article Introuvable</h2>
             <p className="text-slate-500 dark:text-slate-400 mb-8 font-medium">
               {error || "Nous n'avons pas pu trouver l'article que vous recherchez."}
             </p>
             <Link to="/blog">
               <Button className="rounded-full px-8 py-6 bg-blue-600 hover:bg-blue-700 w-full shadow-lg shadow-blue-500/25">
                 Retour au Blog
               </Button>
             </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const wordCount = article.corps?.split(/\s+/).length || 0;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col pt-20 font-sans selection:bg-blue-100 dark:selection:bg-blue-900/30">
      <Helmet>
        <title>{article.titre} - AutoDrive</title>
        <meta name="description" content={article.extrait || article.titre} />
      </Helmet>

      <main className="flex-grow">
        <article className="pb-20">
          <div className="container mx-auto px-4 lg:px-0 max-w-4xl pt-12">
            <Link to="/blog" className="inline-flex items-center text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors mb-10 group">
              <ChevronLeft className="w-4 h-4 mr-1 transition-transform group-hover:-translate-x-1" />
              Retour aux actualités
            </Link>

            <div className="flex flex-wrap items-center gap-3 mb-8">
              <Badge className={cn(
                "px-4 py-1.5 rounded-full border-0 text-white font-bold tracking-wide shadow-md",
                article.categorie === "Actualité" && "bg-blue-600",
                article.categorie === "Conseils" && "bg-emerald-600",
                article.categorie === "Promo" && "bg-amber-600",
                !["Actualité", "Conseils", "Promo"].includes(article.categorie || "") && "bg-slate-600"
              )}>
                {article.categorie || "Article"}
              </Badge>
              <div className="flex items-center gap-2 text-slate-400 text-sm font-bold">
                <span>•</span>
                <Clock className="w-4 h-4" />
                <span>{readingTime} min de lecture</span>
              </div>
            </div>

            <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-8 leading-[1.1] tracking-tight">
              {article.titre}
            </h1>

            <div className="flex items-center justify-between mb-12 py-6 border-y border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  {(article.author || article.idAdmin || "A")[0]}
                </div>
                <div>
                  <p className="font-black text-slate-900 dark:text-white leading-none mb-1">
                    {article.author || article.idAdmin || "Administrateur AutoDrive"}
                  </p>
                  <p className="text-sm text-slate-500 font-bold flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5" />
                    Publié le {article.dateRedaction}
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={handleShare}
                  className={cn(
                    "rounded-full border-slate-200 dark:border-slate-800 transition-all",
                    isShared ? "bg-green-50 text-green-600 border-green-200" : "hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:text-blue-600"
                  )}
                >
                  {isShared ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={handleToggleFavorite}
                  className={cn(
                    "rounded-full border-slate-200 dark:border-slate-800 transition-all",
                    isFavorite ? "bg-amber-50 text-amber-600 border-amber-200" : "hover:bg-amber-50 dark:hover:bg-amber-950/30 hover:text-amber-600"
                  )}
                >
                  <Bookmark className={cn("w-4 h-4", isFavorite && "fill-current")} />
                </Button>
              </div>
            </div>
          </div>

          <div className="container mx-auto px-4 lg:px-0 max-w-5xl mb-16">
            <div className="relative rounded-[3rem] overflow-hidden shadow-2xl aspect-[21/9] bg-slate-100 dark:bg-slate-900">
              {article.photo ? (
                <img
                  src={resolveUrl(article.photo)}
                  alt={article.titre}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.error("Image load error:", resolveUrl(article.photo));
                    e.currentTarget.src = "/placeholder.png";
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400">
                   <Clock className="w-12 h-12 opacity-20" />
                </div>
              )}
            </div>
          </div>

          <div className="container mx-auto px-4 lg:px-0 max-w-3xl">
            <div className="prose prose-lg dark:prose-invert prose-slate max-w-none">
              {article.extrait && (
                <div className="text-xl md:text-2xl font-medium text-slate-600 dark:text-slate-300 leading-relaxed italic mb-12 border-l-4 border-blue-600 pl-8 py-2 bg-blue-50/30 dark:bg-blue-900/10 rounded-r-2xl">
                  {article.extrait}
                </div>
              )}

              <div className="text-slate-700 dark:text-slate-300 space-y-8 leading-[1.8] text-lg font-medium">
                {article.corps?.split("\n\n").map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>

            <Separator className="my-20 bg-slate-200 dark:border-slate-800" />

            <div className="bg-blue-600 rounded-[2.5rem] p-10 md:p-16 text-center text-white relative overflow-hidden shadow-2xl shadow-blue-500/30 group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32 transition-transform duration-700 group-hover:scale-125"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl -ml-32 -mb-32"></div>
              
              <h3 className="text-3xl md:text-4xl font-black mb-6 relative z-10">Intéressé par nos services ?</h3>
              <p className="text-xl text-blue-100 mb-10 max-w-xl mx-auto font-medium relative z-10">
                Louez votre prochain véhicule en quelques clics et profitez de nos meilleurs tarifs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
                <Link to="/vehicules">
                  <Button className="rounded-full px-10 py-6 bg-white text-blue-600 hover:bg-blue-50 font-black text-lg transition-all shadow-xl">
                    Voir nos véhicules
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button className="rounded-full px-10 py-6 bg-blue-500/20 backdrop-blur-md border border-white/30 text-white hover:bg-white/10 font-bold text-lg transition-all">
                    Nous contacter
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
