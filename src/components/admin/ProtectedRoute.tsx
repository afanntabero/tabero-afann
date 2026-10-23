import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { session, loading: authLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [checkingAdmin, setCheckingAdmin] = useState(true);

  useEffect(() => {
    async function checkAdminStatus() {
      if (!session?.user) {
        setIsAdmin(false);
        setCheckingAdmin(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', session.user.id)
          .single();

        if (error || !data) {
          setIsAdmin(false);
        } else {
          setIsAdmin(data.is_admin === true);
        }
      } catch {
        setIsAdmin(false);
      } finally {
        setCheckingAdmin(false);
      }
    }

    checkAdminStatus();
  }, [session]);

  if (authLoading || checkingAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-neon-purple" />
      </div>
    );
  }

  if (!session || !isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  return <>{children}</>;
}