import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { getBlogPosts } from "@/api/apiClient";
import type { Post } from "@/api/apiClient";

export default function Blog() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const res = await getBlogPosts({ limit: 20 });
        setPosts(res.data.data);
      } catch (e: any) {
        setError(e?.response?.data?.message || "Erreur lors du chargement");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    document.title = "Blog - AutoDrive";
  }, []);

  if (loading) {
    return (
      <div className="p-10 text-center">
        <p>Chargement...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-10 text-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <>
      <title>Blog - AutoDrive</title>

      <h1 className="text-2xl font-bold">Blog</h1>

      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Card key={post.id || post._id} className="overflow-hidden pt-0">
            <CardHeader className={cn("relative p-0")}>
              <Badge
                className={cn(
                  "absolute top-1 left-1 z-10",
                  post.categorie === "Actualité" && "bg-blue-500 text-white",
                  post.categorie === "Conseils" && "bg-green-500 text-white",
                  post.categorie === "Promo" && "bg-yellow-500 text-white"
                )}
              >
                {post.categorie}
              </Badge>
              {post.photo ? (
                <img
                  src={post.photo}
                  alt={post.titre}
                  className="w-full h-48 object-cover rounded-md"
                  onError={(e) => (e.currentTarget.src = "/placeholder.png")}
                />
              ) : (
                <div className="w-full h-48 flex items-center justify-center bg-gray-200 text-gray-500">
                  Pas d'image
                </div>
              )}
              <CardTitle>{post.titre}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mt-4 space-y-2 text-left">
                <p>{post.extrait}</p>
              </div>
              <div className="mt-4 flex justify-between items-center">
                <p className="text-sm text-gray-500">
                  Date de rédaction: {post.dateRedaction}
                </p>
                <Link to={`article/${post.id || post._id}`}>
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