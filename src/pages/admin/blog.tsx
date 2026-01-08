import { useState, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { createBlogPost, updateBlogPost, deleteBlogPost, publishBlogPost, uploadBlogImage, getAdminBlogPosts, resolveUrl } from "@/api/apiClient";
import type { Post } from "@/api/apiClient";
import { IconPlus } from "@tabler/icons-react";
import { useAuth } from "@/hooks/useAuth";

export default function AdminBlog() {
  const location = useLocation();
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<Post | null>(null);
  const [form, setForm] = useState({
    titre: "",
    slug: "",
    corps: "",
    extrait: "",
    idAdmin: user ? `${user.prenom} ${user.nom}` : "",
    categorie: "",
    photo: "",
  });

  // Déterminer le mode actuel basé sur l'URL
  const getCurrentMode = () => {
    const path = location.pathname;
    if (path.includes('/create')) return 'create';
    if (path.includes('/published')) return 'published';
    if (path.includes('/drafts')) return 'drafts';
    return 'all';
  };

  const currentMode = getCurrentMode();

  // Filtrer les posts selon le mode de manière réactive
  const filteredPosts = useMemo(() => {
    if (!posts || !Array.isArray(posts)) return [];
    switch (currentMode) {
      case 'published':
        return posts.filter(post => post.status === 'published');
      case 'drafts':
        return posts.filter(post => post.status === 'draft');
      default:
        return posts;
    }
  }, [posts, currentMode]);

  // Titre de la page selon le mode
  const getPageTitle = () => {
    switch (currentMode) {
      case 'create':
        return 'Créer un nouvel article';
      case 'published':
        return 'Articles publiés';
      case 'drafts':
        return 'Brouillons';
      default:
        return 'Gestion du Blog';
    }
  };

  useEffect(() => {
    if (user) {
      setForm(prev => ({ ...prev, idAdmin: `${user.prenom} ${user.nom}` }));
    }
  }, [user]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await getAdminBlogPosts({});
      console.log("Fetched admin posts (raw):", res.data);

      // Support several response shapes from backend:
      // - { data: Post[] , ... }
      // - Post[]
      // - { items: Post[] }
      let postsData: Post[] = [];
      if (Array.isArray(res.data)) {
        postsData = res.data as Post[];
      } else if (Array.isArray((res.data && (res.data as any).data) || [])) {
        postsData = (res.data as any).data as Post[];
      } else if (Array.isArray((res.data && (res.data as any).items) || [])) {
        postsData = (res.data as any).items as Post[];
      } else {
        // fallback: try to find any array inside the object
        const found = Object.values(res.data || {}).find(v => Array.isArray(v));
        if (found) postsData = found as Post[];
      }

      console.log("Normalized admin posts:", postsData);
      setPosts(postsData || []);
    } catch (e: any) {
      console.error('Error fetching admin posts:', e);
      setError(e?.response?.data?.message || "Erreur lors du chargement");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form data:', form);
    console.log('User:', user);
    try {
      const data = { ...form };
      if (editing) {
        await updateBlogPost(editing.id || editing._id!, data);
      } else {
        await createBlogPost(data);
      }
      setForm({ titre: "", slug: "", corps: "", extrait: "", idAdmin: user ? `${user.prenom} ${user.nom}` : "", categorie: "", photo: "" });
      setEditing(null);
      fetchPosts();
    } catch (e: any) {
      setError(e?.response?.data?.message || "Erreur lors de la sauvegarde");
    }
  };

  const handleEdit = (post: Post) => {
    setEditing(post);
    setForm({
      titre: post.titre,
      slug: post.slug,
      corps: post.corps,
      extrait: post.extrait || "",
      idAdmin: post.idAdmin || "",
      categorie: post.categorie || "",
      photo: post.photo || "",
    });
  };

  const handleDelete = async (id: string) => {
    if (confirm("Supprimer cet article ?")) {
      try {
        await deleteBlogPost(id);
        fetchPosts();
      } catch (e: any) {
        setError(e?.response?.data?.message || "Erreur lors de la suppression");
      }
    }
  };

  const handlePublish = async (id: string) => {
    try {
      await publishBlogPost(id);
      fetchPosts();
    } catch (e: any) {
      setError(e?.response?.data?.message || "Erreur lors de la publication");
    }
  };

  const handleImageUpload = async (file: File) => {
    try {
      const res = await uploadBlogImage(file);
      setForm(prev => ({ ...prev, photo: res.data.url }));
    } catch (e: any) {
      console.error('Upload error:', e);
      setError("Erreur lors de l'upload de l'image: " + (e?.response?.data?.message || e.message));
    }
  };

  return (
    <DashboardLayout>
      <main className="p-6 container mx-auto max-w-6xl">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold">{getPageTitle()}</h1>
          {currentMode !== 'create' && (
            <Button onClick={() => window.location.href = '/admin/blog/create'}>
              <IconPlus className="w-4 h-4 mr-2" />
              Nouvel article
            </Button>
          )}
        </div>
        {error && <p className="text-red-600 mb-4">{error}</p>}

        {(currentMode === 'create' || editing) && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>{editing ? "Modifier l'article" : "Nouvel article"}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                placeholder="Titre"
                value={form.titre}
                onChange={(e) => setForm(prev => ({ ...prev, titre: e.target.value }))}
                required
              />
              <Input
                placeholder="Slug (URL)"
                value={form.slug}
                onChange={(e) => setForm(prev => ({ ...prev, slug: e.target.value }))}
                required
              />
              <Textarea
                placeholder="Extrait"
                value={form.extrait}
                onChange={(e) => setForm(prev => ({ ...prev, extrait: e.target.value }))}
              />
              <Textarea
                placeholder="Contenu"
                value={form.corps}
                onChange={(e) => setForm(prev => ({ ...prev, corps: e.target.value }))}
                required
                rows={10}
              />
              <Input
                placeholder="Auteur"
                value={form.idAdmin}
                disabled
                readOnly
              />
              <Input
                placeholder="Catégorie"
                value={form.categorie}
                onChange={(e) => setForm(prev => ({ ...prev, categorie: e.target.value }))}
              />
              <div>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files && handleImageUpload(e.target.files[0])}
                />
                {form.photo && <img src={resolveUrl(form.photo)} alt="Preview" className="mt-2 w-32 h-32 object-cover" />}
              </div>
              <Button type="submit">{editing ? "Modifier" : "Créer"}</Button>
              {editing && <Button type="button" variant="outline" onClick={() => setEditing(null)}>Annuler</Button>}
            </form>
          </CardContent>
        </Card>
        )}

        <div className="space-y-4">
          {loading && <p>Chargement...</p>}
          {filteredPosts.map((post) => (
            <Card key={post.id || post._id || post.titre}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{post.titre}</span>
                  <Badge variant={post.status === "published" ? "default" : "secondary"}>
                    {post.status}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-2">{post.extrait}</p>
                <div className="flex gap-2">
                  <Button onClick={() => handleEdit(post)}>Modifier</Button>
                  {(post.id || post._id) && (
                    <>
                      <Button onClick={() => handlePublish(post.id || post._id!)} variant="outline">
                        {post.status === "published" ? "Dépublier" : "Publier"}
                      </Button>
                      <Button onClick={() => handleDelete(post.id || post._id!)} variant="destructive">Supprimer</Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </DashboardLayout>
  );
}