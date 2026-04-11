import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";
import { Loader2, Lock, Unlock, Trash2, AlertTriangle } from "lucide-react";
import { getUsers, blockUser, unblockUser, deleteUser } from "@/api/apiClient";
import type { AdminUser } from "@/api/apiClient";
import { useAuth } from "@/hooks/useAuth";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function UsersListe() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<AdminUser | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { user: currentUser } = useAuth();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getUsers();
      setUsers(res.data);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Impossible de charger les utilisateurs.");
    } finally {
      setLoading(false);
    }
  };

  const toggleBlock = async (user: AdminUser) => {
    setActionLoading(user.id);
    setError(null);
    try {
      const res = user.blocked ? await unblockUser(user.id) : await blockUser(user.id);
      setUsers(prev => prev.map(u => (u.id === res.data.id ? res.data : u)));
      toast.success(user.blocked ? "Utilisateur débloqué." : "Utilisateur bloqué.");
    } catch (err: any) {
      const message = err?.response?.data?.message || "Impossible de mettre à jour l'utilisateur.";
      setError(message);
      toast.error(message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    setActionLoading(userToDelete.id);
    setError(null);
    try {
      await deleteUser(userToDelete.id);
      setUsers(prev => prev.filter(u => u.id !== userToDelete.id));
      toast.success("Utilisateur supprimé avec succès.");
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    } catch (err: any) {
      const message = err?.response?.data?.message || "Impossible de supprimer l'utilisateur.";
      setError(message);
      toast.error(message);
    } finally {
      setActionLoading(null);
    }
  };

  const openDeleteDialog = (user: AdminUser) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  return (
    <div className="p-6 container mx-auto max-w-7xl">
      <Card className="shadow-sm">
        <CardHeader>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <CardTitle>Utilisateurs</CardTitle>
              <CardDescription>
                Liste complète des utilisateurs et actions de blocage/déblocage.
              </CardDescription>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <Badge variant="secondary">{users.length} utilisateurs</Badge>
              <Badge variant="outline">Mode admin</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive-foreground mb-4">
              {error}
            </div>
          ) : null}

          {loading ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="animate-spin h-4 w-4" /> Chargement des utilisateurs...
            </div>
          ) : users.length === 0 ? (
            <div className="rounded-xl border border-dashed border-muted p-8 text-center text-sm text-muted-foreground">
              Aucun utilisateur trouvé.
            </div>
          ) : (
            <Table className="min-w-full border border-slate-200 bg-background">
              <TableHeader className="bg-muted">
                <TableRow className="align-middle">
                  <TableHead className="align-middle w-[80px]">Photo</TableHead>
                  <TableHead className="align-middle min-w-[200px]">Nom</TableHead>
                  <TableHead className="align-middle min-w-[250px]">Email</TableHead>
                  <TableHead className="align-middle min-w-[120px]">Rôle</TableHead>
                  <TableHead className="align-middle min-w-[100px]">Vérifié</TableHead>
                  <TableHead className="align-middle min-w-[100px]">Statut</TableHead>
                  <TableHead className="align-middle text-right w-[160px]">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map(user => (
                  <TableRow key={user.id} className={user.blocked ? "align-middle bg-destructive/5" : "align-middle"}>
                    <TableCell className="align-middle w-[80px]">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.photo} alt={`${user.prenom} ${user.nom}`} />
                        <AvatarFallback>
                          {user.prenom.charAt(0)}{user.nom.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell className="align-middle min-w-[200px] font-medium">
                      {user.prenom} {user.nom}
                    </TableCell>
                    <TableCell className="align-middle min-w-[250px]">{user.email}</TableCell>
                    <TableCell className="align-middle min-w-[120px]">
                      <Badge variant="outline" className="capitalize">
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="align-middle min-w-[100px]">
                      {user.isVerified ? (
                        <Badge variant="secondary">Oui</Badge>
                      ) : (
                        <Badge variant="outline">Non</Badge>
                      )}
                    </TableCell>
                    <TableCell className="align-middle min-w-[100px]">
                      {user.blocked ? (
                        <Badge variant="destructive">Bloqué</Badge>
                      ) : (
                        <Badge variant="outline">Actif</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {currentUser?.role === 'testeur' ? (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={true}
                              className="transition-all duration-200 opacity-50 cursor-not-allowed"
                            >
                              <Lock className="h-4 w-4 text-gray-400" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            Action non autorisée pour les testeurs
                          </TooltipContent>
                        </Tooltip>
                      ) : (
                        <div className="flex gap-2 justify-end">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                size="sm"
                                variant={user.role === "admin" ? "outline" : user.blocked ? "secondary" : "destructive"}
                                disabled={actionLoading === user.id || user.role === "admin"}
                                onClick={() => toggleBlock(user)}
                                className="transition-all duration-200 hover:scale-105"
                              >
                                {actionLoading === user.id ? (
                                  <span className="inline-flex items-center gap-2">
                                    <Loader2 className="animate-spin h-4 w-4" />
                                    {user.blocked ? "Déblocage..." : "Blocage..."}
                                  </span>
                                ) : user.blocked ? (
                                  <span className="inline-flex items-center gap-2">
                                    <Unlock className="h-4 w-4" />
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-2">
                                    <Lock className="h-4 w-4" />
                                  </span>
                                )}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              {user.role === "admin"
                                ? "Impossible de bloquer un administrateur"
                                : user.blocked
                                ? "Débloquer l'utilisateur"
                                : "Bloquer l'utilisateur"}
                            </TooltipContent>
                          </Tooltip>

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="destructive"
                                disabled={actionLoading === user.id || user.role === "admin"}
                                onClick={() => openDeleteDialog(user)}
                                className="transition-all duration-200 hover:scale-105"
                              >
                                {actionLoading === user.id ? (
                                  <Loader2 className="animate-spin h-4 w-4" />
                                ) : (
                                  <Trash2 className="h-4 w-4" />
                                )}
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle className="flex items-center gap-2">
                                  <AlertTriangle className="h-5 w-5 text-destructive" />
                                  Confirmer la suppression
                                </AlertDialogTitle>
                                <AlertDialogDescription className="space-y-3">
                                  <p>
                                    Vous êtes sur le point de supprimer le compte de{" "}
                                    <span className="font-semibold text-foreground">
                                      {userToDelete?.prenom} {userToDelete?.nom}
                                    </span>
                                    .
                                  </p>
                                  <div className="bg-muted p-3 rounded-md">
                                    <p className="text-sm font-medium mb-2">Cette action entraînera :</p>
                                    <ul className="text-sm space-y-1 text-muted-foreground">
                                      <li>• La suppression définitive de toutes les données utilisateur</li>
                                      <li>• L'annulation de toutes les réservations actives</li>
                                      <li>• La perte permanente de l'accès au système</li>
                                    </ul>
                                  </div>
                                  <p className="text-sm text-muted-foreground">
                                    Cette action ne peut pas être annulée.
                                  </p>
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel onClick={() => setUserToDelete(null)}>
                                  Annuler
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={handleDeleteUser}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  disabled={actionLoading === userToDelete?.id}
                                >
                                  {actionLoading === userToDelete?.id ? (
                                    <>
                                      <Loader2 className="animate-spin h-4 w-4 mr-2" />
                                      Suppression...
                                    </>
                                  ) : (
                                    "Supprimer définitivement"
                                  )}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
