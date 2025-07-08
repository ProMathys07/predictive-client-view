import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, 
  faEnvelope, 
  faSave, 
  faBuilding, 
  faImage,
  faSun,
  faMoon,
  faShield,
  faCog
} from '@fortawesome/free-solid-svg-icons';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';

export default function Settings() {
  const { user, updateProfile } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // États pour les informations de profil
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [profileImage, setProfileImage] = useState<string | undefined>('');
  const [passwordCurrent, setPasswordCurrent] = useState('');
  const [passwordNew, setPasswordNew] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  
  // États pour les préférences
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [securityAlerts, setSecurityAlerts] = useState(true);
  
  // Charger les données utilisateur au montage du composant
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setCompany(user.company || '');
      setProfileImage(user.profileImage);
    }
  }, [user]);

  // Fonction pour mettre à jour le profil
  const handleProfileUpdate = () => {
    if (!name || !email) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      });
      return;
    }
    
    updateProfile({
      name,
      email,
      company,
      profileImage,
    });
    
    toast({
      title: "Profil mis à jour",
      description: "Vos informations ont été mises à jour avec succès",
    });
  };
  
  // Fonction pour changer le mot de passe
  const handlePasswordChange = () => {
    // Simulation de changement de mot de passe
    if (passwordCurrent === 'admin123' && passwordNew === passwordConfirm && passwordNew.length >= 6) {
      toast({
        title: "Mot de passe modifié",
        description: "Votre mot de passe a été mis à jour avec succès",
      });
      
      setPasswordCurrent('');
      setPasswordNew('');
      setPasswordConfirm('');
    } else {
      toast({
        title: "Erreur",
        description: "Vérifiez vos informations et réessayez",
        variant: "destructive",
      });
    }
  };
  
  // Fonction pour gérer l'upload d'image
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setProfileImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
        Paramètres du compte
      </h1>
      
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="profile">
            <FontAwesomeIcon icon={faUser} className="mr-2" /> Profil
          </TabsTrigger>
          <TabsTrigger value="security">
            <FontAwesomeIcon icon={faShield} className="mr-2" /> Sécurité
          </TabsTrigger>
          <TabsTrigger value="preferences">
            <FontAwesomeIcon icon={faCog} className="mr-2" /> Préférences
          </TabsTrigger>
        </TabsList>
        
        {/* Section Profil */}
        <TabsContent value="profile">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-semibold">
                  Informations personnelles
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom complet</Label>
                  <div className="relative">
                    <FontAwesomeIcon icon={faUser} className="absolute left-3 top-3 text-gray-400" />
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Adresse email</Label>
                  <div className="relative">
                    <FontAwesomeIcon icon={faEnvelope} className="absolute left-3 top-3 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="company">Entreprise</Label>
                  <div className="relative">
                    <FontAwesomeIcon icon={faBuilding} className="absolute left-3 top-3 text-gray-400" />
                    <Input
                      id="company"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <Button 
                  onClick={handleProfileUpdate}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <FontAwesomeIcon icon={faSave} className="mr-2" />
                  Sauvegarder les modifications
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-semibold">
                  Photo de profil
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center space-y-6">
                <Avatar className="h-32 w-32">
                  <AvatarImage src={profileImage} />
                  <AvatarFallback className="text-2xl font-bold">
                    {name?.split(' ').map(n => n[0]).join('') || 'AD'}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex flex-col gap-2 w-full max-w-xs">
                  <Button 
                    onClick={() => fileInputRef.current?.click()} 
                    variant="outline"
                  >
                    <FontAwesomeIcon icon={faImage} className="mr-2" />
                    Changer la photo
                  </Button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
                
                <p className="text-sm text-gray-500 text-center">
                  Formats acceptés: JPG, PNG. Taille maximale: 2 MB
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Section Sécurité */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold">
                Modifier le mot de passe
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Mot de passe actuel</Label>
                <Input
                  id="current-password"
                  type="password"
                  value={passwordCurrent}
                  onChange={(e) => setPasswordCurrent(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="new-password">Nouveau mot de passe</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={passwordNew}
                  onChange={(e) => setPasswordNew(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                />
              </div>
              
              <Button 
                onClick={handlePasswordChange}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <FontAwesomeIcon icon={faSave} className="mr-2" />
                Changer le mot de passe
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Section Préférences */}
        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold">
                Préférences d'affichage
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <h3 className="text-base font-medium">Thème</h3>
                  <p className="text-sm text-gray-500">
                    {theme === 'dark' ? 'Mode sombre activé' : 'Mode clair activé'}
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  onClick={toggleTheme}
                  className="gap-2"
                >
                  <FontAwesomeIcon icon={theme === 'dark' ? faSun : faMoon} />
                  {theme === 'dark' ? 'Passer au mode clair' : 'Passer au mode sombre'}
                </Button>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-base font-medium">Notifications</h3>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h4 className="text-sm font-medium">Notifications par email</h4>
                    <p className="text-xs text-gray-500">
                      Recevoir des notifications par email
                    </p>
                  </div>
                  <Switch
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h4 className="text-sm font-medium">Alertes de sécurité</h4>
                    <p className="text-xs text-gray-500">
                      Être informé des activités de connexion suspectes
                    </p>
                  </div>
                  <Switch
                    checked={securityAlerts}
                    onCheckedChange={setSecurityAlerts}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
