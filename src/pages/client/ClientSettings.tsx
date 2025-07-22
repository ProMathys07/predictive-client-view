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
  faExclamationTriangle,
  faTrash,
  faUserMinus
} from '@fortawesome/free-solid-svg-icons';
import { useToast } from '@/hooks/use-toast';
import { useAccountDeletion } from '@/hooks/useAccountDeletion';
import { useNotifications } from '@/hooks/useNotifications';

// Page des paramètres client avec gestion de profil, sécurité, notifications et suppression de compte
export default function ClientSettings() {
  const { user, updateProfile } = useAuth();
  const { toast } = useToast();
  const { addNotification } = useNotifications();
  const { createDeletionRequest, hasActiveDeletionRequest } = useAccountDeletion(addNotification);

  // États pour la gestion du mot de passe
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  
  // États pour les préférences de notifications
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [weeklyReport, setWeeklyReport] = useState(true);
  
  // États pour la demande de suppression de compte
  const [deletionReason, setDeletionReason] = useState('');
  const [showDeletionReason, setShowDeletionReason] = useState(false);


  // Gérer le changement de mot de passe avec validation
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Vérifier que les mots de passe correspondent
    if (newPassword !== confirmPassword) {
      toast({
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas",
        variant: "destructive"
      });
      return;
    }

    // Vérifier la longueur minimale
    if (newPassword.length < 8) {
      toast({
        title: "Erreur",
        description: "Le mot de passe doit contenir au moins 8 caractères",
        variant: "destructive"
      });
      return;
    }

    setIsChangingPassword(true);

    // Simulation du changement de mot de passe (remplacer par vraie API)
    setTimeout(() => {
      toast({
        title: "Mot de passe modifié",
        description: "Votre mot de passe a été mis à jour avec succès"
      });
      
      // Réinitialiser les champs
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setIsChangingPassword(false);
    }, 1500);
  };

  // Gérer la demande de suppression de compte
  const handleAccountDeletionRequest = () => {
    if (hasActiveDeletionRequest()) {
      toast({
        title: "Demande en cours",
        description: "Vous avez déjà une demande de suppression en cours de traitement.",
        variant: "destructive"
      });
      return;
    }

    const request = createDeletionRequest(deletionReason || 'Aucune raison spécifiée');
    
    if (request) {
      toast({
        title: "Demande envoyée",
        description: "Votre demande de suppression de compte a été transmise à l'administrateur.",
      });
      setDeletionReason('');
      setShowDeletionReason(false);
    }
  };


  if (!user) return null;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Paramètres
        </h1>
      </div>

      {/* Onglets de navigation des paramètres */}
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
          <TabsTrigger value="account">
            <FontAwesomeIcon icon={faUserMinus} className="mr-2 h-4 w-4" />
            Compte
          </TabsTrigger>
        </TabsList>

        {/* Onglet Profil - Informations personnelles */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Informations du profil</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Section avatar et informations de base */}
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={user.profileImage} alt={user.name} />
                    <AvatarFallback className="text-lg">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div>
                  <h3 className="font-medium">{user.name}</h3>
                  <p className="text-sm text-gray-500">{user.company}</p>
                  <p className="text-sm text-gray-400">{user.email}</p>
                  <p className="text-xs text-blue-600 dark:text-blue-400">
                    💡 Changez votre photo depuis le dashboard principal
                  </p>
                </div>
              </div>

              {/* Formulaire d'informations personnelles */}
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

        {/* Onglet Sécurité - Changement de mot de passe */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Sécurité du compte</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Formulaire de changement de mot de passe */}
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
                    {/* Bouton pour afficher/masquer le mot de passe actuel */}
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
                    {/* Bouton pour afficher/masquer le nouveau mot de passe */}
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
                    {/* Bouton pour afficher/masquer la confirmation de mot de passe */}
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

                {/* Informations sur les exigences de sécurité */}
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

                {/* Bouton de soumission du changement de mot de passe */}
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

        {/* Onglet Notifications - Préférences utilisateur */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Préférences de notification</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Options de notifications email */}
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

              {/* Options de notifications push */}
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

              {/* Options de rapport hebdomadaire */}
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

              {/* Bouton de sauvegarde des préférences */}
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

        {/* Nouvel onglet Compte - Gestion de la suppression */}
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle className="text-red-600 dark:text-red-400">
                <FontAwesomeIcon icon={faUserMinus} className="mr-2 h-5 w-5" />
                Gestion du compte
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avertissement de suppression */}
              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
                <div className="flex items-start">
                  <FontAwesomeIcon icon={faExclamationTriangle} className="h-5 w-5 text-red-600 dark:text-red-400 mr-3 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-red-800 dark:text-red-300 mb-2">
                      Suppression de compte
                    </h4>
                    <p className="text-sm text-red-700 dark:text-red-300">
                      La suppression de votre compte est <strong>irréversible</strong>. Toutes vos données, 
                      prédictions et historiques seront définitivement perdus. Cette action nécessite 
                      l'approbation de l'administrateur.
                    </p>
                  </div>
                </div>
              </div>

              {/* Vérification du statut de demande existante */}
              {hasActiveDeletionRequest() ? (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <div className="flex items-center">
                    <FontAwesomeIcon icon={faQuestionCircle} className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mr-3" />
                    <div>
                      <h4 className="font-medium text-yellow-800 dark:text-yellow-300">
                        Demande en cours
                      </h4>
                      <p className="text-sm text-yellow-700 dark:text-yellow-300">
                        Votre demande de suppression de compte est en cours de traitement par l'administrateur.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                /* Formulaire de demande de suppression */
                <div className="space-y-4">
                  {/* Bouton pour afficher le formulaire de raison */}
                  {!showDeletionReason ? (
                    <Button
                      variant="destructive"
                      onClick={() => setShowDeletionReason(true)}
                      className="w-full"
                    >
                      <FontAwesomeIcon icon={faTrash} className="mr-2 h-4 w-4" />
                      Demander la suppression de mon compte
                    </Button>
                  ) : (
                    /* Formulaire avec raison de suppression */
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="deletion-reason">
                          Raison de la suppression (optionnel)
                        </Label>
                        <textarea
                          id="deletion-reason"
                          value={deletionReason}
                          onChange={(e) => setDeletionReason(e.target.value)}
                          placeholder="Pourquoi souhaitez-vous supprimer votre compte ?"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-800 dark:text-white resize-none"
                          rows={3}
                        />
                      </div>
                      
                      {/* Boutons de confirmation et annulation */}
                      <div className="flex space-x-3">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setShowDeletionReason(false);
                            setDeletionReason('');
                          }}
                          className="flex-1"
                        >
                          Annuler
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={handleAccountDeletionRequest}
                          className="flex-1"
                        >
                          <FontAwesomeIcon icon={faTrash} className="mr-2 h-4 w-4" />
                          Confirmer la demande
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>
    </div>
  );
}