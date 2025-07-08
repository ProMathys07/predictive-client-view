
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Users, Brain, Activity, TrendingUp, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ClientCard from '@/components/ClientCard';
import MetricsCard from '@/components/MetricsCard';
import PredictionChart from '@/components/PredictionChart';

// Données simulées pour les clients
const mockClients = [
  {
    id: '1',
    name: 'TechCorp Solutions',
    lastActivity: '2 heures',
    modelsCount: 3,
    activeModels: 2,
    status: 'active' as const,
  },
  {
    id: '2',
    name: 'DataFlow Industries',
    lastActivity: '1 jour',
    modelsCount: 5,
    activeModels: 5,
    status: 'active' as const,
  },
  {
    id: '3',
    name: 'AI Innovations Ltd',
    lastActivity: '3 jours',
    modelsCount: 2,
    activeModels: 1,
    status: 'warning' as const,
  },
  {
    id: '4',
    name: 'Smart Analytics Co',
    lastActivity: '1 semaine',
    modelsCount: 4,
    activeModels: 0,
    status: 'inactive' as const,
  },
];

// Page principale du dashboard avec métriques et clients
export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  // Filtrage des clients selon le terme de recherche
  const filteredClients = mockClients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Navigation vers les détails d'un client
  const handleViewClientDetails = (clientId: string) => {
    navigate(`/client/${clientId}`);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header avec informations utilisateur */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard AIDataPME
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Bienvenue, {user?.name} | Dernière mise à jour: {new Date().toLocaleString('fr-FR')}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={() => navigate('/analytics')}>
            Voir Analytics
          </Button>
          <Button variant="outline" onClick={() => navigate('/tutorial')}>
            Aide
          </Button>
        </div>
      </div>

      {/* Métriques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricsCard
          title="Total Clients"
          value="24"
          change={12}
          trend="up"
          icon={<Users className="h-4 w-4" />}
        />
        <MetricsCard
          title="Modèles Actifs"
          value="47"
          change={8}
          trend="up"
          icon={<Brain className="h-4 w-4" />}
        />
        <MetricsCard
          title="Prédictions/jour"
          value="1,247"
          change={-3}
          trend="down"
          icon={<Activity className="h-4 w-4" />}
        />
        <MetricsCard
          title="Performance Globale"
          value="94.2%"
          change={2}
          trend="up"
          icon={<TrendingUp className="h-4 w-4" />}
        />
      </div>

      {/* Graphiques et activité récente */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PredictionChart />
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            Activité Récente
          </h3>
          <div className="space-y-3">
            {mockClients.slice(0, 5).map((client) => (
              <div key={client.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                <span className="font-medium text-gray-900 dark:text-white">
                  {client.name}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {client.lastActivity}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section des clients */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Liste des Clients
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

        {/* Grille des clients */}
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
    </div>
  );
}
