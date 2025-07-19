import { useAuth } from '@/contexts/AuthContext';
import { useClient } from '@/contexts/ClientContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faEuroSign, 
  faChartLine, 
  faBoxes, 
  faClock,
  faCamera,
  faQuestionCircle 
} from '@fortawesome/free-solid-svg-icons';
import { Button } from '@/components/ui/button';
import ClientNotificationBell from '@/components/ClientNotificationBell';
import PredictionChart from '@/components/PredictionChart';

export default function ClientDashboard() {
  const { user, updateProfile } = useAuth();
  const { clientData, isLoading } = useClient();

  if (isLoading || !clientData) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen bg-background">
        <div className="text-center space-y-6">
          {/* Logo/Icon */}
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
            <FontAwesomeIcon icon={faChartLine} className="h-8 w-8 text-white" />
          </div>
          
          {/* Progress Bar Container */}
          <div className="w-80 mx-auto">
            <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-1000 ease-out animate-pulse"
                style={{
                  width: '100%',
                  animation: 'loading-progress 2s ease-in-out infinite'
                }}
              />
            </div>
          </div>
          
          {/* Loading Text */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Chargement des données
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Préparation de votre tableau de bord...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard Client
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Tableau de bord • Dernière mise à jour: {new Date().toLocaleString('fr-FR')}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          {/* Bouton pour nettoyer les notifications client */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              // Nettoyer les notifications client dans le localStorage
              localStorage.removeItem('client_notifications');
              // Réinitialiser les notifications dans le state
              window.dispatchEvent(new CustomEvent('clearClientNotifications'));
            }}
            className="text-red-600 border-red-200 hover:bg-red-50"
          >
            🗑️ Nettoyer notifications
          </Button>
          <ClientNotificationBell />
        </div>
      </div>

      {/* Métriques principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Économies Totales
            </CardTitle>
            <FontAwesomeIcon icon={faEuroSign} className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {clientData.metrics.totalSavings.toLocaleString('fr-FR')} €
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Sur l'année écoulée
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Précision Globale
            </CardTitle>
            <FontAwesomeIcon icon={faChartLine} className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {clientData.metrics.avgImprovement}%
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              De précision moyenne
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Modèles Actifs
            </CardTitle>
            <FontAwesomeIcon icon={faBoxes} className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {clientData.metrics.activeModels}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              En fonctionnement
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Prédictions Totales
            </CardTitle>
            <FontAwesomeIcon icon={faClock} className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {clientData.metrics.uptime}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Prédictions effectuées
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Graphique de Performance */}
      <PredictionChart />


      {/* Tableau des Dernières Prédictions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Dernières Prédictions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                    Date/Heure
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                    Type de modèle
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                    Confiance
                  </th>
                </tr>
              </thead>
              <tbody>
                {clientData.recentPredictions?.map((prediction, index) => (
                  <tr key={index} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="py-3 px-4 text-gray-900 dark:text-white">
                      {new Date(prediction.date).toLocaleDateString('fr-FR', { 
                        day: '2-digit', 
                        month: '2-digit', 
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                      {prediction.modelType}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        prediction.confidence >= 80 ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300' :
                        prediction.confidence >= 60 ? 'bg-amber-100 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300' :
                        'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300'
                      }`}>
                        {prediction.confidence}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
