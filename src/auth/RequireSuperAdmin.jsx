import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';

export function RequireSuperAdmin() {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (!user || user.role !== 'superadmin') return <Navigate to="/login" replace />;

  return <Outlet />;
}
