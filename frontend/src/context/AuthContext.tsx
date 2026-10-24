import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (email: string, pass: string, displayName?: string) => Promise<void>;
  logout: () => void;
  loginAsDemoUser: () => Promise<void>;
  updateUserContext: (user: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(api.getToken());
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const handleExpired = () => {
      api.setToken(null);
      localStorage.removeItem('finpath_user');
      setUser(null);
      setToken(null);
    };

    window.addEventListener('finpath_auth_expired', handleExpired);

    const checkAuth = async () => {
      const storedToken = api.getToken();
      const storedUser = localStorage.getItem('finpath_user');
      if (storedToken && storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          setUser(parsed);
          setToken(storedToken);

          // Verify session validity with backend
          try {
            const profile = await api.getProfile();
            if (profile && profile.displayName) {
              const updated = { ...parsed, displayName: profile.displayName };
              setUser(updated);
              localStorage.setItem('finpath_user', JSON.stringify(updated));
            }
          } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : '';
            if (msg.includes('401') || msg.includes('Unauthorized') || msg.includes('status 401')) {
              api.setToken(null);
              localStorage.removeItem('finpath_user');
              setUser(null);
              setToken(null);
            }
          }
        } catch {
          api.setToken(null);
          localStorage.removeItem('finpath_user');
          setUser(null);
          setToken(null);
        }
      } else {
        api.setToken(null);
        localStorage.removeItem('finpath_user');
        setUser(null);
        setToken(null);
      }
      setLoading(false);
    };

    checkAuth();
    return () => window.removeEventListener('finpath_auth_expired', handleExpired);
  }, []);

  const login = async (email: string, pass: string) => {
    const res = await api.login({ email, password: pass });
    api.setToken(res.token);
    setToken(res.token);
    setUser(res.user);
    localStorage.setItem('finpath_user', JSON.stringify(res.user));
  };

  const register = async (email: string, pass: string, displayName?: string) => {
    const res = await api.register({ email, password: pass, displayName });
    api.setToken(res.token);
    setToken(res.token);
    setUser(res.user);
    localStorage.setItem('finpath_user', JSON.stringify(res.user));
  };

  const logout = () => {
    api.setToken(null);
    localStorage.removeItem('finpath_user');
    setToken(null);
    setUser(null);
  };

  const loginAsDemoUser = async () => {
    try {
      const res = await api.demoLogin();
      api.setToken(res.token);
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem('finpath_user', JSON.stringify(res.user));
    } catch (e) {
      console.warn('Backend demoLogin failed, falling back to credentials:', e);
      await login('alex.chen@finpath.demo', 'password123');
    }
  };

  const updateUserContext = (updated: Partial<User>) => {
    if (user) {
      const merged = { ...user, ...updated };
      setUser(merged);
      localStorage.setItem('finpath_user', JSON.stringify(merged));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        loading,
        login,
        register,
        logout,
        loginAsDemoUser,
        updateUserContext,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
