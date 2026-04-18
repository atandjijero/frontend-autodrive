import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { getBlogPosts, resolveUrl } from "@/api/apiClient";
import type { Post } from "@/api/apiClient";
import { Footer } from "@/components/layout/Footer";
import { Helmet } from "react-helmet-async";
import { Loader2, Calendar, User, ArrowRight, BookOpen, Inbox } from "lucide-react";

export default function Blog() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const res = await getBlogPosts({ limit: 20 });
        
        // Robust data handling
        let data: Post[] = [];
        if (res.data && Array.isArray((res.data as any).data)) {
          data = (res.data as any).data;
        } else if (Array.isArray(res.data)) {
          data = res.data;
        } else if (res.data && Array.isArray((res.data as any).items)) {
          data = (res.data as any).items;
        }
        
        setPosts(data);
      } catch (e: any) {
        console.error("Error fetching blog posts:", e);
        setError(e?.response?.data?.message || "Erreur lors du chargement des articles");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col pt-20">
      <Helmet>
        <title>Blog & Actualités - AutoDrive</title>
        <meta name="description" content="Découvrez les dernières actualités, conseils et promotions de l'industrie automobile avec le blog AutoDrive." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden bg-slate-900 border-b border-slate-800">
        <div className="absolute inset-0 z-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-transparent"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full blur-[120px] -mr-48 -mt-48"></div>
        </div>
        
        <div className="container relative z-10 mx-auto px-4 text-center">
          <Badge className="mb-4 bg-blue-500/10 text-blue-400 border-blue-500/20 px-4 py-1.5 rounded-full text-sm font-semibold tracking-wider uppercase">
            AutoDrive Magazine
          </Badge>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tighter">
            Blog & <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Actualités</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed">
            Restez informé des dernières tendances du monde de la location, nos nouveaux véhicules et nos offres exclusives.
          </p>
        </div>
      </section>

      <main className="flex-grow container mx-auto px-4 py-16">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
            <p className="text-slate-500 font-medium animate-pulse">Chargement de nos articles...</p>
          </div>
        ) : error ? (
          <div className="max-w-md mx-auto p-8 text-center bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 rounded-3xl">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl text-red-600">⚠️</span>
            </div>
            <h3 className="text-xl font-bold text-red-700 dark:text-red-400 mb-2">Oops ! Une erreur est survenue</h3>
            <p className="text-red-600/80 dark:text-red-400/80 mb-6">{error}</p>
            <Button variant="outline" onClick={() => window.location.reload()} className="rounded-full">Réessayer</Button>
          </div>
        ) : posts.length === 0 ? (
          <div className="max-w-2xl mx-auto py-20 text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-slate-100 dark:bg-slate-900 rounded-full mb-8 shadow-inner">
              <Inbox className="w-10 h-10 text-slate-400" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Aucun article pour le moment</h2>
            <p className="text-lg text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-10 leading-relaxed font-medium">
              Notre équipe de rédaction prépare du contenu passionnant pour vous. Revenez très bientôt !
            </p>
            <Link to="/">
              <Button className="rounded-full px-8 py-6 bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/25 transition-all">
                Retour à l'accueil
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 xl:gap-10">
            {posts.map((post) => (
              <Link key={post.id} to={`/blog/${post.slug ?? post.id}`} className="group h-full">
                <Card className="h-full flex flex-col border-0 bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_20px_60px_rgba(0,0,0,0.4)] transition-all duration-500 hover:-translate-y-2 relative">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Badge
                      className={cn(
                        "absolute top-5 left-5 z-20 shadow-lg px-4 py-1.5 rounded-full border-0 text-white font-bold tracking-wide",
                        post.categorie === "Actualité" && "bg-blue-600",
                        post.categorie === "Conseils" && "bg-emerald-600",
                        post.categorie === "Promo" && "bg-amber-600",
                        !["Actualité", "Conseils", "Promo"].includes(post.categorie || "") && "bg-slate-600"
                      )}
                    >
                      {post.categorie || "Article"}
                    </Badge>
                    
                    {post.photo ? (
                      <img
                        src={resolveUrl(post.photo)}
                        alt={post.titre}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        onError={(e) => (e.currentTarget.src = "/placeholder.png")}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-400">
                        <BookOpen className="w-12 h-12 opacity-20" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>

                  <CardContent className="flex-1 p-8 flex flex-col">
                    <div className="flex items-center gap-4 mb-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        {post.dateRedaction || "Disponible"}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5" />
                        {post.author || "Admin"}
                      </div>
                    </div>

                    <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4 line-clamp-2 leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {post.titre}
                    </h3>

                    <p className="text-slate-500 dark:text-slate-400 line-clamp-3 mb-8 font-medium leading-relaxed">
                      {post.extrait || (post.corps ? post.corps.substring(0, 150) + "..." : "")}
                    </p>

                    <div className="mt-auto pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-blue-600 dark:text-blue-400 font-bold group/btn">
                      <span>Lire l'article</span>
                      <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center group-hover/btn:bg-blue-600 group-hover/btn:text-white transition-all duration-300">
                        <ArrowRight className="w-5 h-5" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}