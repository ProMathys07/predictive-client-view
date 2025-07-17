import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faEnvelope, faEye, faEyeSlash, faBuilding, faExclamationTriangle, faInfoCircle, faUser, faUserTie, faArrowLeft, faRobot } from '@fortawesome/free-solid-svg-icons';
import { useToast } from '@/hooks/use-toast';

// Page de connexion pour l'administration
export default function Login() {
  const [searchParams] = useSearchParams();
  const loginType = searchParams.get('type') || 'client';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login, isLocked, lockTimeRemaining, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Redirection si déjà connecté
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/client/dashboard');
      }
    }
  }, [isAuthenticated, user, navigate]);

  // Gestion connexion
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLocked) {
      toast({
        title: "Compte temporairement verrouillé",
        description: `Trop de tentatives échouées. Veuillez réessayer dans ${lockTimeRemaining} secondes.`,
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);

    try {
      const success = await login(email, password, loginType as 'admin' | 'client');
      if (success) {
        toast({
          title: "Connexion réussie",
          description: `Bienvenue ${loginType === 'admin' ? 'Administrateur' : 'Client'}`,
        });
        // La redirection se fait automatiquement via useEffect
      } else {
        toast({
          title: "Erreur de connexion",
          description: "Email ou mot de passe incorrect",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de la connexion",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Formater le temps restant en format minutes:secondes
  const formatRemainingTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <Button
            variant="ghost"
            onClick={handleBackToHome}
            className="mb-4 text-blue-600 hover:text-blue-700"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2 h-4 w-4" />
            Retour à l'accueil
          </Button>
          
          <div className="flex items-center justify-center mb-4">
            <div className="bg-white dark:bg-gray-800 rounded-full p-4 shadow-lg">
              <FontAwesomeIcon icon={faRobot} className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {loginType === 'admin' ? 'Administration' : 'Espace Client'}
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            {loginType === 'admin' 
              ? 'Connectez-vous pour administrer la plateforme' 
              : 'Connectez-vous à votre espace personnalisé'
            }
          </p>
        </div>

        {/* Formulaire de connexion */}
        <Card className="shadow-xl border-2">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-4">
              <div className={`rounded-full p-4 ${
                loginType === 'admin' 
                  ? 'bg-purple-100 dark:bg-purple-900/30' 
                  : 'bg-blue-100 dark:bg-blue-900/30'
              }`}>
                <FontAwesomeIcon 
                  icon={loginType === 'admin' ? faUserTie : faUser} 
                  className={`h-8 w-8 ${
                    loginType === 'admin' ? 'text-purple-600' : 'text-blue-600'
                  }`} 
                />
              </div>
            </div>
            <CardTitle className="text-xl">
              Connexion {loginType === 'admin' ? 'Administrateur' : 'Client'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLocked ? (
              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800 mb-6">
                <div className="flex items-start">
                  <FontAwesomeIcon icon={faExclamationTriangle} className="h-5 w-5 text-red-600 dark:text-red-400 mr-3 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium text-red-800 dark:text-red-300">Compte temporairement verrouillé</h3>
                    <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                      Trop de tentatives de connexion échouées. Veuillez réessayer dans {formatRemainingTime(lockTimeRemaining)}.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <FontAwesomeIcon icon={faEnvelope} className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder={loginType === 'admin' ? 'admin@aidatapme.com' : 'votre-email@entreprise.com'}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Mot de passe</Label>
                  <div className="relative">
                    <FontAwesomeIcon icon={faLock} className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Votre mot de passe"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <FontAwesomeIcon 
                        icon={showPassword ? faEyeSlash : faEye} 
                        className="h-4 w-4 text-gray-400" 
                      />
                    </Button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className={`w-full ${
                    loginType === 'admin' 
                      ? 'bg-purple-600 hover:bg-purple-700' 
                      : 'bg-blue-600 hover:bg-blue-700'
                  } text-white`}
                  disabled={isLoading}
                >
                  {isLoading ? 'Connexion...' : 'Se connecter'}
                </Button>
              </form>
            )}
            
            {/* Informations de test */}
            <div className={`mt-4 p-3 rounded-lg border ${
              loginType === 'admin' 
                ? 'bg-purple-50 dark:bg-purple-900/20 border-purple-100 dark:border-purple-800' 
                : 'bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800'
            }`}>
              <div className="flex items-start">
                <FontAwesomeIcon 
                  icon={faInfoCircle} 
                  className={`h-4 w-4 mr-2 mt-0.5 ${
                    loginType === 'admin' 
                      ? 'text-purple-600 dark:text-purple-400' 
                      : 'text-blue-600 dark:text-blue-400'
                  }`} 
                />
                <div>
                  <p className={`text-xs font-medium ${
                    loginType === 'admin' 
                      ? 'text-purple-700 dark:text-purple-300' 
                      : 'text-blue-700 dark:text-blue-300'
                  }`}>
                    Comptes de test :
                  </p>
                  <div className={`text-xs ${
                    loginType === 'admin' 
                      ? 'text-purple-600 dark:text-purple-300' 
                      : 'text-blue-600 dark:text-blue-300'
                  }`}>
                    {loginType === 'admin' ? (
                      <p>admin@aidatapme.com / admin123</p>
                    ) : (
                      <div className="space-y-1">
                        <p>client@technosolutions.fr / client123</p>
                        <p>client@innovacorp.fr / client123</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Info sécurité */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-3 rounded-lg border border-gray-200 dark:border-gray-700 max-w-md text-center">
          <p className="text-xs text-gray-600 dark:text-gray-400">
            <FontAwesomeIcon icon={faExclamationTriangle} className="mr-1" />
            Après 3 tentatives échouées, le compte sera verrouillé pendant 2 minutes.
          </p>
        </div>
      </div>
    </div>
  );
}