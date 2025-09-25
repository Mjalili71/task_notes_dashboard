import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: number;
  username: string;
  email: string;
  full_name: string;
  is_active: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!user;

  useEffect(() => {
    // بررسی وجود token در localStorage
    const token = localStorage.getItem('access_token');
    if (token) {
      // در اینجا می‌توانید کاربر را از API دریافت کنید
      // فعلاً فقط token را بررسی می‌کنیم
      setUser({ 
        id: 1, 
        username: 'user', 
        email: 'user@example.com', 
        full_name: 'کاربر',
        is_active: true 
      });
    }
    setLoading(false);
  }, []);

  const login = (token: string) => {
    localStorage.setItem('access_token', token);
    setUser({ 
      id: 1, 
      username: 'user', 
      email: 'user@example.com', 
      full_name: 'کاربر',
      is_active: true 
    });
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('token_type');
    setUser(null);
  };

  const value = {
    user,
    isAuthenticated,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
