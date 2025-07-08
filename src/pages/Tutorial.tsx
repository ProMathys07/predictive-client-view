
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBook, 
  faQuestion, 
  faUsers, 
  faChartBar, 
  faGear, 
  faLightbulb,
  faArrowRight,
  faPlay,
  faClipboard,
  faCheck
} from '@fortawesome/free-solid-svg-icons';
import { Button } from '@/components/ui/button';

export default function Tutorial() {
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Fonction pour copier du texte dans le presse-papier
  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => setCopiedText(null), 2000);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center mb-6">
        <FontAwesomeIcon icon={faBook} className="mr-3 text-blue-600 h-8 w-8" />
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Tutoriel AIDataPME Admin
        </h1>
      </div>

      <p className="mb-6 text-gray-600 dark:text-gray-300">
        Bienvenue dans le tutoriel de l'interface d'administration AIDataPME. Ce guide vous aidera à comprendre comment utiliser toutes les fonctionnalités disponibles.
      </p>

      <Tabs defaultValue="getting-started">
        <TabsList className="mb-6">
          <TabsTrigger value="getting-started">
            <FontAwesomeIcon icon={faLightbulb} className="mr-2" /> Démarrage
          </TabsTrigger>
          <TabsTrigger value="dashboard">
            <FontAwesomeIcon icon={faUsers} className="mr-2" /> Dashboard
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <FontAwesomeIcon icon={faChartBar} className="mr-2" /> Analytics
          </TabsTrigger>
          <TabsTrigger value="settings">
            <FontAwesomeIcon icon={faGear} className="mr-2" /> Paramètres
          </TabsTrigger>
          <TabsTrigger value="faq">
            <FontAwesomeIcon icon={faQuestion} className="mr-2" /> FAQ
          </TabsTrigger>
        </TabsList>

        {/* Section Démarrage */}
        <TabsContent value="getting-started">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-semibold">
                Premiers pas avec AIDataPME Admin
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Bienvenue sur votre plateforme d'administration</h2>
                <p>
                  L'interface d'administration AIDataPME vous permet de gérer l'ensemble des clients, 
                  de suivre leurs modèles d'IA et de surveiller leurs performances.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
                    <div className="flex items-center mb-3">
                      <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">
                        1
                      </div>
                      <h3 className="font-semibold">Se connecter</h3>
                    </div>
                    <p className="text-sm">Utilisez vos identifiants admin pour accéder au tableau de bord.</p>
                  </div>
                  
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
                    <div className="flex items-center mb-3">
                      <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">
                        2
                      </div>
                      <h3 className="font-semibold">Explorer</h3>
                    </div>
                    <p className="text-sm">Familiarisez-vous avec l'interface et ses différentes sections.</p>
                  </div>
                  
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
                    <div className="flex items-center mb-3">
                      <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">
                        3
                      </div>
                      <h3 className="font-semibold">Gérer</h3>
                    </div>
                    <p className="text-sm">Commencez à gérer vos clients et leurs modèles d'IA.</p>
                  </div>
                </div>
                
                <div className="my-6">
                  <h3 className="text-lg font-semibold mb-3">Vidéo d'introduction</h3>
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 flex flex-col items-center justify-center">
                    <FontAwesomeIcon icon={faPlay} className="h-12 w-12 text-blue-600 mb-3" />
                    <p className="text-center">Visionnez notre tutoriel vidéo pour une prise en main rapide</p>
                    <Button className="mt-3 bg-blue-600 hover:bg-blue-700">
                      Regarder le tutoriel <FontAwesomeIcon icon={faPlay} className="ml-2" />
                    </Button>
                  </div>
                </div>
                
                <div className="my-6">
                  <h3 className="text-lg font-semibold mb-3">Guide rapide</h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <FontAwesomeIcon icon={faArrowRight} className="text-blue-600 mr-2" />
                      <span>Accédez au Dashboard pour voir un aperçu général des clients</span>
                    </div>
                    <div className="flex items-center">
                      <FontAwesomeIcon icon={faArrowRight} className="text-blue-600 mr-2" />
                      <span>Consultez la page Analytics pour des statistiques détaillées</span>
                    </div>
                    <div className="flex items-center">
                      <FontAwesomeIcon icon={faArrowRight} className="text-blue-600 mr-2" />
                      <span>Modifiez vos paramètres personnels dans la section Paramètres</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

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
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="chart">
                  <AccordionTrigger className="text-lg font-medium">
                    Analyse des graphiques
                  </AccordionTrigger>
                  <AccordionContent className="space-y-3 pl-4">
                    <p>Le graphique des prédictions vous permet de :</p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Visualiser l'activité des prédictions sur les dernières 24h</li>
                      <li>Identifier les pics d'activité et planifier les ressources en conséquence</li>
                      <li>Détecter les anomalies dans l'utilisation du service</li>
                    </ul>
                    <p className="mt-2">Pour une analyse plus approfondie, consultez la page Analytics.</p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mt-6">
                <div className="flex items-start">
                  <FontAwesomeIcon icon={faLightbulb} className="text-yellow-600 h-5 w-5 mt-0.5 mr-3" />
                  <div>
                    <h4 className="font-semibold mb-1">Astuce pro</h4>
                    <p className="text-sm">
                      Utilisez la recherche rapide pour trouver instantanément un client spécifique parmi votre liste.
                      Pour des analyses plus détaillées, n'hésitez pas à exporter vos données via la page Analytics.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 mt-4">
                <h4 className="font-semibold mb-2">Code d'exemple pour l'API</h4>
                <div className="bg-gray-800 text-gray-100 p-3 rounded-md relative overflow-hidden">
                  <pre className="text-sm overflow-x-auto">
                    <code>
                      {`// Exemple de requête vers l'API AIDataPME
fetch('https://api.aidatapme.fr/v1/clients', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  }
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Erreur:', error));`}
                    </code>
                  </pre>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => copyToClipboard(`// Exemple de requête vers l'API AIDataPME
fetch('https://api.aidatapme.fr/v1/clients', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  }
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Erreur:', error));`, 'api-code')}
                  >
                    <FontAwesomeIcon 
                      icon={copiedText === 'api-code' ? faCheck : faClipboard} 
                      className="mr-1" 
                    />
                    {copiedText === 'api-code' ? 'Copié' : 'Copier'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Section Analytics */}
        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-semibold">
                Guide des Analytics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p>
                La section Analytics vous offre des statistiques détaillées et des visualisations avancées pour 
                analyser les performances de vos modèles et l'activité de vos clients.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <h3 className="font-semibold text-lg mb-3">Analyse des performances</h3>
                  <p className="text-sm mb-3">
                    Suivez l'évolution des performances de vos modèles dans le temps et identifiez 
                    les opportunités d'amélioration.
                  </p>
                  <ul className="list-disc pl-6 space-y-1 text-sm">
                    <li>Précision des prédictions</li>
                    <li>Temps de réponse moyens</li>
                    <li>Taux d'utilisation par client</li>
                    <li>Comparaison entre différents modèles</li>
                  </ul>
                </div>
                
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <h3 className="font-semibold text-lg mb-3">Suivi d'activité</h3>
                  <p className="text-sm mb-3">
                    Visualisez l'activité de vos clients et l'utilisation de la plateforme 
                    pour optimiser votre offre de service.
                  </p>
                  <ul className="list-disc pl-6 space-y-1 text-sm">
                    <li>Volume de prédictions par période</li>
                    <li>Heures de pointe d'utilisation</li>
                    <li>Distribution des requêtes par client</li>
                    <li>Tendances d'utilisation mensuelles</li>
                  </ul>
                </div>
              </div>
              
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">
                <h3 className="font-semibold text-lg mb-4">Exportation des données</h3>
                <p className="mb-4">
                  Vous pouvez exporter vos données analytiques dans différents formats pour une analyse plus approfondie 
                  avec d'autres outils.
                </p>
                
                <div className="flex flex-wrap gap-3">
                  <Button variant="outline" className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faClipboard} />
                    Exporter en CSV
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faClipboard} />
                    Exporter en Excel
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faClipboard} />
                    Exporter en PDF
                  </Button>
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
                <AccordionItem value="faq-1">
                  <AccordionTrigger className="text-base font-medium">
                    Comment ajouter un nouveau client ?
                  </AccordionTrigger>
                  <AccordionContent className="pl-4">
                    <p>
                      Pour ajouter un nouveau client, rendez-vous sur le Dashboard et cliquez sur le bouton "Ajouter un client" 
                      en haut à droite de la liste des clients. Remplissez les informations requises dans le formulaire qui 
                      apparaît et validez.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="faq-2">
                  <AccordionTrigger className="text-base font-medium">
                    Comment gérer les modèles d'un client ?
                  </AccordionTrigger>
                  <AccordionContent className="pl-4">
                    <p>
                      Accédez d'abord à la page de détails du client en cliquant sur "Voir détails" depuis le Dashboard. 
                      Dans la section "Modèles", vous pouvez activer/désactiver des modèles, en ajouter de nouveaux ou 
                      supprimer des modèles existants.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="faq-3">
                  <AccordionTrigger className="text-base font-medium">
                    Comment interpréter les métriques de performance ?
                  </AccordionTrigger>
                  <AccordionContent className="pl-4">
                    <p>
                      Les métriques de performance indiquent la précision des modèles d'IA déployés. Une valeur élevée (proche de 100%) 
                      indique une grande fiabilité des prédictions. Si vous observez une baisse soudaine de performance, cela peut 
                      indiquer un problème avec le modèle ou avec les données d'entrée.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="faq-4">
                  <AccordionTrigger className="text-base font-medium">
                    Comment modifier mon mot de passe administrateur ?
                  </AccordionTrigger>
                  <AccordionContent className="pl-4">
                    <p>
                      Accédez à la page "Paramètres" depuis le menu latéral, puis sélectionnez l'onglet "Sécurité". 
                      Vous pourrez y modifier votre mot de passe en saisissant votre mot de passe actuel puis votre nouveau mot de passe.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="faq-5">
                  <AccordionTrigger className="text-base font-medium">
                    Comment contacter le support technique ?
                  </AccordionTrigger>
                  <AccordionContent className="pl-4">
                    <p>
                      En cas de problème technique ou de question, vous pouvez contacter notre équipe de support à l'adresse 
                      <span className="font-medium"> support@aidatapme.fr</span> ou par téléphone au 
                      <span className="font-medium"> 01 23 45 67 89</span> du lundi au vendredi de 9h à 18h.
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
    </div>
  );
}
