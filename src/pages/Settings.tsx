
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  Camera, 
  Moon, 
  Sun, 
  Settings as SettingsIcon,
  Save,
  Upload,
  Palette,
  Shield,
  Bell,
  Database,
  Eye
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Page des paramètres administrateur
export default function Settings() {
  const { user, updateProfile } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();
  
  // États pour les formulaires
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [company, setCompany] = useState(user?.company || '');
  const [profileImage, setProfileImage] = useState(user?.profileImage || '');
  
  // États pour les notifications et préférences
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [dashboardAnimations, setDashboardAnimations] = useState(true);
  const [autoSave, setAutoSave] = useState(true);

  // Fonction pour sauvegarder le profil
  const handleSaveProfile = () => {
    updateProfile({
      name,
      email,
      company,
      profileImage
    });
    toast({
      title: "Profil mis à jour",
      description: "Vos informations ont été sauvegardées avec succès",
    });
  };

  // Fonction pour gérer le changement d'image de profil
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        setProfileImage(imageUrl);
        toast({
          title: "Image téléchargée",
          description: "Votre image de profil a été mise à jour",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* En-tête */}
      <div className="flex items-center space-x-2 mb-6">
        <SettingsIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Paramètres Administrateur
        </h1>
      </div>

      {/* Section Profil */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>Profil Administrateur</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Photo de profil */}
          <div className="flex items-center space-x-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={profileImage} alt="Photo de profil" />
              <AvatarFallback className="text-lg">
                {name?.split(' ').map(n => n[0]).join('') || 'AD'}
              </AvatarFallback>
            </Avatar>
            <div>
              <Label htmlFor="profile-image" className="cursor-pointer">
                <Button variant="outline" className="flex items-center space-x-2">
                  <Camera className="h-4 w-4" />
                  <span>Changer la photo</span>
                </Button>
              </Label>
              <input
                id="profile-image"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <p className="text-sm text-gray-500 mt-2">
                Format recommandé : JPG, PNG (max 2MB)
              </p>
            </div>
          </div>

          {/* Formulaire de profil */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom complet</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Votre nom complet"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Entreprise</Label>
              <Input
                id="company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Nom de votre entreprise"
              />
            </div>
          </div>

          <Button onClick={handleSaveProfile} className="flex items-center space-x-2">
            <Save className="h-4 w-4" />
            <span>Sauvegarder le profil</span>
          </Button>
        </CardContent>
      </Card>

      {/* Section Apparence */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Palette className="h-5 w-5" />
            <span>Apparence</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Thème sombre/clair */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {theme === 'dark' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              <span>Mode sombre</span>
            </div>
            <Switch
              checked={theme === 'dark'}
              onCheckedChange={toggleTheme}
            />
          </div>

          {/* Animations du dashboard */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Eye className="h-4 w-4" />
              <span>Animations du dashboard</span>
            </div>
            <Switch
              checked={dashboardAnimations}
              onCheckedChange={setDashboardAnimations}
            />
          </div>
        </CardContent>
      </Card>

      {/* Section Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="h-5 w-5" />
            <span>Notifications</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Notifications par email</p>
              <p className="text-sm text-gray-500">
                Recevoir des alertes par email pour les événements importants
              </p>
            </div>
            <Switch
              checked={emailNotifications}
              onCheckedChange={setEmailNotifications}
            />
          </div>
        </CardContent>
      </Card>

      {/* Section Dashboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="h-5 w-5" />
            <span>Paramètres du Dashboard</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Sauvegarde automatique</p>
              <p className="text-sm text-gray-500">
                Sauvegarder automatiquement les modifications
              </p>
            </div>
            <Switch
              checked={autoSave}
              onCheckedChange={setAutoSave}
            />
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button variant="outline" className="flex items-center space-x-2">
              <Upload className="h-4 w-4" />
              <span>Exporter les données</span>
            </Button>
            <Button variant="outline" className="flex items-center space-x-2">
              <Shield className="h-4 w-4" />
              <span>Paramètres de sécurité</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Section Tutoriel */}
      <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="text-blue-800 dark:text-blue-200">
            🎓 Tutoriel AIDataPME
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-blue-700 dark:text-blue-300 mb-4">
            Découvrez comment utiliser efficacement votre dashboard d'administration
          </p>
          <div className="space-y-2">
            <Button variant="outline" className="w-full justify-start">
              <span>📊 Guide du tableau de bord</span>
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <span>👥 Gestion des clients</span>
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <span>🤖 Configuration des modèles IA</span>
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <span>📈 Analyse des performances</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
