import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faChartBar, 
  faChevronLeft, 
  faChevronRight,
  faSignOutAlt,
  faMoon,
  faSun,
  faUser,
  faHome,
  faBrain,
  faComments,
  faCog,
  faQuestionCircle,
  faExternalLinkAlt
} from '@fortawesome/free-solid-svg-icons';

// Configuration de la navigation pour l'espace client
// Comprend les liens internes et le lien externe vers le site web
const clientNavigation = [
  { name: 'Dashboard', href: '/client/dashboard', icon: faHome },
  { name: 'Prédictions', href: '/client/predictions', icon: faBrain },
  { name: 'Feedback', href: '/client/feedback', icon: faComments },
  { name: 'FAQ', href: '/client/faq', icon: faQuestionCircle },
];

// Composant sidebar pour l'interface client
// Gère l'état de collapse, la navigation, et les contrôles utilisateur
export default function ClientSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  // Gérer la déconnexion avec confirmation
  const handleLogout = async () => {
    if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
      await logout();
    }
  };

  return (
    <div className={cn(
      "bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 flex flex-col h-screen",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* En-tête avec logo client et bouton de collapse */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center space-x-2">
              <FontAwesomeIcon icon={faUser} className="h-8 w-8 text-green-600 dark:text-green-400" />
              <div>
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  Client
                </span>
              </div>
            </div>
          )}
          {/* Bouton pour collapse/expand la sidebar */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 h-8 w-8"
          >
            <FontAwesomeIcon icon={collapsed ? faChevronRight : faChevronLeft} className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Section profil client connecté */}
      {user && (
        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center space-x-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.profileImage} alt={user.name} />
              <AvatarFallback>
                {user.name?.split(' ').map(n => n[0]).join('') || 'CL'}
              </AvatarFallback>
            </Avatar>
            {/* Informations client (masquées si sidebar collapsed) */}
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {user.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {user.email}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Navigation principale et lien externe */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {/* Liens de navigation interne client */}
          {clientNavigation.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    "flex items-center px-3 py-2 rounded-lg transition-colors text-gray-700 dark:text-gray-300",
                    isActive
                      ? "bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                      : "hover:bg-gray-100 dark:hover:bg-gray-800",
                    collapsed && "justify-center"
                  )
                }
              >
                <FontAwesomeIcon icon={item.icon} className="h-5 w-5" />
                {!collapsed && <span className="ml-3">{item.name}</span>}
              </NavLink>
            </li>
          ))}
          
          {/* Séparateur visuel */}
          <li className="pt-2">
            <div className="border-t border-gray-200 dark:border-gray-700"></div>
          </li>
          
          {/* Lien externe vers le site AIDataPME */}
          <li>
            <a
              href="https://aidatapme.fr/"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "flex items-center px-3 py-2 rounded-lg transition-colors text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800",
                collapsed && "justify-center"
              )}
            >
              <FontAwesomeIcon icon={faExternalLinkAlt} className="h-5 w-5" />
              {!collapsed && <span className="ml-3">Visiter le site</span>}
            </a>
          </li>
        </ul>
      </nav>

      {/* Section des contrôles client en bas */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800 space-y-2">
        {/* Bouton pour changer le thème (clair/sombre) */}
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleTheme}
          className={cn(
            "w-full justify-start text-gray-700 dark:text-gray-300",
            collapsed && "justify-center"
          )}
        >
          <FontAwesomeIcon icon={theme === 'dark' ? faSun : faMoon} className="h-4 w-4" />
          {!collapsed && <span className="ml-3">
            {theme === 'dark' ? 'Mode clair' : 'Mode sombre'}
          </span>}
        </Button>

        {/* Bouton pour accéder au profil client */}
        <NavLink to="/client/profile">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "w-full justify-start text-gray-700 dark:text-gray-300",
              collapsed && "justify-center"
            )}
          >
            <FontAwesomeIcon icon={faUser} className="h-4 w-4" />
            {!collapsed && <span className="ml-3">Profil</span>}
          </Button>
        </NavLink>

        {/* Bouton de déconnexion */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className={cn(
            "w-full justify-start text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20",
            collapsed && "justify-center"
          )}
        >
          <FontAwesomeIcon icon={faSignOutAlt} className="h-4 w-4" />
          {!collapsed && <span className="ml-3">Déconnexion</span>}
        </Button>
      </div>
    </div>
  );
}