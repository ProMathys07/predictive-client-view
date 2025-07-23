
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faEnvelope, faEye, faEyeSlash, faBuilding, faExclamationTriangle, faInfoCircle, faUser, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useToast } from '@/hooks/use-toast';
import AppleLoadingAnimation from '@/components/AppleLoadingAnimation';

// Page de connexion pour l'administration et les clients
// Gère l'authentification basée sur le rôle avec animation de chargement Apple
export default function Login() {
  const [searchParams] = useSearchParams();
  const role = searchParams.get('role') as 'admin' | 'client' | null;
  
  // États pour la gestion du formulaire de connexion
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showLoadingAnimation, setShowLoadingAnimation] = useState(true);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Rediriger vers la sélection de rôle si aucun rôle n'est spécifié
  useEffect(() => {
    if (!role) {
      navigate('/role-selection');
    }
  }, [role, navigate]);

  // Gérer l'animation de chargement au démarrage (style Apple)
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoadingAnimation(false);
    }, 2000); // Afficher l'animation pendant 2 secondes

    return () => clearTimeout(timer);
  }, []);

  // Gestion de la soumission du formulaire de connexion
  // Vérifie le verrouillage du compte et gère l'authentification
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Activer l'état de chargement pendant l'authentification
    setIsLoading(true);

    try {
      // Tenter la connexion avec les identifiants fournis
      const success = await login(email, password, role!);
      if (success) {
        // Rediriger vers le dashboard approprié selon le rôle
        navigate(role === 'admin' ? '/' : '/client/dashboard');
      }
    } catch (error) {
      console.error("Erreur lors de la connexion:", error);
    } finally {
      setIsLoading(false);
    }
  };


  if (!role) {
    return null; // Évite le flash pendant la redirection
  }

  const isAdmin = role === 'admin';
  const isClient = role === 'client';

  // Afficher l'animation de chargement Apple pour les admins
  if (showLoadingAnimation && isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center space-y-6">
          <AppleLoadingAnimation size="lg" />
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              AIDataPME
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Chargement de l'interface d'administration...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="w-full max-w-md">
        {/* Bouton de retour vers la sélection de rôle */}
        <Button
          variant="ghost"
          className="mb-6 p-0 h-auto font-normal text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          onClick={() => navigate('/role-selection')}
        >
          <FontAwesomeIcon icon={faArrowLeft} className="mr-2 h-4 w-4" />
          Changer de type d'accès
        </Button>

        {/* Carte principale de connexion */}
        <Card className="shadow-lg">
          <CardHeader className="text-center space-y-4 pb-6">
            {/* Icône représentant le type d'utilisateur */}
            <div className="flex items-center justify-center mb-4">
              <FontAwesomeIcon 
                icon={isAdmin ? faBuilding : faUser} 
                className={`h-12 w-12 ${isAdmin ? 'text-blue-600 dark:text-blue-400' : 'text-green-600 dark:text-green-400'}`} 
              />
            </div>
            {/* Titre et description du type d'accès */}
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
              {isAdmin ? 'Administration' : 'Espace Client'}
            </CardTitle>
            <p className="text-gray-600 dark:text-gray-300">
              {isAdmin ? 'Accès administrateur AIDataPME' : 'Accès client sécurisé'}
            </p>
          </CardHeader>
          <CardContent>
            {/* Formulaire de connexion principal */}
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Champ email avec icône */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <FontAwesomeIcon icon={faEnvelope} className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder={isAdmin ? "admin@aidatapme.com" : "votre-email@entreprise.com"}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                {/* Champ mot de passe avec bouton de visibilité */}
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
                    {/* Bouton pour afficher/masquer le mot de passe */}
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

                {/* Bouton de soumission avec état de chargement */}
                <Button
                  type="submit"
                  className={`w-full ${isAdmin ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'}`}
                  disabled={isLoading}
                >
                  {isLoading ? 'Connexion...' : (isAdmin ? 'Accès Admin' : 'Accès Client')}
                </Button>
              </form>

            {/* Informations de connexion de démonstration */}
            <div className={`mt-4 p-3 rounded-lg border ${isAdmin ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800' : 'bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-800'}`}>
              <div className="flex items-start">
                <FontAwesomeIcon 
                  icon={faInfoCircle} 
                  className={`h-4 w-4 mr-2 mt-0.5 ${isAdmin ? 'text-blue-600 dark:text-blue-400' : 'text-green-600 dark:text-green-400'}`} 
                />
                <div>
                  <p className={`text-xs font-medium ${isAdmin ? 'text-blue-700 dark:text-blue-300' : 'text-green-700 dark:text-green-300'}`}>
                    {isAdmin ? 'Admin :' : 'Client :'}
                  </p>
                  <p className={`text-xs ${isAdmin ? 'text-blue-600 dark:text-blue-300' : 'text-green-600 dark:text-green-300'}`}>
                    {isAdmin ? 'admin@aidatapme.com / admin123' : 'client@technosolutions.fr / client123'}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
