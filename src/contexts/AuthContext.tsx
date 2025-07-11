
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

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
  confirmLogout: () => void;
  cancelLogout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  isAuthenticated: boolean;
  isConfirmingLogout: boolean;
  loginAttempts: number;
  isLocked: boolean;
  lockTimeRemaining: number;
}

// Création du contexte avec une valeur par défaut
const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => false,
  logout: () => {},
  confirmLogout: () => {},
  cancelLogout: () => {},
  updateProfile: () => {},
  isAuthenticated: false,
  isConfirmingLogout: false,
  loginAttempts: 0,
  isLocked: false,
  lockTimeRemaining: 0
});

// Hook pour utiliser le contexte d'authentification
export const useAuth = () => {
  return useContext(AuthContext);
};

// Provider pour l'authentification - gère l'état de connexion
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isConfirmingLogout, setIsConfirmingLogout] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockTimeRemaining, setLockTimeRemaining] = useState(0);
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

    // Récupérer les tentatives de connexion précédentes
    const attempts = localStorage.getItem('loginAttempts');
    if (attempts) {
      setLoginAttempts(parseInt(attempts));
    }

    // Vérifier si le compte est verrouillé
    const lockExpiration = localStorage.getItem('lockExpiration');
    if (lockExpiration) {
      const expirationTime = parseInt(lockExpiration);
      if (expirationTime > Date.now()) {
        setIsLocked(true);
        setLockTimeRemaining(Math.ceil((expirationTime - Date.now()) / 1000));
      } else {
        // Le verrouillage est expiré
        localStorage.removeItem('lockExpiration');
      }
    }

    setIsInitialized(true);
  }, []);

  // Minuteur pour mettre à jour le temps restant du verrouillage
  useEffect(() => {
    let timer: number;
    if (isLocked && lockTimeRemaining > 0) {
      timer = window.setInterval(() => {
        setLockTimeRemaining(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            setIsLocked(false);
            localStorage.removeItem('lockExpiration');
            localStorage.removeItem('loginAttempts');
            setLoginAttempts(0);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isLocked, lockTimeRemaining]);

  // Fonction de connexion - simulation d'une authentification
  const login = async (email: string, password: string): Promise<boolean> => {
    console.log(`Login attempt with: ${email}`);
    
    // Vérifier si le compte est verrouillé
    if (isLocked) {
      toast({
        title: "Compte verrouillé",
        description: `Trop de tentatives échouées. Veuillez réessayer dans ${lockTimeRemaining} secondes.`,
        variant: "destructive",
      });
      return false;
    }
    
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
      
      // Réinitialiser les tentatives de connexion
      setLoginAttempts(0);
      localStorage.removeItem('loginAttempts');
      
      toast({
        title: "Connexion réussie",
        description: "Bienvenue dans l'interface d'administration AIDataPME",
      });
      
      return true;
    }
    
    // Échec de connexion - incrémenter le compteur de tentatives
    const newAttempts = loginAttempts + 1;
    setLoginAttempts(newAttempts);
    localStorage.setItem('loginAttempts', newAttempts.toString());
    
    console.log("Login failed: invalid credentials, attempt", newAttempts);
    
    // Verrouiller le compte après 3 tentatives échouées
    if (newAttempts >= 3) {
      const lockDuration = 120; // 2 minutes en secondes
      const expirationTime = Date.now() + (lockDuration * 1000);
      setIsLocked(true);
      setLockTimeRemaining(lockDuration);
      localStorage.setItem('lockExpiration', expirationTime.toString());
      
      toast({
        title: "Compte temporairement verrouillé",
        description: `Trop de tentatives échouées. Veuillez réessayer dans ${lockDuration} secondes.`,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Échec de connexion",
        description: "Email ou mot de passe incorrect",
        variant: "destructive",
      });
    }
    
    return false;
  };

  // Fonction pour confirmer la déconnexion
  const confirmLogout = () => {
    setIsConfirmingLogout(true);
  };

  // Fonction pour annuler la déconnexion
  const cancelLogout = () => {
    setIsConfirmingLogout(false);
  };

  // Fonction de déconnexion effective
  const handleLogout = () => {
    console.log("Logging out user");
    setUser(null);
    localStorage.removeItem('adminUser');
    setIsConfirmingLogout(false);
    
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
    logout: confirmLogout,
    confirmLogout,
    cancelLogout,
    updateProfile,
    isAuthenticated: !!user,
    isConfirmingLogout,
    loginAttempts,
    isLocked,
    lockTimeRemaining
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
      
      {/* Dialogue de confirmation de déconnexion */}
      <AlertDialog open={isConfirmingLogout} onOpenChange={setIsConfirmingLogout}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la déconnexion</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir vous déconnecter ? Toutes vos sessions actives seront fermées.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelLogout}>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout}>Se déconnecter</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AuthContext.Provider>
  );
};
