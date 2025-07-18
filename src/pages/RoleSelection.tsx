import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, User } from 'lucide-react';

export default function RoleSelection() {
  const navigate = useNavigate();

  const handleRoleSelection = (role: 'admin' | 'client') => {
    navigate(`/login?role=${role}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Bienvenue
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Choisissez votre type d'accès pour continuer
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Admin Card */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-blue-500">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-4">
                <Shield className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle className="text-2xl text-gray-900 dark:text-white">
                Espace Administrateur
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-gray-600 dark:text-gray-300">
                Accédez au tableau de bord administrateur pour gérer les modèles, 
                les clients et suivre les performances globales.
              </p>
              <Button 
                onClick={() => handleRoleSelection('admin')}
                className="w-full"
                size="lg"
              >
                Accès Administrateur
              </Button>
            </CardContent>
          </Card>

          {/* Client Card */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-green-500">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-4">
                <User className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle className="text-2xl text-gray-900 dark:text-white">
                Espace Client
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-gray-600 dark:text-gray-300">
                Accédez à votre tableau de bord personnel pour faire des prédictions 
                et suivre vos modèles.
              </p>
              <Button 
                onClick={() => handleRoleSelection('client')}
                className="w-full"
                variant="outline"
                size="lg"
              >
                Accès Client
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}