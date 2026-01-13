import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiClient, resolveUrl } from "@/api/apiClient";
import generateContractPdf from "@/lib/generateContractPdf";
import { toast } from "sonner";

// Helper to check if user is authenticated
function isAuthenticated(): boolean {
  return !!localStorage.getItem("token");
}

export default function DownloadRedirect() {
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;

    const fetchAndDownload = async () => {
      // Check authentication before proceeding
      if (!isAuthenticated()) {
        toast.error('Vous devez être connecté pour télécharger le reçu');
        navigate('/connexion');
        return;
      }

      // Open a blank window synchronously to avoid popup blockers
      const newWin = window.open('', '_blank');
      try {
        console.debug('DownloadRedirect: fetching contract data for id', id);
        console.debug('DownloadRedirect: token present:', !!localStorage.getItem('token'));
        // Backend now returns contract data for frontend PDF generation
        const resp = await apiClient.get(`/contracts/${id}/download`);
        console.debug('DownloadRedirect: contract data received', resp.data);
        let contract = resp.data;
        // Fetch active agency to ensure PDF always has real agency info
        let agency: any = null;
        try {
          const agencyId = contract.agencyId || contract.agenceId || contract.agence?._id;
          if (agencyId) {
            const agencyResp = await apiClient.get(`/agencies/${agencyId}`);
            agency = agencyResp.data;
          }
        } catch (e) {
          console.warn('Unable to fetch agency by id, will try active agency', e);
        }
        // Fallback: fetch active agency if not found by ID
        if (!agency) {
          try {
            const activeRes = await apiClient.get('/agencies/agencies/active/all?limit=1');
            if ((activeRes as any).data && (activeRes as any).data.length) {
              agency = (activeRes as any).data[0];
            }
          } catch (e) {
            console.warn('Unable to fetch active agency', e);
          }
        }

        // Try to resolve agency logo URL: prefer agency.logo then contract fields
        const logoFieldCandidates = [
          agency?.logo,
          contract.agenceLogo,
          contract.logo,
          contract.agencyLogo,
          contract.agenceLogoPath,
        ];
        const logoCandidate = logoFieldCandidates.find(Boolean) as string | undefined;
        const logoUrl = resolveUrl(logoCandidate);

        const doc = await generateContractPdf(contract, { agency: agency || undefined, agencyLogoUrl: logoUrl || undefined });
        const pdfBlob = doc.output('blob');
        const pdfUrl = window.URL.createObjectURL(pdfBlob);

        const filename = `contrat-${contract._id || id}.pdf`;
        if (newWin) {
          // Inject a small page that auto-clicks a download link to force download
          try {
            const html = `<!doctype html><html><head><meta charset="utf-8"><title>Download</title></head><body><a id="dl" href="${pdfUrl}" download="${filename}"></a><script>document.getElementById('dl').click();</script></body></html>`;
            newWin.document.write(html);
            newWin.document.close();
          } catch (e) {
            // fallback to navigating to blob (may open in PDF viewer)
            newWin.location.href = pdfUrl;
          }
        } else {
          // Fallback: create anchor in current page and click it
          const a = document.createElement('a');
          a.href = pdfUrl;
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          a.remove();
        }

        toast.success('Génération du reçu terminée — ouverture dans un nouvel onglet');
        setTimeout(() => window.URL.revokeObjectURL(pdfUrl), 1000 * 30);
        // After download, redirect user to entreprise dashboard
        try {
          navigate('/entreprise/dashboard');
        } catch (e) {
          console.warn('Unable to navigate after download', e);
        }
      } catch (err: any) {
        console.error('Erreur lors de la génération du PDF côté client', err);
        console.error('Error status:', err?.response?.status);
        console.error('Error message:', err?.response?.data?.message);
        console.error('Full error:', JSON.stringify(err?.response?.data));
        
        // Check if error is 401 Unauthorized
        if (err?.response?.status === 401 || err?.status === 401) {
          console.warn('Authentication failed (401) - redirecting to login');
          toast.error('Votre session a expiré — veuillez vous reconnecter');
          localStorage.removeItem('token');
          navigate('/connexion');
          if (newWin) newWin.close();
          return;
        }
        
        toast.error('Impossible de générer le reçu');
        // Fallback to previous behaviour: try to download from backend (if still available)
        try {
          const url = `${apiClient.defaults.baseURL}/contracts/${id}/download`;
          if (newWin) newWin.location.replace(url);
          else window.location.replace(url);
        } catch (e) {
          navigate('/');
          if (newWin) newWin.close();
        }
      }
    };

    fetchAndDownload();
  }, [id, navigate]);

  return null;
}
