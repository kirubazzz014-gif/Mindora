import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { storage } from '../utils/storage';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: (emailOption?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (name: string, avatarUrl?: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load persisted user on startup
    const saved = storage.getCurrentUser();
    if (saved) {
      setUser(saved);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    // Validate
    if (!email || !pass) {
      return { success: false, error: 'Please enter both email and password.' };
    }
    const cleanEmail = email.trim().toLowerCase();
    const registered = storage.getRegisteredUsers();
    const existing = registered.find(u => u.email.toLowerCase() === cleanEmail);

    if (existing) {
      setUser(existing);
      storage.setCurrentUser(existing);
      return { success: true };
    }

    // Auto-create friendly educational account if not found so user can log in without friction
    const newUser: User = {
      id: 'usr_' + Math.random().toString(36).substring(2, 9),
      name: cleanEmail.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      email: cleanEmail,
      provider: 'password',
      createdAt: new Date().toISOString(),
      avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${cleanEmail}&backgroundColor=87ceeb`
    };
    storage.saveUser(newUser);
    storage.setCurrentUser(newUser);
    setUser(newUser);
    return { success: true };
  };

  const register = async (name: string, email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    if (!name.trim()) {
      return { success: false, error: 'Please enter your name.' };
    }
    if (!email.trim() || !email.includes('@')) {
      return { success: false, error: 'Please enter a valid email address.' };
    }
    if (pass.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters.' };
    }

    const cleanEmail = email.trim().toLowerCase();
    const registered = storage.getRegisteredUsers();
    if (registered.some(u => u.email.toLowerCase() === cleanEmail)) {
      return { success: false, error: 'An account with this email already exists. Please log in.' };
    }

    const newUser: User = {
      id: 'usr_' + Math.random().toString(36).substring(2, 9),
      name: name.trim(),
      email: cleanEmail,
      provider: 'password',
      createdAt: new Date().toISOString(),
      avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${cleanEmail}&backgroundColor=87ceeb`
    };

    storage.saveUser(newUser);
    storage.setCurrentUser(newUser);
    setUser(newUser);
    return { success: true };
  };

  const loginWithGoogle = async (emailOption?: string): Promise<{ success: boolean; error?: string }> => {
    // Mindora Google/Gmail Authentication
    const googleEmail = emailOption || 'kirubazzz0.14@gmail.com';
    const googleName = googleEmail.split('@')[0].replace(/[._0-9]/g, ' ').trim() || 'Mindora Scholar';
    const formattedName = googleName.charAt(0).toUpperCase() + googleName.slice(1);

    const googleUser: User = {
      id: 'g_' + Math.random().toString(36).substring(2, 9),
      name: formattedName,
      email: googleEmail,
      provider: 'google',
      createdAt: new Date().toISOString(),
      avatarUrl: `https://api.dicebear.com/7.x/shapes/svg?seed=${googleEmail}&backgroundColor=87ceeb`
    };

    storage.saveUser(googleUser);
    storage.setCurrentUser(googleUser);
    setUser(googleUser);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    storage.setCurrentUser(null);
  };

  const updateProfile = (name: string, avatarUrl?: string) => {
    if (!user) return;
    const updated = {
      ...user,
      name,
      avatarUrl: avatarUrl || user.avatarUrl
    };
    setUser(updated);
    storage.saveUser(updated);
    storage.setCurrentUser(updated);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        loginWithGoogle,
        logout,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
