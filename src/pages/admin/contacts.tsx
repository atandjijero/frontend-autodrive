import { useEffect, useState } from 'react';
import DashboardLayout from '@/layouts/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { getContacts, respondToContact } from '@/api/apiClient';

export default function AdminContacts() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errors, setErrors] = useState<string | null>(null);
  const [responses, setResponses] = useState<Record<string, string>>({});

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await getContacts();
        setContacts(res.data);
      } catch (e: any) {
        setErrors(e?.response?.data?.message || 'Erreur lors du chargement');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleChange = (id: string, value: string) => {
    setResponses(prev => ({ ...prev, [id]: value }));
  };

  const handleRespond = async (id: string) => {
    const response = responses[id] || '';
    if (!response) return;
    try {
      await respondToContact(id, response);
      // update local list
      setContacts(prev => prev.map(c => (c._id === id ? { ...c, response, status: 'responded' } : c)));
    } catch (e: any) {
      setErrors(e?.response?.data?.message || 'Erreur lors de l envoi de la réponse');
    }
  };

  return (
    <DashboardLayout>
      <main className="p-6 container mx-auto max-w-5xl">
        <h1 className="text-2xl font-semibold mb-4">Messages de contact</h1>
        {loading && <p>Chargement...</p>}
        {errors && <p className="text-red-600">{errors}</p>}
        <div className="space-y-4">
          {contacts.map(contact => (
            <Card key={contact._id} className="shadow">
              <CardHeader>
                <CardTitle>{contact.nom} — {contact.email}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-2">{contact.message}</p>
                <div className="space-y-2">
                  <Textarea
                    placeholder="Réponse"
                    value={responses[contact._id] ?? contact.response ?? ''}
                    onChange={(e) => handleChange(contact._id, e.target.value)}
                  />
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleRespond(contact._id)}
                      disabled={contact.status === 'responded'}
                    >
                      {contact.status === 'responded' ? 'Déjà répondu' : 'Envoyer la réponse'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </DashboardLayout>
  );
}
