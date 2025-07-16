import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, 
  faLock, 
  faBell, 
  faEye, 
  faEyeSlash, 
  faCamera,
  faQuestionCircle,
  faCheck,
  faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons';
import { useToast } from '@/hooks/use-toast';

export default function ClientSettings() {
  const { user, updateProfile } = useAuth();
  const { toast } = useToast();

  // États pour les paramètres
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  
  // Préférences notifications
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [weeklyReport, setWeeklyReport] = useState(true);

  // FAQ données
  const faqData = [
    {
      question: "Comment tester mes modèles IA ?",
      answer: "Rendez-vous dans l'onglet 'Prédictions', cliquez sur 'Nouvelle prédiction', chargez votre fichier de données et sélectionnez le type de modèle approprié. Le traitement s'effectue automatiquement."
    },
    {
      question: "Quels formats de fichiers sont acceptés ?",
      answer: "Nous acceptons les formats CSV, Excel (.xlsx), JSON et TXT. La taille maximale par fichier est de 50 MB."
    },
    {
      question: "Comment interpréter les résultats de prédiction ?",
      answer: "Chaque prédiction affiche un niveau de confiance (0-100%), une précision du modèle et des prédictions détaillées. Plus le niveau de confiance est élevé, plus le résultat est fiable."
    },
    {
      question: "Combien de prédictions puis-je faire par mois ?",
      answer: "Votre forfait inclut 50 prédictions par mois. Vous pouvez voir votre consommation actuelle dans l'onglet Dashboard."
    },
    {
      question: "Mes données sont-elles sécurisées ?",
      answer: "Absolument. Toutes vos données sont chiffrées en transit et au repos. Nous respectons le RGPD et ne partageons jamais vos données avec des tiers."
    },
    {
      question: "Comment contacter le support technique ?",
      answer: "Utilisez l'onglet 'Feedback' pour nous envoyer vos questions. Notre équipe répond sous 24h en moyenne."
    },
    {
      question: "Puis-je exporter mes résultats ?",
      answer: "Oui, chaque prédiction peut être exportée en PDF ou CSV depuis la page de détails des résultats."
    },
    {
      question: "Comment fonctionne la facturation ?",
      answer: "Votre abonnement est mensuel. Vous recevez une facture automatiquement chaque mois par email."
    }
  ];

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast({
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas",
        variant: "destructive"
      });
      return;
    }

    if (newPassword.length < 8) {
      toast({
        title: "Erreur",
        description: "Le mot de passe doit contenir au moins 8 caractères",
        variant: "destructive"
      });
      return;
    }

    setIsChangingPassword(true);

    // Simulation du changement de mot de passe
    setTimeout(() => {
      toast({
        title: "Mot de passe modifié",
        description: "Votre mot de passe a été mis à jour avec succès"
      });
      
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setIsChangingPassword(false);
    }, 1500);
  };

  const handleProfileImageChange = () => {
    // Simulation du changement d'image
    toast({
      title: "Photo de profil",
      description: "Fonctionnalité de changement de photo à venir"
    });
  };

  if (!user) return null;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Paramètres
        </h1>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">
            <FontAwesomeIcon icon={faUser} className="mr-2 h-4 w-4" />
            Profil
          </TabsTrigger>
          <TabsTrigger value="security">
            <FontAwesomeIcon icon={faLock} className="mr-2 h-4 w-4" />
            Sécurité
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <FontAwesomeIcon icon={faBell} className="mr-2 h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="faq">
            <FontAwesomeIcon icon={faQuestionCircle} className="mr-2 h-4 w-4" />
            FAQ
          </TabsTrigger>
        </TabsList>

        {/* Onglet Profil */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Informations du profil</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Photo de profil */}
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={user.profileImage} alt={user.name} />
                    <AvatarFallback className="text-lg">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    size="sm"
                    variant="outline"
                    className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
                    onClick={handleProfileImageChange}
                  >
                    <FontAwesomeIcon icon={faCamera} className="h-3 w-3" />
                  </Button>
                </div>
                <div>
                  <h3 className="font-medium">{user.name}</h3>
                  <p className="text-sm text-gray-500">{user.company}</p>
                  <p className="text-sm text-gray-400">{user.email}</p>
                </div>
              </div>

              {/* Informations de l'entreprise */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom complet</Label>
                  <Input
                    id="name"
                    value={user.name}
                    onChange={(e) => updateProfile({ name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={user.email}
                    disabled
                    className="bg-gray-50 dark:bg-gray-900"
                  />
                  <p className="text-xs text-gray-500">
                    L'email ne peut pas être modifié
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Entreprise</Label>
                  <Input
                    id="company"
                    value={user.company}
                    disabled
                    className="bg-gray-50 dark:bg-gray-900"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Sécurité */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Sécurité du compte</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Mot de passe actuel</Label>
                  <div className="relative">
                    <Input
                      id="current-password"
                      type={showCurrentPassword ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                      <FontAwesomeIcon 
                        icon={showCurrentPassword ? faEyeSlash : faEye} 
                        className="h-4 w-4" 
                      />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-password">Nouveau mot de passe</Label>
                  <div className="relative">
                    <Input
                      id="new-password"
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      <FontAwesomeIcon 
                        icon={showNewPassword ? faEyeSlash : faEye} 
                        className="h-4 w-4" 
                      />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirmer le nouveau mot de passe</Label>
                  <div className="relative">
                    <Input
                      id="confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      <FontAwesomeIcon 
                        icon={showConfirmPassword ? faEyeSlash : faEye} 
                        className="h-4 w-4" 
                      />
                    </Button>
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <div className="flex items-start">
                    <FontAwesomeIcon icon={faExclamationTriangle} className="h-4 w-4 text-blue-600 dark:text-blue-400 mr-2 mt-0.5" />
                    <div className="text-sm text-blue-800 dark:text-blue-300">
                      <p className="font-medium mb-1">Exigences du mot de passe :</p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Au moins 8 caractères</li>
                        <li>Combinaison de lettres et chiffres recommandée</li>
                        <li>Évitez les informations personnelles</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isChangingPassword}
                  className="w-full"
                >
                  {isChangingPassword ? 'Modification...' : 'Changer le mot de passe'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Notifications */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Préférences de notification</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Notifications par email</h4>
                  <p className="text-sm text-gray-500">
                    Recevoir les alertes importantes par email
                  </p>
                </div>
                <Switch
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Notifications push</h4>
                  <p className="text-sm text-gray-500">
                    Notifications instantanées dans le navigateur
                  </p>
                </div>
                <Switch
                  checked={pushNotifications}
                  onCheckedChange={setPushNotifications}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Rapport hebdomadaire</h4>
                  <p className="text-sm text-gray-500">
                    Résumé de vos prédictions chaque semaine
                  </p>
                </div>
                <Switch
                  checked={weeklyReport}
                  onCheckedChange={setWeeklyReport}
                />
              </div>

              <Button 
                onClick={() => toast({ title: "Préférences sauvegardées", description: "Vos préférences ont été mises à jour" })}
                className="w-full"
              >
                <FontAwesomeIcon icon={faCheck} className="mr-2 h-4 w-4" />
                Sauvegarder les préférences
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet FAQ */}
        <TabsContent value="faq">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Foire aux questions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Retrouvez ici les réponses aux questions les plus fréquemment posées.
                </p>
                
                <div className="space-y-4">
                  {faqData.map((item, index) => (
                    <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg">
                      <details className="group">
                        <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg">
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {item.question}
                          </h4>
                          <FontAwesomeIcon 
                            icon={faQuestionCircle} 
                            className="h-4 w-4 text-gray-400 group-open:rotate-180 transition-transform" 
                          />
                        </summary>
                        <div className="px-4 pb-4">
                          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                            {item.answer}
                          </p>
                        </div>
                      </details>
                    </div>
                  ))}
                </div>

                <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                    Besoin d'aide supplémentaire ?
                  </h4>
                  <p className="text-blue-800 dark:text-blue-200 text-sm mb-3">
                    Notre équipe support est là pour vous aider. N'hésitez pas à nous contacter.
                  </p>
                  <Button variant="outline" size="sm">
                    Contacter le support
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}