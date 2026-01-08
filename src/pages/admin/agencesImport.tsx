import { useState } from "react";
import { importAgencies } from "@/api/apiClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { IconArrowLeft, IconUpload } from "@tabler/icons-react";

export default function AgencesImport() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<any>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== 'application/json') {
        toast.error("Veuillez sélectionner un fichier JSON valide.");
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error("Veuillez sélectionner un fichier.");
      return;
    }

    setLoading(true);
    try {
      const response = await importAgencies(file);
      setResult(response.data);
      toast.success(`✅ ${response.data.imported} agences importées avec succès !`, {
        style: { background: "#e6f4ea", color: "#1e7e34" },
      });
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ?? "❌ Erreur lors de l'import.",
        {
          style: { background: "#fdecea", color: "#b71c1c" },
        }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pl-4 md:pl-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={() => navigate("/admin/agences/liste")}>
          <IconArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
        <h1 className="text-2xl font-bold">Importer des agences</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Import depuis un fichier JSON</CardTitle>
          <CardDescription>
            Sélectionnez un fichier JSON contenant les données des agences à importer.
            Le fichier doit contenir un tableau d'objets agence.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="file" className="block text-sm font-medium">
                Fichier JSON *
              </label>
              <input
                id="file"
                type="file"
                accept=".json"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                required
              />
              <p className="text-xs text-gray-500">
                Format attendu: [{'{'}'name': 'Agence 1', 'address': '...', ...{'}'}, ...]
              </p>
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={loading || !file}>
                <IconUpload className="mr-2 h-4 w-4" />
                {loading ? "Import en cours..." : "Importer les agences"}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate("/admin/agences/liste")}>
                Annuler
              </Button>
            </div>
          </form>

          {result && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold mb-2">Résultat de l'import:</h3>
              <p>Total d'agences dans le fichier: {result.total}</p>
              <p className="text-green-600">Agences importées: {result.imported}</p>
              {result.total > result.imported && (
                <p className="text-orange-600">
                  Agences ignorées: {result.total - result.imported} (erreurs possibles)
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}