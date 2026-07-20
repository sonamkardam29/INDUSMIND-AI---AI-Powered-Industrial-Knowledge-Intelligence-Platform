import React, { createContext, useContext, useState, useEffect } from 'react';
import { IUser, UserRole } from '../types';

interface AuthContextType {
  user: IUser | null;
  token: string | null;
  login: (token: string, user: IUser) => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;
}

const PRESET_ROLE_PROFILES: Record<UserRole, { name: string; email: string; department: string }> = {
  Admin: { name: 'Marcus Sterling', email: 'admin@indusmind.ai', department: 'Executive Architecture' },
  'Maintenance Engineer': { name: 'Alex Vance', email: 'engineer@indusmind.ai', department: 'Maintenance & Reliability' },
  'Plant Operator': { name: 'Elena Rostova', email: 'operator@indusmind.ai', department: 'Plant Operations' },
  'Quality Engineer': { name: 'David Chen', email: 'quality@indusmind.ai', department: 'Quality Control' },
  'Safety Officer': { name: 'Sarah Connor', email: 'safety@indusmind.ai', department: 'EHS & Safety' },
  Auditor: { name: 'Robert Vance', email: 'auditor@indusmind.ai', department: 'Compliance & Audit' },
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(() => {
    const saved = localStorage.getItem('indusmind_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    // Default to Maintenance Engineer for rich demo evaluation
    return {
      id: 'u-engineer-01',
      name: 'Alex Vance',
      email: 'engineer@indusmind.ai',
      role: 'Maintenance Engineer',
      department: 'Maintenance & Reliability',
    };
  });

  const [token, setToken] = useState<string | null>(() => localStorage.getItem('indusmind_token') || 'demo-token');

  useEffect(() => {
    if (user) {
      localStorage.setItem('indusmind_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('indusmind_user');
    }
  }, [user]);

  const login = (newToken: string, newUser: IUser) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('indusmind_token', newToken);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('indusmind_token');
    localStorage.removeItem('indusmind_user');
  };

  const switchRole = (role: UserRole) => {
    const profile = PRESET_ROLE_PROFILES[role];
    const updatedUser: IUser = {
      id: `u-${role.toLowerCase().replace(/\s+/g, '-')}`,
      name: profile.name,
      email: profile.email,
      role,
      department: profile.department,
    };
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
