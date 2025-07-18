import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBuilding, faUser } from '@fortawesome/free-solid-svg-icons';

export default function RoleSelection() {
  const navigate = useNavigate();

  const handleRoleSelection = (role: 'admin' | 'client') => {
    navigate(`/login?role=${role}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Bienvenue sur AIDataPME
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Choisissez votre type d'accès
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Rectangle Admin */}
          <Card 
            className="shadow-lg cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 border-2 hover:border-blue-500"
            onClick={() => handleRoleSelection('admin')}
          >
            <CardHeader className="text-center space-y-4 pb-6">
              <div className="flex items-center justify-center mb-4">
                <FontAwesomeIcon icon={faBuilding} className="h-16 w-16 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                Admin
              </CardTitle>
              <p className="text-gray-600 dark:text-gray-300">
                Accès administrateur AIDataPME
              </p>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Gestion complète de la plateforme
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Rectangle Client */}
          <Card 
            className="shadow-lg cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 border-2 hover:border-green-500"
            onClick={() => handleRoleSelection('client')}
          >
            <CardHeader className="text-center space-y-4 pb-6">
              <div className="flex items-center justify-center mb-4">
                <FontAwesomeIcon icon={faUser} className="h-16 w-16 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                Client
              </CardTitle>
              <p className="text-gray-600 dark:text-gray-300">
                Espace client sécurisé
              </p>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Accès à vos prédictions et données
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}