import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faUserTie, faRobot } from '@fortawesome/free-solid-svg-icons';

const Index = () => {
  const navigate = useNavigate();

  const handleClientAccess = () => {
    navigate('/login?type=client');
  };

  const handleAdminAccess = () => {
    navigate('/login?type=admin');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-white dark:bg-gray-800 rounded-full p-4 shadow-lg">
              <FontAwesomeIcon icon={faRobot} className="h-12 w-12 text-blue-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            IADataPME
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Plateforme d'Intelligence Artificielle pour les PME
          </p>
        </div>

        {/* Choix d'accès */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Espace Client */}
          <Card className="hover:shadow-xl transition-shadow duration-300 border-2 hover:border-blue-300 dark:hover:border-blue-600">
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4">
                <div className="bg-blue-100 dark:bg-blue-900/30 rounded-full p-6">
                  <FontAwesomeIcon icon={faUser} className="h-12 w-12 text-blue-600" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                Espace Client
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Accédez à vos modèles IA, consultez vos prédictions et gérez vos données en toute sécurité
              </p>
              <ul className="text-left space-y-2 mb-6 text-gray-600 dark:text-gray-400">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                  Dashboard personnalisé
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                  Prédictions et analyses
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                  Suivi des performances
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                  Support et feedback
                </li>
              </ul>
              <Button 
                onClick={handleClientAccess}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                size="lg"
              >
                Accéder à l'Espace Client
              </Button>
            </CardContent>
          </Card>

          {/* Espace Administration */}
          <Card className="hover:shadow-xl transition-shadow duration-300 border-2 hover:border-purple-300 dark:hover:border-purple-600">
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4">
                <div className="bg-purple-100 dark:bg-purple-900/30 rounded-full p-6">
                  <FontAwesomeIcon icon={faUserTie} className="h-12 w-12 text-purple-600" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                Espace Administration
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Gérez vos clients, supervisez les modèles IA et administrez la plateforme
              </p>
              <ul className="text-left space-y-2 mb-6 text-gray-600 dark:text-gray-400">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-purple-600 rounded-full mr-3"></span>
                  Gestion des clients
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-purple-600 rounded-full mr-3"></span>
                  Supervision des modèles
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-purple-600 rounded-full mr-3"></span>
                  Analytics et reporting
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-purple-600 rounded-full mr-3"></span>
                  Configuration système
                </li>
              </ul>
              <Button 
                onClick={handleAdminAccess}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                size="lg"
              >
                Accéder à l'Administration
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center mt-12">
          <p className="text-gray-500 dark:text-gray-400">
            © 2024 IADataPME - Solution IA pour les PME
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;