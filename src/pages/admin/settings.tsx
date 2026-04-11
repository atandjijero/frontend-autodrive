import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { Loader2, Mail } from "lucide-react";
import { getUsers, updateUserRole, inviteTester } from "@/api/apiClient";
import type { AdminUser } from "@/api/apiClient";
import { useAuth } from "@/hooks/useAuth";

export default function AdminSettings() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Pour l'invitation
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteLoading, setInviteLoading] = useState(false);

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

  const handleRoleChange = async (userId: number, newRole: string) => {
    setActionLoading(userId);
    setError(null);
    try {
      await updateUserRole(userId, newRole);
      setUsers(prev => prev.map(u => (u.id === userId ? { ...u, role: newRole as any } : u)));
      toast.success("Rôle mis à jour avec succès.");
    } catch (err: any) {
      const message = err?.response?.data?.message || "Impossible de mettre à jour le rôle.";
      setError(message);
      toast.error(message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleInviteTester = async () => {
    if (!inviteEmail) {
      toast.error("Veuillez entrer un email.");
      return;
    }
    setInviteLoading(true);
    try {
      await inviteTester(inviteEmail);
      toast.success("Invitation envoyée avec succès.");
      setInviteEmail("");
    } catch (err: any) {
      const message = err?.response?.data?.message || "Impossible d'envoyer l'invitation.";
      toast.error(message);
    } finally {
      setInviteLoading(false);
    }
  };

  return (
    <div className="p-6 container mx-auto max-w-7xl space-y-6">
      {/* Section Attribution des permissions - Masquée pour les testeurs */}
      {currentUser?.role !== 'testeur' && (
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Attribution des permissions</CardTitle>
            <CardDescription>
              Modifiez les rôles des utilisateurs pour gérer leurs permissions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive-foreground mb-4">
                {error}
              </div>
            )}

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
                    <TableHead className="align-middle min-w-[120px]">Rôle actuel</TableHead>
                    <TableHead className="align-middle min-w-[150px]">Changer rôle</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map(user => (
                    <TableRow key={user.id} className="align-middle">
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
                      <TableCell className="align-middle min-w-[150px]">
                        <Select
                          value={user.role}
                          onValueChange={(value) => handleRoleChange(user.id, value)}
                          disabled={actionLoading === user.id}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="client">Client</SelectItem>
                            <SelectItem value="entreprise">Entreprise</SelectItem>
                            <SelectItem value="tourist">Touriste</SelectItem>
                            <SelectItem value="testeur">Testeur</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}

      {/* Section Invitation testeur - Masquée pour les testeurs */}
      {currentUser?.role !== 'testeur' && (
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Inviter un testeur</CardTitle>
            <CardDescription>
              Envoyez une invitation à un utilisateur pour qu'il s'inscrive en tant que testeur.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <Label htmlFor="invite-email">Email du testeur</Label>
                <Input
                  id="invite-email"
                  type="email"
                  placeholder="testeur@example.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                />
              </div>
              <Button
                onClick={handleInviteTester}
                disabled={inviteLoading}
                className="flex items-center gap-2"
              >
                {inviteLoading ? (
                  <Loader2 className="animate-spin h-4 w-4" />
                ) : (
                  <Mail className="h-4 w-4" />
                )}
                {inviteLoading ? "Envoi..." : "Envoyer invitation"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Message pour les testeurs */}
      {currentUser?.role === 'testeur' && (
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Permissions limitées</CardTitle>
            <CardDescription>
              En tant que testeur, vous avez accès en lecture seule aux fonctionnalités administratives.
              Les actions de modification des rôles, d'invitation et de blocage ne sont pas autorisées.
            </CardDescription>
          </CardHeader>
        </Card>
      )}
    </div>
  );
}