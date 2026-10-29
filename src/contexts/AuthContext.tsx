'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface UserProfile {
  id: string;
  email: string | null;
  displayName: string | null;
  phone?: string | null;
  role?: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
    [key: string]: any;
  };
}

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  isVerified: boolean;
  signInWithGoogle: (redirectUrl?: string) => Promise<{ error?: any }>;
  signOut: () => Promise<void>;
  verifyUser: (arg?: any) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false,
  isVerified: false,
  signInWithGoogle: async () => ({ error: null }),
  signOut: async () => {},
  verifyUser: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('cseel_school_user');
      if (stored) {
        const parsed = JSON.parse(stored);
        setUser(parsed);
        setIsVerified(true);
      }
    } catch {}
  }, []);

  const signInWithGoogle = async (redirectUrl?: string) => {
    setLoading(true);
    try {
      const demoUser: UserProfile = {
        id: 'usr_' + Math.random().toString(36).substring(2, 9),
        email: 'educator@school.cseel.org',
        displayName: 'School Administrator',
        user_metadata: {
          full_name: 'School Administrator',
        },
      };
      setUser(demoUser);
      setIsVerified(true);
      localStorage.setItem('cseel_school_user', JSON.stringify(demoUser));
      return { error: null };
    } catch (err: any) {
      return { error: err };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setUser(null);
    setIsVerified(false);
    localStorage.removeItem('cseel_school_user');
  };

  const verifyUser = (arg?: any) => {
    setIsVerified(true);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isVerified,
        signInWithGoogle,
        signOut,
        verifyUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
