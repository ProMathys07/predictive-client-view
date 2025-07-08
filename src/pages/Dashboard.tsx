
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Brain, Activity, TrendingUp } from 'lucide-react';
import ClientCard from '@/components/ClientCard';
import MetricsCard from '@/components/MetricsCard';
import PredictionChart from '@/components/PredictionChart';

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

export default function Dashboard() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

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
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Admin</h1>
        <div className="text-sm text-gray-500">
          Dernière mise à jour: {new Date().toLocaleString('fr-FR')}
        </div>
      </div>

      {/* Metrics */}
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

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PredictionChart />
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Activité Récente</h3>
          <div className="space-y-3">
            {mockClients.slice(0, 5).map((client) => (
              <div key={client.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <span className="font-medium">{client.name}</span>
                <span className="text-sm text-gray-500">{client.lastActivity}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Liste des Clients</h2>
          <input
            type="text"
            placeholder="Rechercher un client..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Clients Grid */}
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
