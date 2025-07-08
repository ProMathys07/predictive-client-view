
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

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

// Création du contexte avec une valeur par défaut
const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => false,
  logout: () => {},
  updateProfile: () => {},
  isAuthenticated: false
});

// Hook pour utiliser le contexte d'authentification
export const useAuth = () => {
  return useContext(AuthContext);
};

// Provider pour l'authentification - gère l'état de connexion
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const { toast } = useToast();

  // Vérifier s'il y a un utilisateur connecté au chargement
  useEffect(() => {
    const savedUser = localStorage.getItem('adminUser');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        console.log("AuthContext: Loaded user from storage", parsedUser.email);
        setUser(parsedUser);
      } catch (error) {
        console.error("Error parsing user from localStorage:", error);
        localStorage.removeItem('adminUser');
      }
    } else {
      console.log("AuthContext: No user found in storage");
    }
    setIsInitialized(true);
  }, []);

  // Fonction de connexion - simulation d'une authentification
  const login = async (email: string, password: string): Promise<boolean> => {
    console.log(`Login attempt with: ${email}`);
    
    // Simulation d'une vérification d'identifiants
    if (email === 'admin@aidatapme.com' && password === 'admin123') {
      console.log("Login successful");
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
      
      toast({
        title: "Connexion réussie",
        description: "Bienvenue dans l'interface d'administration AIDataPME",
      });
      
      return true;
    }
    
    console.log("Login failed: invalid credentials");
    return false;
  };

  // Fonction de déconnexion
  const logout = () => {
    console.log("Logging out user");
    setUser(null);
    localStorage.removeItem('adminUser');
    
    toast({
      title: "Déconnexion",
      description: "Vous avez été déconnecté avec succès",
    });
  };

  // Fonction pour mettre à jour le profil
  const updateProfile = (updates: Partial<User>) => {
    if (user) {
      console.log("Updating user profile", updates);
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('adminUser', JSON.stringify(updatedUser));
    }
  };

  // Valeur du contexte
  const contextValue = {
    user,
    login,
    logout,
    updateProfile,
    isAuthenticated: !!user
  };

  // N'afficher l'interface qu'une fois l'état d'authentification vérifié
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <p className="text-lg text-gray-600 dark:text-gray-300">Initialisation...</p>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
