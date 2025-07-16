import { useAuth } from '@/contexts/AuthContext';
import { useClient } from '@/contexts/ClientContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faEuroSign, 
  faChartLine, 
  faBoxes, 
  faClock 
} from '@fortawesome/free-solid-svg-icons';

export default function ClientDashboard() {
  const { user } = useAuth();
  const { clientData, isLoading } = useClient();

  if (isLoading || !clientData) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-center">
          <FontAwesomeIcon icon={faClock} className="h-8 w-8 text-blue-600 mb-4 animate-spin" />
          <p className="text-gray-600 dark:text-gray-300">Chargement des données...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header avec nom de l'entreprise */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {user?.companyLogo && (
            <img 
              src={user.companyLogo} 
              alt="Logo entreprise" 
              className="h-16 w-16 rounded-lg object-cover border border-gray-200 dark:border-gray-700"
            />
          )}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Client : {user?.company}
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Tableau de bord • Dernière mise à jour: {new Date().toLocaleString('fr-FR')}
            </p>
          </div>
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
              Amélioration Moyenne
            </CardTitle>
            <FontAwesomeIcon icon={faChartLine} className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {clientData.metrics.avgImprovement}%
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              D'efficacité globale
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
              Uptime
            </CardTitle>
            <FontAwesomeIcon icon={faClock} className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {clientData.metrics.uptime}%
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Disponibilité système
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tableau des économies réalisées */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Économies réalisées par l'IA sur l'année écoulée
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                    Catégorie
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                    Économie Annuelle
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                    Amélioration
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody>
                {clientData.savings.map((item, index) => (
                  <tr key={index} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="py-3 px-4 text-gray-900 dark:text-white font-medium">
                      {item.category}
                    </td>
                    <td className="py-3 px-4 text-green-600 font-semibold">
                      {item.annualSaving.toLocaleString('fr-FR')} €
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300">
                        +{item.improvement}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400 text-sm">
                      {item.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Graphique statique (placeholder) */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Comparaison : Gestion des stocks avec vs sans IA
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <FontAwesomeIcon icon={faChartLine} className="h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                Graphique en cours de développement
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                Visualisation comparative des performances
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}