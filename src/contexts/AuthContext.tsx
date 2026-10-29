'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface UserProfile {
  id: string;
  email: string | null;
  displayName: string | null;
  phone?: string | null;
  role?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  isVerified: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  verifyUser: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false,
  isVerified: false,
  signInWithGoogle: async () => {},
  signOut: async () => {},
  verifyUser: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

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

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      // In standalone school directory, provide smooth instant guest/verified user or Google OAuth
      const demoUser: UserProfile = {
        id: 'usr_' + Math.random().toString(36).substring(2, 9),
        email: 'educator@school.cseel.org',
        displayName: 'School Administrator',
      };
      setUser(demoUser);
      setIsVerified(true);
      localStorage.setItem('cseel_school_user', JSON.stringify(demoUser));
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setUser(null);
    setIsVerified(false);
    localStorage.removeItem('cseel_school_user');
  };

  const verifyUser = () => {
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
