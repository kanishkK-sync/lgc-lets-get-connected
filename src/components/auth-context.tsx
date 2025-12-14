"use client";

import type { User } from '@/lib/types';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { coreMembers } from '@/lib/mock-data';

interface AuthContextType {
  user: User | null;
  login: () => void;
  logout: () => void;
  loading: boolean;
  isAuthenticating: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// =================================================================
// MOCK AUTHENTICATION
// This section will be replaced with Firebase Authentication.
// =================================================================
const MOCK_USER = coreMembers[2]; // Kanishk K

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(true);

  useEffect(() => {
    // START: Firebase replacement
    // In a real app, you would use onAuthStateChanged here to check for an
    // existing user session.
    console.log("Checking for mock user session...");
    const storedUser = sessionStorage.getItem('mockUser');
    if (storedUser) {
        setUser(JSON.parse(storedUser));
    }
    setIsAuthenticating(false);
    // END: Firebase replacement
  }, []);

  const login = () => {
    setLoading(true);
    // START: Firebase replacement
    // In a real app, this would trigger the Firebase Google login popup.
    // On success, you'd get the user object and either create a new user
    // document in Firestore or fetch the existing one.
    setTimeout(() => {
      console.log("Simulating login...");
      sessionStorage.setItem('mockUser', JSON.stringify(MOCK_USER));
      setUser(MOCK_USER);
      setLoading(false);
      window.location.href = '/dashboard';
    }, 1000);
    // END: Firebase replacement
  };

  const logout = () => {
    // START: Firebase replacement
    // In a real app, this would call Firebase's signOut() method.
    console.log("Simulating logout...");
    sessionStorage.removeItem('mockUser');
    setUser(null);
    window.location.href = '/';
    // END: Firebase replacement
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, isAuthenticating }}>
      {children}
    </AuthContext.Provider>
  );
}
// =================================================================
// END MOCK AUTHENTICATION
// =================================================================


export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
