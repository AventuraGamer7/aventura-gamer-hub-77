import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Usuario {
  id: string;
  username: string;
  role: string;
  points: number;
  level: number;
  created_at: string;
}

const GestionUsuarios = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('id, username, role, points, level, created_at')
        .order('created_at', { ascending: false });
      setUsuarios((data as Usuario[]) || []);
      setLoading(false);
    };
    load();
  }, []);

  const filtered = usuarios.filter((u) =>
    u.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" /> Usuarios ({usuarios.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar usuario..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {loading ? (
            <p className="text-muted-foreground text-sm">Cargando…</p>
          ) : filtered.length === 0 ? (
            <p className="text-muted-foreground text-sm">Sin resultados.</p>
          ) : (
            <div className="space-y-2">
              {filtered.map((u) => (
                <div
                  key={u.id}
                  className="flex items-center justify-between p-3 rounded-lg border bg-card"
                >
                  <div>
                    <p className="font-medium">{u.username || 'Sin nombre'}</p>
                    <p className="text-xs text-muted-foreground">
                      Nivel {u.level} · {u.points} pts
                    </p>
                  </div>
                  <Badge variant="secondary">{u.role}</Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GestionUsuarios;
