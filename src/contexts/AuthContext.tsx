
import React, { createContext, useContext, useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
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

// Import du client Supabase configuré
import { supabase } from '@/integrations/supabase/client';

// Interface pour les données utilisateur
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'client';
  profileImage?: string;
  company: string;
  companyLogo?: string;
  status?: 'actif' | 'en_attente_suppression' | 'supprimé' | 'restauré';
  isTemporaryPassword?: boolean;
  created_at?: string;
  updated_at?: string;
}

// Interface pour le contexte d'authentification
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, expectedRole?: 'admin' | 'client') => Promise<boolean>;
  logout: () => void;
  confirmLogout: () => void;
  cancelLogout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  createClientAccount: (email: string, name: string, company: string, temporaryPassword: string) => Promise<boolean>;
  getAllUsers: () => Promise<User[]>;
  isAuthenticated: boolean;
  isConfirmingLogout: boolean;
}

// Création du contexte avec une valeur par défaut
const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => false,
  logout: () => {},
  confirmLogout: () => {},
  cancelLogout: () => {},
  updateProfile: () => {},
  changePassword: async () => false,
  createClientAccount: async () => false,
  getAllUsers: async () => [],
  isAuthenticated: false,
  isConfirmingLogout: false
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

    setIsInitialized(true);
  }, []);

  // Fonction de connexion avec Supabase
  const login = async (email: string, password: string, expectedRole?: 'admin' | 'client'): Promise<boolean> => {
    console.log(`Login attempt with: ${email} for role: ${expectedRole}`);

    try {
      // Connexion avec Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (authError) {
        console.error('Supabase auth error:', authError);
        toast({
          title: "Échec de connexion",
          description: "Email ou mot de passe incorrect",
          variant: "destructive",
        });
        return false;
      }

      // Récupérer les données utilisateur depuis notre table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (userError || !userData) {
        console.error('User data error:', userError);
        toast({
          title: "Échec de connexion",
          description: "Email ou mot de passe incorrect",
          variant: "destructive",
        });
        return false;
      }

      // Récupérer le rôle depuis user_roles
      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userData.id)
        .single();

      if (!roleData || (expectedRole && roleData.role !== expectedRole)) {
        toast({
          title: "Accès refusé",
          description: `Ce compte n'a pas les permissions ${expectedRole === 'admin' ? 'administrateur' : 'client'}.`,
          variant: "destructive",
        });
        return false;
      }

      // Vérifier le statut du compte
      if (userData.status === 'supprimé') {
        toast({
          title: "Compte supprimé",
          description: "Ce compte a été supprimé. Contactez votre administrateur.",
          variant: "destructive",
        });
        return false;
      }

      // Créer l'objet utilisateur
      const userObj: User = {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        role: roleData.role as 'admin' | 'client',
        company: userData.company,
        companyLogo: userData.company_logo,
        profileImage: userData.profile_image || '/placeholder.svg',
        status: (userData.status || 'actif') as 'actif' | 'en_attente_suppression' | 'supprimé' | 'restauré',
        isTemporaryPassword: userData.is_temporary_password || false,
        created_at: userData.created_at,
        updated_at: userData.updated_at
      };

      setUser(userObj);
      localStorage.setItem('user', JSON.stringify(userObj));
      
      toast({
        title: "Connexion réussie",
        description: `Bienvenue ${roleData.role === 'admin' ? 'dans votre espace administrateur' : 'dans votre espace client'} !`,
      });
      
      return true;

    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Échec de connexion",
        description: "Email ou mot de passe incorrect",
        variant: "destructive",
      });
      return false;
    }
  };

  // Fonction de connexion fallback (sans Supabase)
  const loginFallback = async (email: string, password: string, expectedRole?: 'admin' | 'client'): Promise<boolean> => {
    // Identifiants de test valides
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
      }
    ];
    
    const credential = validCredentials.find(
      cred => cred.email === email && cred.password === password
    );
    
    if (credential) {
      const userData: User = {
        id: credential.role === 'admin' ? '1' : credential.email.split('@')[0],
        email: credential.email,
        name: credential.name,
        role: credential.role,
        company: credential.company,
        companyLogo: credential.companyLogo,
        profileImage: '/placeholder.svg',
        status: 'actif'
      };
      
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      
      toast({
        title: "Connexion réussie",
        description: `Bienvenue ${credential.role === 'admin' ? 'dans votre espace administrateur' : 'dans votre espace client'} !`,
      });
      
      return true;
    }
    
    toast({
      title: "Échec de connexion",
      description: "Email ou mot de passe incorrect",
      variant: "destructive",
    });
    return false;
  };

  // Changer le mot de passe
  const changePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    if (!user) {
      toast({
        title: "Erreur",
        description: "Utilisateur non connecté",
        variant: "destructive",
      });
      return false;
    }

    try {
      // Changer le mot de passe dans Supabase Auth
      const { error: authError } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (authError) throw authError;

      // Mettre à jour le statut dans notre table
      const { error: updateError } = await supabase
        .from('users')
        .update({
          is_temporary_password: false,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (updateError) throw updateError;

      // Mettre à jour l'état local
      const updatedUser = { ...user, isTemporaryPassword: false };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));

      toast({
        title: "Mot de passe modifié",
        description: "Votre mot de passe a été modifié avec succès",
        variant: "default",
      });

      return true;
    } catch (error) {
      console.error('Password change error:', error);
      toast({
        title: "Erreur",
        description: "Impossible de changer le mot de passe",
        variant: "destructive",
      });
      return false;
    }
  };

  // Créer un compte client (admin only)
  const createClientAccount = async (email: string, name: string, company: string, temporaryPassword: string): Promise<boolean> => {
    if (!user || user.role !== 'admin') {
      toast({
        title: "Erreur",
        description: "Seuls les administrateurs peuvent créer des comptes",
        variant: "destructive",
      });
      return false;
    }

    try {
      // Créer l'utilisateur dans Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email,
        password: temporaryPassword,
        email_confirm: true
      });

      if (authError) throw authError;

      // Créer l'entrée dans notre table users
      const { error: userError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          email,
          name,
          role: 'client',
          company,
          status: 'actif',
          is_temporary_password: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (userError) throw userError;

      toast({
        title: "Compte créé",
        description: `Le compte client pour ${email} a été créé avec succès`,
        variant: "default",
      });

      return true;
    } catch (error) {
      console.error('Create account error:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer le compte client",
        variant: "destructive",
      });
      return false;
    }
  };

  // Récupérer tous les utilisateurs (admin only)
  const getAllUsers = async (): Promise<User[]> => {
    if (!user || user.role !== 'admin') {
      return [];
    }

    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data?.map((userData: any) => ({
        id: userData.id,
        email: userData.email,
        name: userData.name,
        role: userData.role,
        company: userData.company,
        companyLogo: userData.company_logo,
        profileImage: userData.profile_image || '/placeholder.svg',
        status: userData.status || 'actif',
        isTemporaryPassword: userData.is_temporary_password || false,
        created_at: userData.created_at,
        updated_at: userData.updated_at
      })) || [];
    } catch (error) {
      console.error('Get users error:', error);
      return [];
    }
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
    changePassword,
    createClientAccount,
    getAllUsers,
    isAuthenticated: !!user,
    isConfirmingLogout
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
