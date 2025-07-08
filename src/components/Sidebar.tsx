
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { 
  Users, 
  BarChart3, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  Building2,
  LogOut,
  Moon,
  Sun,
  User,
  BookOpen
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// Configuration de la navigation principale
const navigation = [
  { name: 'Dashboard', href: '/', icon: Users },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Paramètres', href: '/settings', icon: Settings },
  { name: 'Tutoriel', href: '/tutorial', icon: BookOpen },
];

// Composant Sidebar avec navigation et contrôles utilisateur
export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className={cn(
      "bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 flex flex-col h-screen",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Header avec logo et bouton collapse */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center space-x-2">
              <Building2 className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              <div>
                <span className="text-xl font-bold text-gray-900 dark:text-white">
                  AIDataPME
                </span>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Admin Dashboard
                </p>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 h-8 w-8"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Profil utilisateur */}
      {user && (
        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center space-x-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.profileImage} alt={user.name} />
              <AvatarFallback>
                {user.name?.split(' ').map(n => n[0]).join('') || 'AD'}
              </AvatarFallback>
            </Avatar>
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

      {/* Navigation principale */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navigation.map((item) => (
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
                <item.icon className="h-5 w-5" />
                {!collapsed && <span className="ml-3">{item.name}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Contrôles en bas */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800 space-y-2">
        {/* Bouton thème */}
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleTheme}
          className={cn(
            "w-full justify-start text-gray-700 dark:text-gray-300",
            collapsed && "justify-center"
          )}
        >
          {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          {!collapsed && <span className="ml-3">
            {theme === 'dark' ? 'Mode clair' : 'Mode sombre'}
          </span>}
        </Button>

        {/* Bouton profil */}
        <NavLink to="/settings">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "w-full justify-start text-gray-700 dark:text-gray-300",
              collapsed && "justify-center"
            )}
          >
            <User className="h-4 w-4" />
            {!collapsed && <span className="ml-3">Profil</span>}
          </Button>
        </NavLink>

        {/* Bouton déconnexion */}
        <Button
          variant="ghost"
          size="sm"
          onClick={logout}
          className={cn(
            "w-full justify-start text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20",
            collapsed && "justify-center"
          )}
        >
          <LogOut className="h-4 w-4" />
          {!collapsed && <span className="ml-3">Déconnexion</span>}
        </Button>
      </div>
    </div>
  );
}
