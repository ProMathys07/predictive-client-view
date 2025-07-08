
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Users, 
  BarChart3, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  Building2
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Clients', href: '/', icon: Users },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Paramètres', href: '/settings', icon: Settings },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={cn(
      "bg-slate-900 text-white transition-all duration-300 flex flex-col h-screen",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center space-x-2">
              <Building2 className="h-8 w-8 text-blue-400" />
              <span className="text-xl font-bold">Admin AI</span>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 rounded-md hover:bg-slate-800 transition-colors"
          >
            {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navigation.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    "flex items-center px-3 py-2 rounded-lg transition-colors",
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white",
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
    </div>
  );
}
