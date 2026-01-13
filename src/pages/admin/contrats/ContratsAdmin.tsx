import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, CheckCircle, XCircle, Download, MoreHorizontal, AlertCircle, FileText, User, DollarSign, Clock, Mail } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { getAllContracts, validateContract, downloadContractPDF, updateContract, deleteContract, getAgencyById, resolveUrl, getActiveAgencies } from "@/api/apiClient";
import { generateContractPdf } from "@/lib/generateContractPdf";
import { useAuth } from "@/hooks/useAuth";

interface Contract {
  _id: string;
  userId: {
    nom: string;
    prenom: string;
    email: string;
    telephone: string;
    role: string;
  };
  vehicleId?: {
    marque: string;
    modele: string;
    immatriculation: string;
    prix: number;
  };
  dateDebut: string;
  dateFin: string;
  montantTotal: number;
  acompteVerse: number;
  conditionsSpeciales?: string;
  statut: 'Pending' | 'Approved' | 'Rejected';
  commentaires?: string;
  dateValidation?: string;
  validePar?: {
    nom: string;
    prenom: string;
  };
}

export default function AdminContrats() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [pendingIntent, setPendingIntent] = useState<'approve' | 'reject' | 'modify' | 'delete' | null>(null);
  const [commentaires, setCommentaires] = useState('');
  const [modifyMontant, setModifyMontant] = useState<string>('');
  const [modifyAcompte, setModifyAcompte] = useState<string>('');
  const [modifyConditions, setModifyConditions] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | 'info' | null; text: string }>({ type: null, text: '' });
  const [updating, setUpdating] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    console.log('AdminContrats component mounted');
    console.log('Current user:', user);
    // If we have a user and they're not admin, block access.
    // If `user` is null/undefined during initial load, attempt to fetch contracts
    // (backend will enforce authentication). This avoids blocking the UI
    // while auth state is still initializing.
    if (user && user.role !== 'admin') {
      console.error('User is not admin, access denied');
      setError('Accès refusé - Réservé aux administrateurs');
      setLoading(false);
      return;
    }

    loadContracts();
  }, [user]);

  const loadContracts = async () => {
    try {
      console.log('Loading contracts for admin...');
      console.log('User role:', user?.role);
      setError(null);
      const response = await getAllContracts();
      console.log('Contracts response:', response);
      console.log('Contracts data:', response.data);
      setContracts(response.data);
    } catch (error: any) {
      console.error('Erreur lors du chargement des contrats:', error);
      setError(error.response?.data?.message || error.message || 'Erreur lors du chargement des contrats');
    } finally {
      setLoading(false);
    }
  };

  const updateContractStatus = async (contractId: string, statut: 'Approved' | 'Rejected') => {
    try {
      console.log('Updating contract status:', contractId, statut, commentaires);
      setUpdating(true);
      setError(null);
      const data: any = { valider: statut === 'Approved' };
      if (commentaires.trim()) data.commentaires = commentaires;

      console.log('Sending validation data:', data);
      const response = await validateContract(contractId, data);
      console.log('Validate response:', response);
      console.log('Contract validated/rejected successfully');

      loadContracts(); // Recharger la liste
      setSelectedContract(null);
      setDialogOpen(false);
      setPendingIntent(null);
      setCommentaires('');
      setStatusMessage({ type: 'success', text: statut === 'Approved' ? 'Contrat approuvé avec succès.' : 'Contrat rejeté.' });
      setTimeout(() => setStatusMessage({ type: null, text: '' }), 4000);
    } catch (error: any) {
      console.error('Erreur lors de la mise à jour du contrat:', error);
      console.error('Error response:', error.response);
      console.error('Error data:', error.response?.data);
      const msg = error.response?.data?.message || error.message || 'Erreur lors de la mise à jour du contrat';
      setError(msg);
      setStatusMessage({ type: 'error', text: msg });
      setTimeout(() => setStatusMessage({ type: null, text: '' }), 6000);
    } finally {
      setUpdating(false);
    }
  };

  const handleModifyContract = async () => {
    if (!selectedContract) return;
    try {
      setUpdating(true);
      setError(null);
      const body: any = {};
      if (modifyMontant !== '') body.montantTotal = Number(modifyMontant);
      if (modifyAcompte !== '') body.acompteVerse = Number(modifyAcompte);
      if (modifyConditions.trim() !== '') body.conditionsSpeciales = modifyConditions.trim();

      await updateContract(selectedContract._id, body);
      await loadContracts();
      setDialogOpen(false);
      setPendingIntent(null);
      setSelectedContract(null);
      setStatusMessage({ type: 'success', text: 'Contrat modifié avec succès.' });
      setTimeout(() => setStatusMessage({ type: null, text: '' }), 4000);
    } catch (error: any) {
      console.error('Erreur lors de la modification du contrat:', error);
      const msg = error.response?.data?.message || error.message || 'Erreur lors de la modification du contrat';
      setError(msg);
      setStatusMessage({ type: 'error', text: msg });
      setTimeout(() => setStatusMessage({ type: null, text: '' }), 6000);
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteContract = async (contractId: string) => {
    try {
      setUpdating(true);
      setError(null);
      await deleteContract(contractId);
      await loadContracts();
      setDialogOpen(false);
      setPendingIntent(null);
      setSelectedContract(null);
      setStatusMessage({ type: 'success', text: 'Contrat supprimé.' });
      setTimeout(() => setStatusMessage({ type: null, text: '' }), 4000);
    } catch (error: any) {
      console.error('Erreur lors de la suppression du contrat:', error);
      const msg = error.response?.data?.message || error.message || 'Erreur lors de la suppression du contrat';
      setError(msg);
      setStatusMessage({ type: 'error', text: msg });
      setTimeout(() => setStatusMessage({ type: null, text: '' }), 6000);
    } finally {
      setUpdating(false);
    }
  };

  const downloadContract = async (contractId: string) => {
    // Try to generate PDF client-side using available contract + agency data
    const contract = contracts.find((c) => c._id === contractId);
    try {
      if (!contract) throw new Error('Contrat introuvable');

      // Attempt to fetch agency details: first try by contract.agencyId, then fallback to active agency
      let agency: any = null;
      const agencyId = (contract as any).agencyId || (contract as any).agenceId || (contract as any).agence?._id;
      if (agencyId) {
        try {
          const res = await getAgencyById(String(agencyId));
          agency = res.data;
        } catch (e) {
          console.warn('Unable to fetch agency by id, will try active agency', e);
        }
      }
      // Fallback: fetch active agency if not found by ID
      if (!agency) {
        try {
          const res = await getActiveAgencies({ limit: 1 });
          if (res && (res as any).data && (res as any).data.length) {
            agency = (res as any).data[0];
          }
        } catch (e) {
          console.warn('Unable to fetch active agency', e);
        }
      }

      // Resolve logo URL candidates
      const logoCandidates = [agency?.logo, (contract as any).agenceLogo, (contract as any).logo, (contract as any).agencyLogo, (contract as any).agenceLogoPath];
      const logoCandidate = logoCandidates.find(Boolean);
      const agencyLogoUrl = resolveUrl(logoCandidate);

      // Generate PDF client-side
      const doc = await generateContractPdf(contract, { agency: agency || undefined, agencyLogoUrl });
      try {
        doc.save(`contrat-${contractId}.pdf`);
        return;
      } catch (e) {
        console.warn('Client PDF save failed, will fallback to server download', e);
      }
    } catch (err) {
      console.warn('Client-side PDF generation failed, falling back to server download', err);
    }

    // Fallback: download server-generated PDF
    try {
      const response = await downloadContractPDF(contractId);
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `contrat-${contractId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
      console.log('Téléchargement du contrat (server):', contractId);
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
    }
  };

  const getStatusBadge = (statut: string) => {
    switch (statut) {
      case 'Approved':
        return <Badge className="bg-green-600 text-white dark:bg-green-500 dark:text-white">✓ Approuvé</Badge>;
      case 'Rejected':
        return <Badge variant="destructive" className="dark:bg-red-900 dark:text-red-100">✗ Rejeté</Badge>;
      default:
        return <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">⏳ En attente</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin">
              <Clock className="h-8 w-8 text-slate-600 dark:text-slate-400" />
            </div>
            <p className="mt-4 text-lg font-medium text-slate-900 dark:text-white">Chargement des contrats...</p>
            <p className="mt-2 text-base text-slate-600 dark:text-slate-400">Veuillez patienter</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black p-4 md:p-8">
      {/* Header Section */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-white dark:bg-black rounded-lg">
                <FileText className="h-6 w-6 text-slate-600 dark:text-slate-400" />
              </div>
              <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
                Gestion des Contrats
              </h1>
            </div>
            <p className="text-slate-600 dark:text-slate-400 ml-11">
              Administrez et suivez tous les contrats en cours
            </p>
          </div>
          <div className="bg-white dark:bg-black rounded-lg p-4 border border-slate-200 dark:border-slate-800 w-full md:w-auto">
            <p className="text-base text-slate-600 dark:text-slate-400 mb-1">Total des contrats</p>
            <p className="text-3xl font-bold text-slate-900 dark:text-white">{contracts.length}</p>
          </div>
        </div>

        {statusMessage.type === 'success' && (
          <Alert className="border border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800">
            <AlertCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="ml-2 text-green-800 dark:text-green-300">
              {statusMessage.text}
            </AlertDescription>
          </Alert>
        )}
        {statusMessage.type === 'info' && (
          <Alert className="border border-slate-200 bg-white dark:bg-black dark:border-slate-800">
            <AlertCircle className="h-4 w-4 text-slate-600" />
            <AlertDescription className="ml-2 text-slate-800 dark:text-slate-300">
              {statusMessage.text}
            </AlertDescription>
          </Alert>
        )}
        {error && (
          <Alert variant="destructive" className="dark:border-red-800 dark:bg-red-950/20">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="ml-2">
              {error}
            </AlertDescription>
          </Alert>
        )}
      </div>

      {contracts.length === 0 ? (
        <Card className="border-dashed border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-black">
          <CardContent className="p-12 text-center">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-white dark:bg-black mb-4">
              <Calendar className="h-8 w-8 text-slate-600 dark:text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Aucun contrat à gérer
            </h3>
            <p className="text-slate-600 dark:text-slate-400 max-w-xs mx-auto">
              Il n'y a pas de contrats en attente. Les nouveaux contrats apparaîtront ici.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {contracts.map((contract) => (
            <Card key={contract._id} className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-black shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group">
              {/* Status Bar */}
              <div className={`h-1.5 ${
                contract.statut === 'Approved' ? 'bg-gradient-to-r from-green-500 to-green-600' :
                contract.statut === 'Rejected' ? 'bg-gradient-to-r from-red-500 to-red-600' :
                'bg-gradient-to-r from-amber-500 to-amber-600'
              }`} />
              
              <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="h-10 w-10 rounded-lg bg-white dark:bg-black flex items-center justify-center flex-shrink-0">
                      <FileText className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg font-bold text-slate-900 dark:text-white truncate">
                        {contract.vehicleId
                          ? `${contract.vehicleId.marque} ${contract.vehicleId.modele}`
                          : 'Véhicule à définir'
                        }
                      </CardTitle>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        {contract.vehicleId
                          ? contract.vehicleId.immatriculation
                          : 'Sera défini lors de la réservation'
                        }
                      </p>
                    </div>
                  </div>
                  {getStatusBadge(contract.statut)}
                </div>
              </CardHeader>

              <CardContent className="pt-4">
                {/* Client Info Section */}
                <div className="mb-4 p-4 bg-white dark:bg-black rounded-lg border border-slate-200 dark:border-slate-800">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex items-start gap-3">
                      <User className="h-4 w-4 text-slate-600 dark:text-slate-400 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase">Client</p>
                        <p className="font-medium text-slate-900 dark:text-white text-base">{contract.userId.nom} {contract.userId.prenom}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Mail className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase">Email</p>
                        <p className="text-base text-blue-600 dark:text-blue-400 truncate">{contract.userId.email}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Key Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                  {/* Period */}
                  <div className="p-3 bg-white dark:bg-black rounded-lg border border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-300">PÉRIODE</p>
                    </div>
                    <p className="text-base font-medium text-slate-900 dark:text-white">
                      {new Date(contract.dateDebut).toLocaleDateString('fr-FR')}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      à {new Date(contract.dateFin).toLocaleDateString('fr-FR')}
                    </p>
                  </div>

                  {/* Amount */}
                  <div className="p-3 bg-white dark:bg-black rounded-lg">
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-300 mb-1 flex items-center gap-1">
                      <DollarSign className="h-3 w-3" /> MONTANT
                    </p>
                    <p className="text-base font-bold text-blue-600 dark:text-blue-400">
                      {contract.montantTotal} €
                    </p>
                    <p className="text-sm text-blue-600 dark:text-blue-400">
                      Acompte: {contract.acompteVerse} €
                    </p>
                  </div>

                  {/* Balance */}
                  <div className="p-3 bg-white dark:bg-black rounded-lg border border-slate-200 dark:border-slate-800">
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-300 mb-1">RESTE À PAYER</p>
                    <p className="text-base font-bold text-blue-600 dark:text-blue-400">
                      {contract.montantTotal - contract.acompteVerse} €
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {(((contract.montantTotal - contract.acompteVerse) / contract.montantTotal) * 100).toFixed(1)}% du total
                    </p>
                  </div>
                </div>

                {/* Special Conditions */}
                {contract.conditionsSpeciales && (
                  <div className="mb-4 p-3 bg-white dark:bg-black rounded-lg border border-slate-200 dark:border-slate-800">
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-300 mb-1">⚡ CONDITIONS SPÉCIALES</p>
                    <p className="text-base text-slate-900 dark:text-slate-200">{contract.conditionsSpeciales}</p>
                  </div>
                )}

                {/* Comments */}
                {contract.commentaires && (
                  <div className="mb-4 p-3 bg-white dark:bg-black rounded-lg border border-slate-200 dark:border-slate-800">
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-300 mb-1">💬 COMMENTAIRES</p>
                    <p className="text-base text-slate-900 dark:text-slate-200">{contract.commentaires}</p>
                  </div>
                )}

                {/* Approval Info */}
                {contract.statut === 'Approved' && contract.dateValidation && (
                  <div className="mb-4 p-3 bg-white dark:bg-black rounded-lg border border-slate-200 dark:border-slate-800 flex items-start gap-3">
                    <CheckCircle className="h-4 w-4 text-slate-600 dark:text-slate-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-slate-900 dark:text-slate-200 text-base">Contrat approuvé</p>
                      <p className="text-sm text-slate-700 dark:text-slate-400">
                        {new Date(contract.dateValidation).toLocaleDateString('fr-FR')}
                        {contract.validePar && ` • Approuvé par ${contract.validePar.prenom} ${contract.validePar.nom}`}
                      </p>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-transparent dark:hover:bg-transparent"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-48 bg-white dark:bg-black border border-slate-200 dark:border-slate-800">
                      {contract.statut !== 'Approved' && (
                        <DropdownMenuItem asChild>
                          <button
                            className="w-full cursor-pointer dark:text-slate-100 dark:hover:bg-transparent"
                            onClick={() => {
                              setSelectedContract(contract);
                              setCommentaires(contract.commentaires || '');
                              setPendingIntent('approve');
                              setDialogOpen(true);
                            }}
                          >
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Valider
                          </button>
                        </DropdownMenuItem>
                      )}
                      {contract.statut !== 'Rejected' && (
                        <DropdownMenuItem asChild>
                          <button
                            className="w-full cursor-pointer dark:text-slate-100 dark:hover:bg-transparent"
                            onClick={() => {
                              setSelectedContract(contract);
                              setCommentaires(contract.commentaires || '');
                              setPendingIntent('reject');
                              setDialogOpen(true);
                            }}
                          >
                            <XCircle className="mr-2 h-4 w-4" />
                            Rejeter
                          </button>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem asChild>
                        <button
                          className="w-full cursor-pointer dark:text-slate-100 dark:hover:bg-transparent"
                          onClick={() => {
                            setSelectedContract(contract);
                            setModifyMontant(String(contract.montantTotal || ''));
                            setModifyAcompte(String(contract.acompteVerse || ''));
                            setModifyConditions(contract.conditionsSpeciales || '');
                            setPendingIntent('modify');
                            setDialogOpen(true);
                          }}
                        >
                          ✏️ Modifier
                        </button>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <button
                          className="w-full cursor-pointer dark:text-red-400 dark:hover:bg-red-950/30"
                          onClick={() => {
                            setSelectedContract(contract);
                            setPendingIntent('delete');
                            setDialogOpen(true);
                          }}
                        >
                          🗑️ Supprimer
                        </button>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {contract.statut === 'Approved' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => downloadContract(contract._id)}
                      className="text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-transparent dark:hover:bg-transparent"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      PDF
                    </Button>
                  )}
                </div>
              </CardContent>

              {/* Dialog */}
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-black dark:border-slate-800 border border-slate-200">
                  <DialogHeader>
                    <DialogTitle className="text-xl dark:text-white">
                      {pendingIntent === 'approve'
                        ? '✅ Valider le contrat'
                        : pendingIntent === 'reject'
                        ? '❌ Rejeter le contrat'
                        : pendingIntent === 'modify'
                        ? '✏️ Modifier le contrat'
                        : pendingIntent === 'delete'
                        ? '🗑️ Supprimer le contrat'
                        : 'Détails du contrat'}
                    </DialogTitle>
                  </DialogHeader>
                  {selectedContract && (
                    <div className="space-y-4">
                      {/* Info Grid */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-white dark:bg-black rounded-lg border border-slate-200 dark:border-slate-800">
                          <Label className="font-semibold text-slate-900 dark:text-white text-base">Entreprise</Label>
                          <p className="text-base text-slate-900 dark:text-slate-100 mt-1">{selectedContract.userId.nom} {selectedContract.userId.prenom}</p>
                          <p className="text-sm text-blue-600 dark:text-blue-400">{selectedContract.userId.email}</p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">{selectedContract.userId.telephone}</p>
                        </div>
                        <div className="p-3 bg-white dark:bg-black rounded-lg border border-slate-200 dark:border-slate-800">
                          <Label className="font-semibold text-slate-900 dark:text-white text-base">Véhicule</Label>
                          {selectedContract.vehicleId ? (
                            <>
                              <p className="text-base text-slate-900 dark:text-slate-100 mt-1">{selectedContract.vehicleId.marque} {selectedContract.vehicleId.modele}</p>
                              <p className="text-sm text-slate-600 dark:text-slate-400">{selectedContract.vehicleId.immatriculation}</p>
                            </>
                          ) : (
                            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Véhicule à définir lors de la réservation</p>
                          )}
                        </div>
                      </div>

                      <div className="p-3 bg-white dark:bg-black rounded-lg dark:border dark:border-slate-800">
                        <Label className="font-semibold text-slate-900 dark:text-white text-base">Période</Label>
                        <p className="text-base text-slate-900 dark:text-slate-100 mt-1">
                          {new Date(selectedContract.dateDebut).toLocaleDateString('fr-FR')} - {new Date(selectedContract.dateFin).toLocaleDateString('fr-FR')}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-white dark:bg-black rounded-lg">
                          <Label className="font-semibold text-slate-900 dark:text-slate-300 text-base">Montant total</Label>
                          <p className="text-lg font-bold text-blue-600 dark:text-blue-400 mt-1">{selectedContract.montantTotal} €</p>
                        </div>
                        <div className="p-3 bg-white dark:bg-black rounded-lg">
                          <Label className="font-semibold text-slate-900 dark:text-slate-300 text-base">Acompte versé</Label>
                          <p className="text-lg font-bold text-blue-600 dark:text-blue-400 mt-1">{selectedContract.acompteVerse} €</p>
                        </div>
                      </div>

                      {selectedContract.conditionsSpeciales && (
                        <div className="p-3 bg-white dark:bg-black rounded-lg border border-slate-200 dark:border-slate-800">
                          <Label className="font-semibold text-slate-900 dark:text-slate-300 text-base">Conditions spéciales</Label>
                          <p className="text-base text-slate-900 dark:text-slate-200 mt-1">{selectedContract.conditionsSpeciales}</p>
                        </div>
                      )}

                      {/* Form Content */}
                      {pendingIntent === 'modify' ? (
                        <div className="space-y-4 border-t border-slate-200 dark:border-slate-700 pt-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label className="font-semibold text-base">Montant total</Label>
                              <Input 
                                value={modifyMontant} 
                                onChange={(e) => setModifyMontant(e.target.value)} 
                                type="number"
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label className="font-semibold text-base">Acompte versé</Label>
                              <Input 
                                value={modifyAcompte} 
                                onChange={(e) => setModifyAcompte(e.target.value)} 
                                type="number"
                                className="mt-1"
                              />
                            </div>
                          </div>
                          <div>
                            <Label className="font-semibold text-base">Conditions spéciales</Label>
                            <Textarea 
                              value={modifyConditions} 
                              onChange={(e) => setModifyConditions(e.target.value)} 
                              rows={3}
                              className="mt-1"
                            />
                          </div>
                          <div className="flex gap-2 pt-2">
                            <Button 
                              variant="outline" 
                              onClick={() => { setDialogOpen(false); setPendingIntent(null); }} 
                              disabled={updating}
                              className="dark:border-slate-800 dark:text-slate-300 dark:hover:bg-neutral-800"
                            >
                              Annuler
                            </Button>
                            <Button 
                              onClick={handleModifyContract} 
                              className="flex-1 bg-black hover:bg-neutral-800 text-white dark:bg-black dark:hover:bg-neutral-700" 
                              disabled={updating}
                            >
                              {updating ? 'Enregistrement...' : 'Enregistrer'}
                            </Button>
                          </div>
                        </div>
                      ) : pendingIntent === 'delete' ? (
                        <div className="space-y-4 border-t border-slate-200 dark:border-slate-700 pt-4">
                          <p className="text-base text-slate-700 dark:text-slate-300">Voulez-vous vraiment supprimer ce contrat ? Cette action est irréversible.</p>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              onClick={() => { setDialogOpen(false); setPendingIntent(null); }} 
                              disabled={updating}
                              className="dark:border-slate-800 dark:text-slate-300 dark:hover:bg-neutral-800"
                            >
                              Annuler
                            </Button>
                            <Button 
                              onClick={() => handleDeleteContract(selectedContract._id)} 
                              className="flex-1 bg-red-600 hover:bg-red-700 text-white dark:bg-red-700 dark:hover:bg-red-800" 
                              disabled={updating}
                            >
                              {updating ? 'Suppression...' : 'Supprimer'}
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4 border-t border-slate-200 dark:border-slate-700 pt-4">
                          <div>
                            <Label htmlFor="commentaires" className="font-semibold text-base">Commentaires (optionnel)</Label>
                            <Textarea
                              id="commentaires"
                              placeholder="Ajouter vos commentaires..."
                              value={commentaires}
                              onChange={(e) => setCommentaires(e.target.value)}
                              rows={3}
                              className="mt-1"
                            />
                          </div>

                          <div className="flex gap-2">
                            <Button
                              onClick={() => updateContractStatus(selectedContract._id, 'Rejected')}
                              className="flex-1 bg-red-600 hover:bg-red-700 text-white dark:bg-red-700 dark:hover:bg-red-800"
                              disabled={updating}
                            >
                              <XCircle className="mr-2 h-4 w-4" />
                              {updating ? 'Rejet...' : 'Rejeter'}
                            </Button>
                            <Button
                              onClick={() => updateContractStatus(selectedContract._id, 'Approved')}
                              className="flex-1 bg-green-600 hover:bg-green-700 text-white dark:bg-green-500 dark:hover:bg-green-600"
                              disabled={updating}
                            >
                              <CheckCircle className="mr-2 h-4 w-4" />
                              {updating ? 'Approbation...' : 'Approuver'}
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}