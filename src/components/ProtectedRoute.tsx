import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import { isSupabaseConfigured } from '@/lib/supabase';

interface ProtectedRouteProps {
  children: ReactNode;
}

// Helper function to validate a session
const isValidSession = (session: any): boolean => {
  if (!session) return false;
  if (!session.user) return false;
  // Check if session is expired
  if (session.expires_at && typeof session.expires_at === 'number') {
    const expiresAt = session.expires_at * 1000; // Convert to milliseconds
    if (expiresAt < Date.now()) {
      return false;
    }
  }
  // Check if access_token exists and is not empty
  if (!session.access_token || session.access_token.trim() === '') {
    return false;
  }
  return true;
};

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, session, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Deny access if Supabase is not configured
  if (!isSupabaseConfigured()) {
    return <Navigate to="/login" replace />;
  }

  // Deny access if there's no user or no valid session
  if (!user || !session) {
    return <Navigate to="/login" replace />;
  }

  // Validate session - deny access if session is invalid or expired
  if (!isValidSession(session)) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};







