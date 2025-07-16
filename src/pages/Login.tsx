
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faEnvelope, faEye, faEyeSlash, faBuilding, faExclamationTriangle, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { useToast } from '@/hooks/use-toast';

// Page de connexion pour l'administration
export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login, isLocked, lockTimeRemaining } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Gestion de la soumission du formulaire de connexion
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Vérifier si le compte est verrouillé
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
      // Tentative de connexion avec les identifiants fournis
      const success = await login(email, password);
      if (success) {
        toast({
          title: "Connexion réussie",
          description: "Bienvenue dans l'interface d'administration AIDataPME",
        });
        navigate('/');
      } 
      // Les erreurs sont maintenant gérées dans le contexte Auth
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la connexion",
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Bloc Admin */}
        <Card className="shadow-lg">
          <CardHeader className="text-center space-y-4 pb-6">
            <div className="flex items-center justify-center mb-4">
              <FontAwesomeIcon icon={faBuilding} className="h-12 w-12 text-blue-600 dark:text-blue-400" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
              Administration
            </CardTitle>
            <p className="text-gray-600 dark:text-gray-300">
              Accès administrateur AIDataPME
            </p>
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
                  <Label htmlFor="admin-email">Email</Label>
                  <div className="relative">
                    <FontAwesomeIcon icon={faEnvelope} className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="admin-email"
                      type="email"
                      placeholder="admin@aidatapme.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="admin-password">Mot de passe</Label>
                  <div className="relative">
                    <FontAwesomeIcon icon={faLock} className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="admin-password"
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
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={isLoading}
                >
                  {isLoading ? 'Connexion...' : 'Accès Admin'}
                </Button>
              </form>
            )}

            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
              <div className="flex items-start">
                <FontAwesomeIcon icon={faInfoCircle} className="h-4 w-4 text-blue-600 dark:text-blue-400 mr-2 mt-0.5" />
                <div>
                  <p className="text-xs text-blue-700 dark:text-blue-300 font-medium">Admin :</p>
                  <p className="text-xs text-blue-600 dark:text-blue-300">admin@aidatapme.com / admin123</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bloc Client */}
        <Card className="shadow-lg">
          <CardHeader className="text-center space-y-4 pb-6">
            <div className="flex items-center justify-center mb-4">
              <FontAwesomeIcon icon={faBuilding} className="h-12 w-12 text-green-600 dark:text-green-400" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
              Espace Client
            </CardTitle>
            <p className="text-gray-600 dark:text-gray-300">
              Accès client sécurisé
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="client-email">Email</Label>
                <div className="relative">
                  <FontAwesomeIcon icon={faEnvelope} className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="client-email"
                    type="email"
                    placeholder="votre-email@entreprise.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="client-password">Mot de passe</Label>
                <div className="relative">
                  <FontAwesomeIcon icon={faLock} className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="client-password"
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
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={isLoading}
              >
                {isLoading ? 'Connexion...' : 'Accès Client'}
              </Button>
            </form>

            <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-800">
              <div className="flex items-start">
                <FontAwesomeIcon icon={faInfoCircle} className="h-4 w-4 text-green-600 dark:text-green-400 mr-2 mt-0.5" />
                <div>
                  <p className="text-xs text-green-700 dark:text-green-300 font-medium">Client :</p>
                  <p className="text-xs text-green-600 dark:text-green-300">client@technosolutions.fr / client123</p>
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
