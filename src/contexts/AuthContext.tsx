
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

// Interface pour les données utilisateur
interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'client';
  profileImage?: string;
  company: string;
  companyLogo?: string;
}

// Interface pour le contexte d'authentification
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, expectedRole?: 'admin' | 'client') => Promise<boolean>;
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
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        
        // Restaurer la photo de profil avec toutes les méthodes de sauvegarde
        let savedProfileImage = localStorage.getItem(`profileImage_${parsedUser.id}`) ||
                               localStorage.getItem(`profile_image_${parsedUser.email}`) ||
                               localStorage.getItem('current_user_profile_image');
        
        if (savedProfileImage) {
          parsedUser.profileImage = savedProfileImage;
        }
        
        console.log("AuthContext: Loaded user from storage", parsedUser.email, "with profile image:", !!savedProfileImage);
        setUser(parsedUser);
      } catch (error) {
        console.error("Error parsing user from localStorage:", error);
        localStorage.removeItem('user');
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
  const login = async (email: string, password: string, expectedRole?: 'admin' | 'client'): Promise<boolean> => {
    console.log(`Login attempt with: ${email} for role: ${expectedRole}`);
    
    // Vérifier si le compte est verrouillé
    if (isLocked) {
      toast({
        title: "Compte verrouillé",
        description: `Trop de tentatives échouées. Veuillez réessayer dans ${lockTimeRemaining} secondes.`,
        variant: "destructive",
      });
      return false;
    }
    
    // Base de données simulée des utilisateurs autorisés
    const registeredCompanies = [
      { email: 'client@technosolutions.fr', company: 'TechnoSolutions' },
      { email: 'contact@innovacorp.fr', company: 'InnovaCorp' },
      { email: 'admin@aidatapme.com', company: 'AIDataPME' }
    ];
    
    // Identifiants de test valides (admin et clients)
    const validCredentials = [
      { 
        email: 'admin@aidatapme.com', 
        password: 'admin123',
        role: 'admin' as const,
        name: 'Administrateur Système',
        company: 'AIDataPME'
      },
      { 
        email: 'client@technosolutions.fr', 
        password: 'client123',
        role: 'client' as const,
        name: 'Jean Dupont',
        company: 'TechnoSolutions',
        companyLogo: '/api/placeholder/100/100'
      },
      { 
        email: 'contact@innovacorp.fr', 
        password: 'innova456',
        role: 'client' as const,
        name: 'Marie Martin',
        company: 'InnovaCorp',
        companyLogo: '/api/placeholder/100/100'
      }
    ];
    
    // Vérifier si l'email existe dans la base des entreprises enregistrées
    const registeredCompany = registeredCompanies.find(comp => comp.email === email);
    if (!registeredCompany) {
      toast({
        title: "Compte introuvable",
        description: "Aucune entreprise enregistrée avec cette adresse email. Contactez votre administrateur.",
        variant: "destructive",
      });
      return false;
    }
    
    const credential = validCredentials.find(
      cred => cred.email === email && cred.password === password
    );
    
    // Vérifier le rôle attendu si spécifié
    if (expectedRole && credential && credential.role !== expectedRole) {
      toast({
        title: "Accès refusé",
        description: `Ce compte n'a pas les permissions ${expectedRole === 'admin' ? 'administrateur' : 'client'}.`,
        variant: "destructive",
      });
      return false;
    }
    
    if (credential) {
      console.log("Login successful");
      
      // Créer l'utilisateur de base
      const userData: User = {
        id: credential.role === 'admin' ? '1' : credential.email.split('@')[0],
        email: credential.email,
        name: credential.name,
        role: credential.role,
        company: credential.company,
        companyLogo: credential.companyLogo,
        profileImage: '/placeholder.svg'
      };
      
      // Récupérer la photo de profil sauvegardée si elle existe
      const savedProfileImage = localStorage.getItem(`profileImage_${userData.id}`) ||
                               localStorage.getItem(`profile_image_${userData.email}`) ||
                               localStorage.getItem('current_user_profile_image');
      
      if (savedProfileImage) {
        userData.profileImage = savedProfileImage;
        console.log("Restored saved profile image for user:", userData.email);
      }
      
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Réinitialiser les tentatives de connexion
      setLoginAttempts(0);
      localStorage.removeItem('loginAttempts');
      
      toast({
        title: "Connexion réussie",
        description: `Bienvenue ${credential.role === 'admin' ? 'dans votre espace administrateur' : 'dans votre espace client'} !`,
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
    localStorage.removeItem('user');
    setIsConfirmingLogout(false);
    
    toast({
      title: "Déconnexion",
      description: "Vous avez été déconnecté avec succès",
    });
  };

  // Fonction pour mettre à jour le profil avec persistance améliorée
  const updateProfile = (updates: Partial<User>) => {
    if (user) {
      console.log("Updating user profile", updates);
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      
      // Sauvegarde immédiate et robuste dans localStorage
      try {
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        // Sauvegarde triple pour la photo de profil (persistance maximale)
        if (updates.profileImage) {
          localStorage.setItem(`profileImage_${user.id}`, updates.profileImage);
          localStorage.setItem(`profile_image_${user.email}`, updates.profileImage);
          localStorage.setItem('current_user_profile_image', updates.profileImage);
        }
        
        console.log("Profile updated and saved successfully");
      } catch (error) {
        console.error("Error saving profile to localStorage:", error);
      }
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
