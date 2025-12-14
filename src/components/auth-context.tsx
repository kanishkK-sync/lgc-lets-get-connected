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

// Mock a logged-in user. In a real app, this would come from Firebase Auth.
const MOCK_USER = coreMembers[2]; // Kanishk K

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(true);

  useEffect(() => {
    // Simulate checking for an existing session
    setTimeout(() => {
      // To test the logged-out state, you can comment out the next line
      // setUser(MOCK_USER);
      setIsAuthenticating(false);
    }, 500);
  }, []);

  const login = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setUser(MOCK_USER);
      setLoading(false);
      window.location.href = '/dashboard';
    }, 1000);
  };

  const logout = () => {
    setUser(null);
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, isAuthenticating }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
