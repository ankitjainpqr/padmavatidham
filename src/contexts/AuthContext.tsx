import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Helper function to validate a session
  const isValidSession = (session: Session | null): boolean => {
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

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      // Explicitly clear user and session when Supabase is not configured
      setSession(null);
      setUser(null);
      setLoading(false);
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      // Clear session on any error
      if (error) {
        console.warn('Error getting session:', error);
        setSession(null);
        setUser(null);
        setLoading(false);
        return;
      }

      // Validate session
      if (!isValidSession(session)) {
        // Clear invalid session from storage
        if (session) {
          supabase.auth.signOut().catch(() => {
            // Ignore errors when clearing invalid session
          });
        }
        setSession(null);
        setUser(null);
      } else {
        setSession(session);
        setUser(session.user ?? null);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      // Validate session on every auth state change
      if (!isValidSession(session)) {
        setSession(null);
        setUser(null);
      } else {
        setSession(session);
        setUser(session.user ?? null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    if (!isSupabaseConfigured()) {
      return { error: { message: 'Supabase is not configured' } };
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    return { error };
  };

  const signOut = async () => {
    if (!isSupabaseConfigured()) {
      return;
    }
    await supabase.auth.signOut();
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};







