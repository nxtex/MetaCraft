import { Navigate, useLocation } from 'react-router';
import { useAuth } from '../context/AuthContext';

export function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#080A0F' }}>
        <div className="text-center">
          <div
            className="w-10 h-10 border-2 border-t-transparent rounded-full animate-spin mx-auto mb-4"
            style={{ borderColor: '#C9A84C', borderTopColor: 'transparent' }}
          />
          <p style={{ fontFamily: 'Cinzel, serif', color: '#C9A84C', fontSize: '14px', letterSpacing: '3px' }}>
            VÉRIFICATION
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
