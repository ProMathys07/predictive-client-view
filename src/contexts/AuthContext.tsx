
import React, { createContext, useContext, useState, useEffect } from 'react';

// Interface pour les données utilisateur admin
interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin';
  profileImage?: string;
  company: string;
}

// Interface pour le contexte d'authentification
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  isAuthenticated: boolean;
}

// Contexte d'authentification
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook pour utiliser le contexte d'authentification
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Provider pour l'authentification - gère l'état de connexion
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // Vérifier s'il y a un utilisateur connecté au chargement
  useEffect(() => {
    const savedUser = localStorage.getItem('adminUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Fonction de connexion - simulation d'une authentification
  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulation d'une vérification d'identifiants
    if (email === 'admin@aidatapme.com' && password === 'admin123') {
      const adminUser: User = {
        id: '1',
        email: 'admin@aidatapme.com',
        name: 'Administrateur AIDataPME',
        role: 'admin',
        company: 'AIDataPME',
        profileImage: '/placeholder.svg'
      };
      setUser(adminUser);
      localStorage.setItem('adminUser', JSON.stringify(adminUser));
      return true;
    }
    return false;
  };

  // Fonction de déconnexion
  const logout = () => {
    setUser(null);
    localStorage.removeItem('adminUser');
  };

  // Fonction pour mettre à jour le profil
  const updateProfile = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('adminUser', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      updateProfile,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
};
