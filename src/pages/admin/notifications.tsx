import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/layouts/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getNotifications, markNotificationRead } from '@/api/apiClient';

export default function AdminNotifications() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await getNotifications();
        setNotifications(res.data || []);
      } catch (e: any) {
        setError(e?.response?.data?.message || 'Erreur lors du chargement');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleMarkRead = async (id: string) => {
    try {
      const res = await markNotificationRead(id);
      setNotifications(prev => prev.map(n => (n._id === id ? res.data : n)));
    } catch (e: any) {
      console.error('Erreur mark read', e);
    }
  };

  return (
    <DashboardLayout>
      <main className="p-6 container mx-auto max-w-5xl">
        <h1 className="text-2xl font-semibold mb-4">Notifications</h1>
        {loading && <p>Chargement...</p>}
        {error && <p className="text-red-600">{error}</p>}
        <div className="space-y-4">
          {notifications.map((n) => (
            <Card key={n._id} className={`shadow ${n.read ? 'opacity-70' : ''}`}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{n.title}</span>
                  <span className="text-sm text-muted-foreground">{n.createdAt ? new Date(n.createdAt).toLocaleString() : ''}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-2">{n.body}</p>
                <div className="flex gap-2">
                  {!n.read && (
                    <Button onClick={() => handleMarkRead(n._id)}>Marquer lu</Button>
                  )}
                  <Button variant="outline" onClick={() => navigate('/admin/contacts')}>Voir le message</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </DashboardLayout>
  );
}
