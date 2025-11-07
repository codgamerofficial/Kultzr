import { useState, useEffect, useContext, createContext, ReactNode } from 'react';
import { 
  User, 
  Session, 
  AuthError, 
  SignUpWithPasswordCredentials,
  SignInWithPasswordCredentials 
} from '@supabase/supabase-js';
import { supabase, Profile } from '../utils/supabase/client';

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  signUp: (credentials: SignUpWithPasswordCredentials, profileData?: Partial<Profile>) => Promise<{ error?: AuthError }>;
  signIn: (credentials: SignInWithPasswordCredentials) => Promise<{ error?: AuthError }>;
  signOut: () => Promise<{ error?: AuthError }>;
  resetPassword: (email: string) => Promise<{ error?: AuthError }>;
  updatePassword: (password: string) => Promise<{ error?: AuthError }>;
  updateProfile: (data: Partial<Profile>) => Promise<{ error?: any }>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        // If profile doesn't exist, create it
        await createProfile(userId);
      } else {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error in fetchProfile:', error);
    } finally {
      setLoading(false);
    }
  };

  const createProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase.rpc('get_or_create_profile');
      
      if (error) {
        console.error('Error creating profile:', error);
      } else if (data) {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error in createProfile:', error);
    }
  };

  const signUp = async (
    credentials: SignUpWithPasswordCredentials, 
    profileData?: Partial<Profile>
  ) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        ...credentials,
        options: {
          data: {
            full_name: profileData?.full_name,
            username: profileData?.username,
            phone: profileData?.phone,
          }
        }
      });

      if (error) return { error };

      if (data.user) {
        // Profile will be created automatically via trigger
        await fetchProfile(data.user.id);
      }

      return {};
    } catch (error) {
      console.error('SignUp error:', error);
      return { error: error as AuthError };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (credentials: SignInWithPasswordCredentials) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword(credentials);

      if (error) return { error };

      if (data.user) {
        await fetchProfile(data.user.id);
      }

      return {};
    } catch (error) {
      console.error('SignIn error:', error);
      return { error: error as AuthError };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      return { error };
    } catch (error) {
      console.error('SignOut error:', error);
      return { error: error as AuthError };
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      return { error };
    } catch (error) {
      console.error('Reset password error:', error);
      return { error: error as AuthError };
    }
  };

  const updatePassword = async (password: string) => {
    try {
      const { error } = await supabase.auth.updateUser({ password });
      return { error };
    } catch (error) {
      console.error('Update password error:', error);
      return { error: error as AuthError };
    }
  };

  const updateProfile = async (data: Partial<Profile>) => {
    try {
      if (!user) {
        return { error: { message: 'No user logged in' } };
      }

      const { data: updatedProfile, error } = await supabase
        .from('profiles')
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq('id', user.id)
        .select()
        .single();

      if (error) return { error };

      setProfile(updatedProfile);
      return { error: null };
    } catch (error) {
      console.error('Update profile error:', error);
      return { error };
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id);
    }
  };

  const value: AuthContextType = {
    user,
    profile,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
    updateProfile,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook for protected routes
export function useRequireAuth() {
  const { user, loading } = useAuth();
  
  useEffect(() => {
    if (!loading && !user) {
      // Redirect to login or show unauthorized message
      window.location.href = '/auth/login';
    }
  }, [user, loading]);

  return { user, loading };
}

// Custom hook for optional auth
export function useOptionalAuth() {
  const { user, profile, loading } = useAuth();
  return { user, profile, loading, isAuthenticated: !!user };
}