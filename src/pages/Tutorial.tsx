import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBook, 
  faQuestion, 
  faUsers, 
  faGear, 
  faLightbulb,
  faCheck,
  faBell,
  faDownload,
  faPlus,
  faTrash,
  faEdit,
  faEye,
  faCog,
  faChartBar
} from '@fortawesome/free-solid-svg-icons';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import DeviceConnectionsModal from '@/components/DeviceConnectionsModal';

export default function Tutorial() {
  const [notificationSettings, setNotificationSettings] = useState({
    systemOperations: true,
    modelDrift: true,
    clientConnections: false,
    emailAlerts: true,
    predictions: false
  });

  const [showDeviceModal, setShowDeviceModal] = useState(false);

  const handleNotificationChange = (setting: keyof typeof notificationSettings) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  return (
    <div id="tutorial-page" className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center mb-6">
        <FontAwesomeIcon icon={faBook} className="mr-3 text-blue-600 h-8 w-8" />
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Tutoriel AIDataPME Admin
        </h1>
      </div>

      <p className="mb-6 text-gray-600 dark:text-gray-300">
        Guide complet d'utilisation de l'interface d'administration AIDataPME. Trouvez toutes les réponses à vos questions ici.
      </p>

      <Tabs defaultValue="dashboard">
        <TabsList className="mb-6">
          <TabsTrigger value="dashboard">
            <FontAwesomeIcon icon={faUsers} className="mr-2" /> Dashboard
          </TabsTrigger>
          <TabsTrigger value="settings">
            <FontAwesomeIcon icon={faGear} className="mr-2" /> Paramètres
          </TabsTrigger>
          <TabsTrigger value="faq">
            <FontAwesomeIcon icon={faQuestion} className="mr-2" /> FAQ
          </TabsTrigger>
        </TabsList>

        {/* Section Dashboard */}
        <TabsContent value="dashboard">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-semibold">
                Guide du Dashboard
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p>
                Le dashboard vous offre une vue d'ensemble de tous vos clients et leurs performances. 
                Voici comment utiliser efficacement cette section :
              </p>
              
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="metrics">
                  <AccordionTrigger className="text-lg font-medium">
                    Comprendre les métriques principales
                  </AccordionTrigger>
                  <AccordionContent className="space-y-3 pl-4">
                    <p>Les métriques en haut du tableau de bord vous donnent un aperçu rapide de :</p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Nombre total de clients actifs</li>
                      <li>Nombre de modèles actuellement déployés</li>
                      <li>Volume quotidien de prédictions</li>
                      <li>Performance globale du système</li>
                    </ul>
                    <p className="mt-2">Ces indicateurs vous permettent de suivre la santé globale de votre plateforme.</p>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="clients">
                  <AccordionTrigger className="text-lg font-medium">
                    Gestion des clients
                  </AccordionTrigger>
                  <AccordionContent className="space-y-3 pl-4">
                    <p>La liste des clients vous permet de :</p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Visualiser tous vos clients avec leur statut</li>
                      <li>Rechercher un client spécifique</li>
                      <li>Accéder aux détails d'un client en cliquant sur "Voir détails"</li>
                      <li>Identifier rapidement les clients nécessitant une attention particulière</li>
                    </ul>
                    <p className="mt-2">Un code couleur vous aide à identifier l'état des clients :</p>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <span>Actif</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <span>Attention requise</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <span>Inactif</span>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="notifications">
                  <AccordionTrigger className="text-lg font-medium">
                    Système de notifications
                  </AccordionTrigger>
                  <AccordionContent className="space-y-3 pl-4">
                    <p>Le système de notifications vous tient informé en temps réel :</p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Cliquez sur l'icône cloche pour voir vos notifications</li>
                      <li>Un badge rouge indique le nombre de notifications non lues</li>
                      <li>Types de notifications : opérations système, connexions clients, dérive de modèles</li>
                      <li>Marquez les notifications comme lues en cliquant dessus</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Section Paramètres */}
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-semibold">
                Paramètres de l'application
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              
              {/* Paramètres de notifications */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <FontAwesomeIcon icon={faBell} className="mr-2 text-blue-600" />
                  Paramètres de notifications
                </h3>
                <div className="space-y-4 border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="systemOperations"
                      checked={notificationSettings.systemOperations}
                      onCheckedChange={() => handleNotificationChange('systemOperations')}
                    />
                    <label htmlFor="systemOperations" className="text-sm font-medium">
                      Opérations système (importations, exportations)
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="modelDrift"
                      checked={notificationSettings.modelDrift}
                      onCheckedChange={() => handleNotificationChange('modelDrift')}
                    />
                    <label htmlFor="modelDrift" className="text-sm font-medium">
                      Alertes de dérive des modèles
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="clientConnections"
                      checked={notificationSettings.clientConnections}
                      onCheckedChange={() => handleNotificationChange('clientConnections')}
                    />
                    <label htmlFor="clientConnections" className="text-sm font-medium">
                      Connexions et activités clients
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="emailAlerts"
                      checked={notificationSettings.emailAlerts}
                      onCheckedChange={() => handleNotificationChange('emailAlerts')}
                    />
                    <label htmlFor="emailAlerts" className="text-sm font-medium">
                      Alertes par email
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="predictions"
                      checked={notificationSettings.predictions}
                      onCheckedChange={() => handleNotificationChange('predictions')}
                    />
                    <label htmlFor="predictions" className="text-sm font-medium">
                      Notifications de prédictions
                    </label>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <div className="flex items-center space-x-2 mb-3">
                      <Checkbox id="realTime" defaultChecked />
                      <label htmlFor="realTime" className="text-sm font-medium">
                        Activer les notifications en temps réel
                      </label>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setShowDeviceModal(true)}
                    >
                      Voir les connexions récentes / appareils utilisés
                    </Button>
                  </div>
                </div>
              </div>

              {/* Tableau des actions administrateur */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <FontAwesomeIcon icon={faUsers} className="mr-2 text-blue-600" />
                  Actions disponibles pour l'administrateur
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300 rounded-lg">
                    <thead>
                      <tr className="bg-gray-100 dark:bg-gray-700">
                        <th className="border border-gray-300 p-3 text-left font-medium">
                          🛠️ Action
                        </th>
                        <th className="border border-gray-300 p-3 text-left font-medium">
                          💬 Utilité
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-gray-300 p-3">
                          ✅ Modifier les informations
                        </td>
                        <td className="border border-gray-300 p-3">
                          Corriger une adresse e-mail, changer le rôle ou les permissions
                        </td>
                      </tr>
                      <tr className="bg-gray-50 dark:bg-gray-800">
                        <td className="border border-gray-300 p-3">
                          🔒 Réinitialiser le mot de passe
                        </td>
                        <td className="border border-gray-300 p-3">
                          En cas de perte d'accès ou de demande de l'utilisateur
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 p-3">
                          ❌ Supprimer le compte
                        </td>
                        <td className="border border-gray-300 p-3">
                          Si l'utilisateur est inactif ou ne respecte pas les règles
                        </td>
                      </tr>
                      <tr className="bg-gray-50 dark:bg-gray-800">
                        <td className="border border-gray-300 p-3">
                          ⛔ Suspendre / bloquer le compte
                        </td>
                        <td className="border border-gray-300 p-3">
                          Désactiver temporairement l'accès sans suppression définitive
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 p-3">
                          📁 Accéder aux fichiers / projets
                        </td>
                        <td className="border border-gray-300 p-3">
                          Vérifier les contenus créés ou gérés par l'utilisateur
                        </td>
                      </tr>
                      <tr className="bg-gray-50 dark:bg-gray-800">
                        <td className="border border-gray-300 p-3">
                          👀 Consulter les journaux
                        </td>
                        <td className="border border-gray-300 p-3">
                          Voir les actions effectuées : envoi de fichiers, modification de profil, etc.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Section FAQ */}
        <TabsContent value="faq">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-semibold">
                Questions fréquemment posées
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                
                {/* Navigation et interface */}
                <AccordionItem value="faq-navigation">
                  <AccordionTrigger className="text-base font-medium">
                    Comment naviguer dans l'application ?
                  </AccordionTrigger>
                  <AccordionContent className="pl-4">
                    <p>
                      L'application est organisée en plusieurs sections accessibles via le menu latéral :
                      Dashboard (vue d'ensemble), Analytics (statistiques), Companies (gestion des entreprises), 
                      Services (gestion des services), Settings (paramètres), et Tutorial (aide).
                    </p>
                  </AccordionContent>
                </AccordionItem>

                {/* Système de notifications */}
                <AccordionItem value="faq-notifications">
                  <AccordionTrigger className="text-base font-medium">
                    Comment utiliser le système de notifications ?
                  </AccordionTrigger>
                  <AccordionContent className="pl-4">
                    <p>
                      Cliquez sur l'icône cloche <FontAwesomeIcon icon={faBell} className="mx-1" /> en haut à droite 
                      pour voir vos notifications. Un badge rouge indique le nombre de notifications non lues. 
                      Cliquez sur une notification pour la marquer comme lue.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                {/* Export de données */}
                <AccordionItem value="faq-export">
                  <AccordionTrigger className="text-base font-medium">
                    Comment exporter mes données ?
                  </AccordionTrigger>
                  <AccordionContent className="pl-4">
                    <p>
                      Dans la section Analytics, cliquez sur le bouton "Exporter" <FontAwesomeIcon icon={faDownload} className="mx-1" /> 
                      et choisissez le format souhaité : PDF (capture d'écran), CSV (données tabulaires), ou JSON (données structurées). 
                      Le téléchargement se lance automatiquement.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                {/* Gestion des clients */}
                <AccordionItem value="faq-client-add">
                  <AccordionTrigger className="text-base font-medium">
                    Comment ajouter un nouveau client ?
                  </AccordionTrigger>
                  <AccordionContent className="pl-4">
                    <p>
                      Dans la section Companies, cliquez sur "Ajouter une nouvelle entreprise" <FontAwesomeIcon icon={faPlus} className="mx-1" />. 
                      Remplissez le formulaire avec les informations requises : nom, description, pack, contact, 
                      identifiant et ID GCP. Vous pouvez aussi importer un logo.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="faq-client-manage">
                  <AccordionTrigger className="text-base font-medium">
                    Comment gérer les modèles d'un client ?
                  </AccordionTrigger>
                  <AccordionContent className="pl-4">
                    <p>
                      Accédez aux détails du client en cliquant sur "Voir détails" <FontAwesomeIcon icon={faEye} className="mx-1" /> 
                      depuis le Dashboard. Dans l'onglet "Modèles", vous pouvez ajouter, activer/désactiver ou 
                      supprimer des modèles. Le compteur se met à jour automatiquement.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="faq-client-edit">
                  <AccordionTrigger className="text-base font-medium">
                    Comment modifier les informations d'un client ?
                  </AccordionTrigger>
                  <AccordionContent className="pl-4">
                    <p>
                      Dans la liste des entreprises, cliquez sur "Modifier" <FontAwesomeIcon icon={faEdit} className="mx-1" /> 
                      sur la carte du client. Vous pouvez modifier toutes les informations : nom, description, 
                      contact, pack, logo et ID GCP.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="faq-client-delete">
                  <AccordionTrigger className="text-base font-medium">
                    Comment supprimer un client ?
                  </AccordionTrigger>
                  <AccordionContent className="pl-4">
                    <p>
                      Cliquez sur "Supprimer" <FontAwesomeIcon icon={faTrash} className="mx-1" /> sur la carte du client. 
                      Le client est déplacé vers la corbeille. Vous pouvez le restaurer ou le supprimer définitivement 
                      depuis l'onglet "Corbeille".
                    </p>
                  </AccordionContent>
                </AccordionItem>

                {/* Graphiques et métriques */}
                <AccordionItem value="faq-metrics">
                  <AccordionTrigger className="text-base font-medium">
                    Que signifient les différentes métriques ?
                  </AccordionTrigger>
                  <AccordionContent className="pl-4">
                    <ul className="list-disc pl-6 space-y-2">
                      <li><strong>Total Clients :</strong> Nombre d'entreprises actives dans votre portefeuille</li>
                      <li><strong>Modèles Actifs :</strong> Nombre de modèles d'IA actuellement en fonctionnement</li>
                      <li><strong>Modèles Déployés :</strong> Nombre total de modèles installés (actifs + inactifs)</li>
                      <li><strong>Performance :</strong> Indicateur global de la santé de vos modèles</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="faq-charts">
                  <AccordionTrigger className="text-base font-medium">
                    Comment interpréter les graphiques ?
                  </AccordionTrigger>
                  <AccordionContent className="pl-4">
                    <p>
                      Les graphiques Analytics affichent l'évolution temporelle de vos données. 
                      Le graphique des prédictions montre l'activité sur 24h, permettant d'identifier les pics d'utilisation. 
                      L'activité par client aide à identifier les clients les plus actifs.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                {/* Suivi des modèles */}
                <AccordionItem value="faq-model-tracking">
                  <AccordionTrigger className="text-base font-medium">
                    Comment suivre les performances d'un modèle ?
                  </AccordionTrigger>
                  <AccordionContent className="pl-4">
                    <p>
                      Cliquez sur un modèle depuis la page client pour accéder à son interface de suivi dédiée. 
                      Vous y trouverez des métriques détaillées, des graphiques de performance, la matrice de confusion, 
                      et l'historique des prédictions. Un bouton d'export CSV est disponible.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="faq-model-drift">
                  <AccordionTrigger className="text-base font-medium">
                    Qu'est-ce que la dérive de modèle (drift) ?
                  </AccordionTrigger>
                  <AccordionContent className="pl-4">
                    <p>
                      La dérive de modèle survient quand les performances d'un modèle d'IA diminuent avec le temps, 
                      souvent due à des changements dans les données d'entrée. Le système vous alerte automatiquement 
                      via les notifications quand une dérive est détectée.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                {/* Services et paramètres */}
                <AccordionItem value="faq-services">
                  <AccordionTrigger className="text-base font-medium">
                    Comment gérer les services ?
                  </AccordionTrigger>
                  <AccordionContent className="pl-4">
                    <p>
                      La section Services <FontAwesomeIcon icon={faCog} className="mx-1" /> permet de configurer 
                      les différents services offerts à vos clients : diagnostic, prototype, déploiement, et abonnement. 
                      Vous pouvez modifier les tarifs, descriptions et fonctionnalités.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="faq-settings">
                  <AccordionTrigger className="text-base font-medium">
                    Comment configurer mes paramètres ?
                  </AccordionTrigger>
                  <AccordionContent className="pl-4">
                    <p>
                      Dans Settings, vous pouvez modifier votre profil, changer votre mot de passe, 
                      configurer les notifications, et ajuster les préférences d'affichage. 
                      Les paramètres de sécurité incluent l'authentification à deux facteurs.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                {/* Résolution de problèmes */}
                <AccordionItem value="faq-error">
                  <AccordionTrigger className="text-base font-medium">
                    Que faire en cas d'erreur ?
                  </AccordionTrigger>
                  <AccordionContent className="pl-4">
                    <p>
                      En cas d'erreur, vérifiez d'abord votre connexion internet. Si le problème persiste, 
                      consultez les notifications pour des messages d'erreur spécifiques. 
                      Contactez le support technique à support@aidatapme.fr avec une description détaillée.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="faq-slow">
                  <AccordionTrigger className="text-base font-medium">
                    L'application est lente, que faire ?
                  </AccordionTrigger>
                  <AccordionContent className="pl-4">
                    <p>
                      Si l'application est lente, videz le cache de votre navigateur, vérifiez votre connexion internet, 
                      ou essayez de rafraîchir la page. Pour les gros volumes de données, 
                      utilisez les fonctions d'export pour analyser les données hors ligne.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                {/* GCP et intégrations */}
                <AccordionItem value="faq-gcp">
                  <AccordionTrigger className="text-base font-medium">
                    Comment connecter un projet Google Cloud Platform ?
                  </AccordionTrigger>
                  <AccordionContent className="pl-4">
                    <p>
                      Lors de la création d'une entreprise, saisissez l'ID GCP dans le champ dédié. 
                      Cela permet la synchronisation automatique des modèles, l'accès aux métriques BigQuery, 
                      et la gestion des buckets de stockage.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="faq-upload">
                  <AccordionTrigger className="text-base font-medium">
                    Comment importer un logo ou un fichier ?
                  </AccordionTrigger>
                  <AccordionContent className="pl-4">
                    <p>
                      Cliquez sur "Importer" à côté du champ logo lors de la création/modification d'une entreprise. 
                      Sélectionnez un fichier PNG, JPG ou SVG. Le logo apparaîtra automatiquement dans toutes 
                      les interfaces liées à cette entreprise.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                {/* Support */}
                <AccordionItem value="faq-support">
                  <AccordionTrigger className="text-base font-medium">
                    Comment contacter le support technique ?
                  </AccordionTrigger>
                  <AccordionContent className="pl-4">
                    <p>
                      Contactez notre équipe de support à <strong>support@aidatapme.fr</strong> ou par téléphone au 
                     <strong> 01 23 45 67 89</strong> du lundi au vendredi de 9h à 18h. 
                      Préparez une description détaillée du problème et vos informations de connexion.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="faq-password">
                  <AccordionTrigger className="text-base font-medium">
                    Comment modifier mon mot de passe administrateur ?
                  </AccordionTrigger>
                  <AccordionContent className="pl-4">
                    <p>
                      Accédez à Settings → Sécurité, puis cliquez sur "Modifier le mot de passe". 
                      Saisissez votre mot de passe actuel, puis votre nouveau mot de passe deux fois pour confirmation. 
                      Utilisez un mot de passe fort avec majuscules, minuscules, chiffres et symboles.
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg p-4 mt-6">
                <div className="flex">
                  <FontAwesomeIcon icon={faQuestion} className="text-blue-600 h-5 w-5 mt-0.5 mr-3" />
                  <div>
                    <h4 className="font-semibold mb-1">Besoin d'aide supplémentaire ?</h4>
                    <p className="text-sm">
                      Si vous ne trouvez pas la réponse à votre question, n'hésitez pas à consulter notre 
                      documentation complète ou à contacter directement notre service client.
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Button variant="outline" size="sm" className="text-blue-600 border-blue-600">
                        Consulter la documentation
                      </Button>
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                        Contacter le support
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Device Connections Modal */}
      <DeviceConnectionsModal
        open={showDeviceModal}
        onOpenChange={setShowDeviceModal}
      />
    </div>
  );
}
