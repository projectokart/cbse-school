'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

export interface UserProfile {
  id: string;
  email: string | null;
  displayName: string | null;
  phone?: string | null;
  role?: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
    phone?: string;
    [key: string]: any;
  };
}

export interface SchoolClaimRecord {
  id: string;
  schoolId: string;
  schoolName: string;
  claimantName: string;
  claimantEmail: string;
  phone: string;
  designation?: string;
  pincode: string;
  state: string;
  district: string;
  note: string;
  status: 'pending' | 'verified' | 'rejected';
  createdAt: string;
  verifiedAt?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  isVerified: boolean;
  claims: SchoolClaimRecord[];
  activeClaim: SchoolClaimRecord | null;
  hasVerifiedClaim: boolean;
  signInWithGoogle: (redirectUrl?: string) => Promise<{ error?: any }>;
  signInWithEmailOtp: (email: string, name?: string, phone?: string) => Promise<{ success: boolean; user: UserProfile }>;
  signOut: () => Promise<void>;
  verifyUser: (arg?: any) => void;
  submitClaim: (claim: Omit<SchoolClaimRecord, 'id' | 'createdAt' | 'status'>) => Promise<SchoolClaimRecord>;
  verifyClaimByAdmin: (claimId: string) => Promise<void>;
  refreshClaims: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false,
  isVerified: false,
  claims: [],
  activeClaim: null,
  hasVerifiedClaim: false,
  signInWithGoogle: async () => ({ error: null }),
  signInWithEmailOtp: async () => ({ success: false, user: {} as any }),
  signOut: async () => {},
  verifyUser: () => {},
  submitClaim: async () => ({} as any),
  verifyClaimByAdmin: async () => {},
  refreshClaims: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(true);
  const [claims, setClaims] = useState<SchoolClaimRecord[]>([]);

  // Load claims from storage or API
  const refreshClaims = useCallback(async () => {
    try {
      const storedClaims = localStorage.getItem('cseel_user_claims');
      let localList: SchoolClaimRecord[] = storedClaims ? JSON.parse(storedClaims) : [];

      if (user?.email) {
        try {
          const res = await fetch(`/api/school-claim?email=${encodeURIComponent(user.email)}`);
          const json = await res.json();
          if (json.success && Array.isArray(json.claims)) {
            // Merge with local claims
            const map = new Map<string, SchoolClaimRecord>();
            localList.forEach((c) => map.set(c.id, c));
            json.claims.forEach((c: SchoolClaimRecord) => map.set(c.id, c));
            localList = Array.from(map.values());
            localStorage.setItem('cseel_user_claims', JSON.stringify(localList));
          }
        } catch {}
      }
      setClaims(localList);
    } catch (err) {
      console.warn('Failed to load user claims:', err);
    }
  }, [user]);

  // Initial user load
  useEffect(() => {
    try {
      const stored = localStorage.getItem('cseel_school_user');
      if (stored) {
        const parsed = JSON.parse(stored);
        setUser(parsed);
        setIsVerified(true);
      }
      const storedClaims = localStorage.getItem('cseel_user_claims');
      if (storedClaims) {
        setClaims(JSON.parse(storedClaims));
      }
    } catch {}
  }, []);

  // When user changes, refresh claims
  useEffect(() => {
    refreshClaims();
  }, [user, refreshClaims]);

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

  const signInWithEmailOtp = async (email: string, name?: string, phone?: string) => {
    setLoading(true);
    try {
      const newUser: UserProfile = {
        id: 'usr_' + Date.now().toString(36),
        email: email.trim(),
        displayName: name ? name.trim() : email.split('@')[0],
        phone: phone ? phone.trim() : null,
        user_metadata: {
          full_name: name ? name.trim() : email.split('@')[0],
          phone: phone ? phone.trim() : null,
        },
      };
      setUser(newUser);
      setIsVerified(true);
      localStorage.setItem('cseel_school_user', JSON.stringify(newUser));
      return { success: true, user: newUser };
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

  const submitClaim = async (
    claimData: Omit<SchoolClaimRecord, 'id' | 'createdAt' | 'status'>
  ): Promise<SchoolClaimRecord> => {
    let newClaim: SchoolClaimRecord = {
      ...claimData,
      id: 'clm_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 6),
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    try {
      const res = await fetch('/api/school-claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          school_id: claimData.schoolId,
          school_name: claimData.schoolName,
          claimant_name: claimData.claimantName,
          claimant_email: claimData.claimantEmail,
          phone: claimData.phone,
          designation: claimData.designation,
          pincode: claimData.pincode,
          state: claimData.state,
          district: claimData.district,
          note: claimData.note,
        }),
      });
      const data = await res.json();
      if (data.success && data.claim) {
        newClaim = data.claim;
      }
    } catch {}

    const updated = [newClaim, ...claims.filter((c) => c.id !== newClaim.id)];
    setClaims(updated);
    localStorage.setItem('cseel_user_claims', JSON.stringify(updated));
    return newClaim;
  };

  const verifyClaimByAdmin = async (claimId: string) => {
    try {
      await fetch('/api/school-claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verify', claim_id: claimId }),
      });
    } catch {}

    const updated = claims.map((c) =>
      c.id === claimId ? { ...c, status: 'verified' as const, verifiedAt: new Date().toISOString() } : c
    );
    setClaims(updated);
    localStorage.setItem('cseel_user_claims', JSON.stringify(updated));
  };

  // Find most relevant claim
  const activeClaim = claims.length > 0 ? claims[0] : null;
  const hasVerifiedClaim = claims.some((c) => c.status === 'verified');

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isVerified,
        claims,
        activeClaim,
        hasVerifiedClaim,
        signInWithGoogle,
        signInWithEmailOtp,
        signOut,
        verifyUser,
        submitClaim,
        verifyClaimByAdmin,
        refreshClaims,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
