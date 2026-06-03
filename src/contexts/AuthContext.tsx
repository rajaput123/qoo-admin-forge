import { createContext, useContext, ReactNode } from 'react';

interface AuthContextType {
  user: {
    id: string;
    name: string;
    email: string;
    role?: string;
  } | null;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Placeholder implementation
  const value: AuthContextType = {
    user: {
      id: '1',
      name: 'Admin',
      email: 'admin@temple.org',
      role: 'super_admin',
    },
    isAuthenticated: true,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export default AuthContext;
