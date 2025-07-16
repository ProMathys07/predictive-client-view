import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, 
  faLock, 
  faPalette, 
  faSignOutAlt,
  faEye,
  faEyeSlash,
  faCheck
} from '@fortawesome/free-solid-svg-icons';

export default function ClientProfile() {
  const { user, logout, updateProfile } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [isUpdating, setIsUpdating] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs.",
        variant: "destructive"
      });
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Erreur",
        description: "Les nouveaux mots de passe ne correspondent pas.",
        variant: "destructive"
      });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast({
        title: "Erreur",
        description: "Le nouveau mot de passe doit contenir au moins 6 caractères.",
        variant: "destructive"
      });
      return;
    }

    setIsUpdating(true);
    
    // Simulation de la mise à jour
    setTimeout(() => {
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setIsUpdating(false);
      toast({
        title: "Mot de passe modifié",
        description: "Votre mot de passe a été mis à jour avec succès.",
      });
    }, 2000);
  };

  const handleLogout = async () => {
    if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
      await logout();
    }
  };

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Profil utilisateur
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Gérez vos paramètres personnels et préférences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Informations personnelles */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FontAwesomeIcon icon={faUser} className="h-5 w-5 text-blue-600" />
              <span>Informations personnelles</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Nom complet
              </Label>
              <Input
                type="text"
                value={user?.name || ''}
                disabled
                className="mt-1 bg-gray-50 dark:bg-gray-800"
              />
            </div>
            
            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Adresse email
              </Label>
              <Input
                type="email"
                value={user?.email || ''}
                disabled
                className="mt-1 bg-gray-50 dark:bg-gray-800"
              />
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Entreprise
              </Label>
              <Input
                type="text"
                value={user?.company || ''}
                disabled
                className="mt-1 bg-gray-50 dark:bg-gray-800"
              />
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Rôle
              </Label>
              <Input
                type="text"
                value="Client"
                disabled
                className="mt-1 bg-gray-50 dark:bg-gray-800"
              />
            </div>

            <div className="pt-2">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Pour modifier ces informations, contactez votre administrateur.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Modification du mot de passe */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FontAwesomeIcon icon={faLock} className="h-5 w-5 text-red-600" />
              <span>Sécurité</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <Label htmlFor="currentPassword" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Mot de passe actuel
                </Label>
                <div className="relative mt-1">
                  <Input
                    id="currentPassword"
                    type={showPasswords.current ? "text" : "password"}
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData(prev => ({
                      ...prev,
                      currentPassword: e.target.value
                    }))}
                    placeholder="Saisissez votre mot de passe actuel"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('current')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <FontAwesomeIcon 
                      icon={showPasswords.current ? faEyeSlash : faEye} 
                      className="h-4 w-4" 
                    />
                  </button>
                </div>
              </div>

              <div>
                <Label htmlFor="newPassword" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Nouveau mot de passe
                </Label>
                <div className="relative mt-1">
                  <Input
                    id="newPassword"
                    type={showPasswords.new ? "text" : "password"}
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData(prev => ({
                      ...prev,
                      newPassword: e.target.value
                    }))}
                    placeholder="Minimum 6 caractères"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('new')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <FontAwesomeIcon 
                      icon={showPasswords.new ? faEyeSlash : faEye} 
                      className="h-4 w-4" 
                    />
                  </button>
                </div>
              </div>

              <div>
                <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Confirmer le nouveau mot de passe
                </Label>
                <div className="relative mt-1">
                  <Input
                    id="confirmPassword"
                    type={showPasswords.confirm ? "text" : "password"}
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData(prev => ({
                      ...prev,
                      confirmPassword: e.target.value
                    }))}
                    placeholder="Répétez le nouveau mot de passe"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('confirm')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <FontAwesomeIcon 
                      icon={showPasswords.confirm ? faEyeSlash : faEye} 
                      className="h-4 w-4" 
                    />
                  </button>
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={isUpdating}
                className="w-full"
              >
                {isUpdating ? (
                  <>
                    <FontAwesomeIcon icon={faCheck} className="mr-2 h-4 w-4 animate-pulse" />
                    Mise à jour...
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faLock} className="mr-2 h-4 w-4" />
                    Modifier le mot de passe
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Préférences d'affichage */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FontAwesomeIcon icon={faPalette} className="h-5 w-5 text-purple-600" />
              <span>Préférences d'affichage</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Mode sombre
                </Label>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Activer le thème sombre pour réduire la fatigue oculaire
                </p>
              </div>
              <Switch
                checked={theme === 'dark'}
                onCheckedChange={toggleTheme}
              />
            </div>

            <div className="pt-4 text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Thème actuel: <span className="font-medium">{theme === 'dark' ? 'Sombre' : 'Clair'}</span>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Actions de compte */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FontAwesomeIcon icon={faSignOutAlt} className="h-5 w-5 text-red-600" />
              <span>Actions de compte</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Déconnectez-vous de votre session actuelle en toute sécurité.
              </p>
              
              <Button 
                onClick={handleLogout}
                variant="destructive"
                className="w-full"
              >
                <FontAwesomeIcon icon={faSignOutAlt} className="mr-2 h-4 w-4" />
                Se déconnecter
              </Button>
            </div>

            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                Dernière connexion: {new Date().toLocaleString('fr-FR')}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}