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
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 dark:border-blue-800 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 bg-blue-600 dark:bg-blue-400 rounded-full animate-pulse"></div>
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-300 mt-4 text-lg">Chargement des données...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header avec nom de l'entreprise et photo de profil */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <img 
              src={user?.profileImage || '/placeholder.svg'} 
              alt="Photo de profil" 
              className="h-16 w-16 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => document.getElementById('profile-image-upload')?.click()}
            />
            <input
              id="profile-image-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    if (event.target?.result) {
                      // Mise à jour de l'image de profil dans le contexte utilisateur
                      updateProfile({ profileImage: event.target.result as string });
                    }
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />
            <div className="absolute -bottom-1 -right-1 h-5 w-5 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors">
              <FontAwesomeIcon icon={faCamera} className="h-3 w-3 text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Client : {user?.company}
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Tableau de bord • Dernière mise à jour: {new Date().toLocaleString('fr-FR')}
            </p>
          </div>
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
