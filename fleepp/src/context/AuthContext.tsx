import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '@/types';
import { findUser } from '@/data/users';

const STORAGE_KEY = 'fleepp.session.userId';

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  login: (username: string, password: string) => { ok: boolean; error?: string };
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const savedId = await AsyncStorage.getItem(STORAGE_KEY);
        if (savedId) {
          const { users } = await import('@/data/users');
          const found = users.find((u) => u.id === savedId);
          if (found) setUser(found);
        }
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const login = (username: string, password: string) => {
    const found = findUser(username, password);
    if (!found) {
      return { ok: false, error: 'Номи корбар ё рамз нодуруст аст.' };
    }
    setUser(found);
    AsyncStorage.setItem(STORAGE_KEY, found.id).catch(() => {});
    return { ok: true };
  };

  const logout = () => {
    setUser(null);
    AsyncStorage.removeItem(STORAGE_KEY).catch(() => {});
  };

  const value = useMemo(() => ({ user, isLoading, login, logout }), [user, isLoading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth бояд дар дохили AuthProvider истифода шавад.');
  return ctx;
}
