
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/hooks/useNotifications';
import { useCompanies } from '@/contexts/CompanyContext';
import { Users, Brain, Search, Server } from 'lucide-react';
import { Input } from '@/components/ui/input';
import ClientCard from '@/components/ClientCard';
import MetricsCard from '@/components/MetricsCard';
import NotificationBell from '@/components/NotificationBell';
import { Button } from '@/components/ui/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faTrash } from '@fortawesome/free-solid-svg-icons';
import AccountDeletionNotificationPanel from '@/components/AccountDeletionNotificationPanel';
import CreateClientAccountForm from '@/components/CreateClientAccountForm';
import UserManagementTable from '@/components/UserManagementTable';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { companies } = useCompanies();
  const { clearNotifications, notifications } = useNotifications();
  const [searchTerm, setSearchTerm] = useState('');

  // Convertir les companies en format client pour la compatibilité
  const mockClients = companies.map(company => ({
    id: company.id,
    name: company.name,
    lastActivity: company.lastActivity,
    modelsCount: company.modelsCount,
    activeModels: company.activeModels,
    status: company.status as 'active' | 'inactive' | 'warning',
  }));

  const filteredClients = mockClients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewClientDetails = (clientId: string) => {
    navigate(`/client/${clientId}`);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard AIDataPME
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Bienvenue, {user?.name} | Dernière mise à jour: {new Date().toLocaleString('fr-FR')}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          {/* Bouton pour nettoyer les notifications (debug) */}
          {notifications.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                clearNotifications();
                console.log('🗑️ Notifications nettoyées');
              }}
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              <FontAwesomeIcon icon={faTrash} className="h-4 w-4 mr-2" />
              Nettoyer notifications ({notifications.length})
            </Button>
          )}
          <NotificationBell />
        </div>
      </div>

      {/* Panneau de notifications de suppression de compte */}
      <AccountDeletionNotificationPanel />

      {/* Métriques principales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricsCard
          title="Total Clients"
          value={companies.length.toString()}
          change={12}
          trend="up"
          icon={<Users className="h-4 w-4" />}
        />
        <MetricsCard
          title="Modèles Actifs"
          value={companies.reduce((sum, c) => sum + c.activeModels, 0).toString()}
          change={8}
          trend="up"
          icon={<Brain className="h-4 w-4" />}
        />
        <MetricsCard
          title="Modèles Déployés"
          value={companies.reduce((sum, c) => sum + c.modelsCount, 0).toString()}
          change={5}
          trend="up"
          icon={<Server className="h-4 w-4" />}
        />
      </div>

      {/* Section des clients */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Vu Récemment
          </h2>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Rechercher un client..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-80"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClients.map((client) => (
            <ClientCard
              key={client.id}
              client={client}
              onViewDetails={handleViewClientDetails}
            />
          ))}
        </div>
      </div>

      {/* Section de gestion des comptes clients */}
      <div className="space-y-6">
        <CreateClientAccountForm />
        <UserManagementTable />
      </div>

      {/* Activité récente */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          Activité Récente
        </h3>
        <div className="space-y-3">
          {mockClients.slice(0, 5).map((client) => (
            <div key={client.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <FontAwesomeIcon icon={faUsers} className="h-3 w-3 text-white" />
                </div>
                <div>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {client.name}
                  </span>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {client.activeModels} modèles actifs
                  </p>
                </div>
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {client.lastActivity}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
