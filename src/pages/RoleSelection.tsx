// Importation des hooks et composants nécessaires
import { useNavigate } from 'react-router-dom'; // Hook pour la navigation entre les pages
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'; // Composants de carte UI
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Composant pour les icônes FontAwesome
import { faBuilding, faUser } from '@fortawesome/free-solid-svg-icons'; // Icônes spécifiques (bâtiment et utilisateur)

// Composant principal pour la sélection du type d'utilisateur (Admin ou Client)
export default function RoleSelection() {
  // Hook pour la navigation programmatique vers d'autres pages
  const navigate = useNavigate();

  // Fonction qui gère la sélection du rôle et redirige vers la page de connexion
  const handleRoleSelection = (role: 'admin' | 'client') => {
    // Navigation vers la page de login avec le rôle sélectionné en paramètre d'URL
    navigate(`/login?role=${role}`);
  };

  // Rendu du composant avec la structure de la page
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Contenu principal de la page */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-4xl">
          {/* Section titre et description */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Bienvenue sur AIDataPME
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Choisissez votre type d'accès
            </p>
          </div>
          
          {/* Grille des cartes de sélection de rôle */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Carte Admin - Permet l'accès administrateur */}
            <Card 
              className="shadow-lg cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 border-2 hover:border-blue-500"
              onClick={() => handleRoleSelection('admin')}
            >
              {/* En-tête de la carte Admin */}
              <CardHeader className="text-center space-y-4 pb-6">
                {/* Conteneur pour l'icône de bâtiment */}
                <div className="flex items-center justify-center mb-4">
                  <FontAwesomeIcon icon={faBuilding} className="h-16 w-16 text-blue-600 dark:text-blue-400" />
                </div>
                {/* Titre de la carte */}
                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                  Admin
                </CardTitle>
                {/* Description du rôle admin */}
                <p className="text-gray-600 dark:text-gray-300">
                  Accès administrateur AIDataPME
                </p>
              </CardHeader>
              {/* Contenu de la carte avec informations supplémentaires */}
              <CardContent>
                <div className="text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Gestion complète de la plateforme
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Carte Client - Permet l'accès client */}
            <Card 
              className="shadow-lg cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 border-2 hover:border-green-500"
              onClick={() => handleRoleSelection('client')}
            >
              {/* En-tête de la carte Client */}
              <CardHeader className="text-center space-y-4 pb-6">
                {/* Conteneur pour l'icône utilisateur */}
                <div className="flex items-center justify-center mb-4">
                  <FontAwesomeIcon icon={faUser} className="h-16 w-16 text-green-600 dark:text-green-400" />
                </div>
                {/* Titre de la carte */}
                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                  Client
                </CardTitle>
                {/* Description du rôle client */}
                <p className="text-gray-600 dark:text-gray-300">
                  Espace client sécurisé
                </p>
              </CardHeader>
              {/* Contenu de la carte avec informations supplémentaires */}
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
      
      {/* Footer avec informations de copyright */}
      <footer className="py-6 px-4 border-t border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            © 2024 AIDataPME. Tous droits réservés.
          </p>
        </div>
      </footer>
    </div>
  );
}