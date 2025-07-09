
import React, { useState } from 'react';
import { useCompanies } from '@/contexts/CompanyContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faRocket, 
  faCogs, 
  faUsers, 
  faBrain,
  faCalendar,
  faDownload,
  faFilter,
  faRefresh,
  faChartLine,
  faChartBar
} from '@fortawesome/free-solid-svg-icons';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

// Données simulées pour les graphiques
const performanceData = [
  { month: 'Jan', prototypes: 5, solutions: 2, clients: 18 },
  { month: 'Fév', prototypes: 7, solutions: 3, clients: 20 },
  { month: 'Mar', prototypes: 6, solutions: 4, clients: 22 },
  { month: 'Avr', prototypes: 9, solutions: 5, clients: 24 },
  { month: 'Mai', prototypes: 11, solutions: 6, clients: 26 },
  { month: 'Jun', prototypes: 8, solutions: 7, clients: 28 },
];

const clientActivityData = [
  { client: 'TechCorp', prototypes: 3, solutions: 1, active: true },
  { client: 'DataFlow', prototypes: 2, solutions: 2, active: true },
  { client: 'AI Innovations', prototypes: 4, solutions: 0, active: false },
  { client: 'Smart Analytics', prototypes: 1, solutions: 1, active: true },
  { client: 'Future Tech', prototypes: 2, solutions: 0, active: true },
];

export default function Analytics() {
  const { companies } = useCompanies();
  const [selectedPeriod, setSelectedPeriod] = useState('6m');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('prototypes');

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  const NavigationButton = ({ 
    icon, 
    label, 
    isActive, 
    onClick 
  }: { 
    icon: any; 
    label: string; 
    isActive: boolean; 
    onClick: () => void; 
  }) => (
    <Button
      variant={isActive ? "default" : "outline"}
      onClick={onClick}
      className="flex items-center gap-2"
    >
      <FontAwesomeIcon icon={icon} className="h-4 w-4" />
      {label}
    </Button>
  );

  return (
    <div className="p-6 space-y-6">
      {/* En-tête avec contrôles */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Analytics AIDataPME
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Analyse détaillée des performances et de l'utilisation
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <FontAwesomeIcon icon={faRefresh} className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
          <Button variant="outline" size="sm">
            <FontAwesomeIcon icon={faDownload} className="h-4 w-4 mr-2" />
            Exporter
          </Button>
          <Button variant="outline" size="sm">
            <FontAwesomeIcon icon={faFilter} className="h-4 w-4 mr-2" />
            Filtrer
          </Button>
        </div>
      </div>

      {/* Navigation principale */}
      <div className="flex flex-wrap gap-4">
        <NavigationButton
          icon={faRocket}
          label="Prototypes Actifs"
          isActive={activeTab === 'prototypes'}
          onClick={() => setActiveTab('prototypes')}
        />
        <NavigationButton
          icon={faCogs}
          label="Solutions Opérationnelles"
          isActive={activeTab === 'solutions'}
          onClick={() => setActiveTab('solutions')}
        />
        <NavigationButton
          icon={faUsers}
          label="Clients"
          isActive={activeTab === 'clients'}
          onClick={() => setActiveTab('clients')}
        />
        <NavigationButton
          icon={faBrain}
          label="Modèles Déployés"
          isActive={activeTab === 'models'}
          onClick={() => setActiveTab('models')}
        />
      </div>

      {/* Sélecteur de période */}
      <div className="flex space-x-2">
        {['1m', '3m', '6m', '1a'].map((period) => (
          <Button
            key={period}
            variant={selectedPeriod === period ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedPeriod(period)}
          >
            {period === '1m' ? '1 mois' : period === '3m' ? '3 mois' : period === '6m' ? '6 mois' : '1 an'}
          </Button>
        ))}
      </div>

      {/* Métriques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Prototypes Actifs</CardTitle>
            <FontAwesomeIcon icon={faRocket} className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {companies.reduce((sum, c) => sum + c.activeModels, 0)}
            </div>
            <p className="text-xs text-green-600">+18% vs mois dernier</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Solutions Opérationnelles</CardTitle>
            <FontAwesomeIcon icon={faCogs} className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {companies.filter(c => c.pack === 'deploiement').length}
            </div>
            <p className="text-xs text-green-600">+2 nouvelles solutions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clients Actifs</CardTitle>
            <FontAwesomeIcon icon={faUsers} className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{companies.length}</div>
            <p className="text-xs text-green-600">+4 nouveaux clients</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Modèles Déployés</CardTitle>
            <FontAwesomeIcon icon={faBrain} className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {companies.reduce((sum, c) => sum + c.modelsCount, 0)}
            </div>
            <p className="text-xs text-green-600">+8 ce mois</p>
          </CardContent>
        </Card>
      </div>

      {/* Graphiques principaux */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FontAwesomeIcon icon={faChartLine} className="h-5 w-5" />
              Évolution sur 6 mois
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="prototypes" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  name="Prototypes"
                />
                <Line 
                  type="monotone" 
                  dataKey="solutions" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  name="Solutions"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FontAwesomeIcon icon={faChartBar} className="h-5 w-5" />
              Activité par Client
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={clientActivityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="client" />
                <YAxis />
                <Tooltip />
                <Bar 
                  dataKey="prototypes" 
                  fill="#3b82f6"
                  name="Prototypes"
                />
                <Bar 
                  dataKey="solutions" 
                  fill="#10b981"
                  name="Solutions"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Détails par client */}
      <Card>
        <CardHeader>
          <CardTitle>Détails par Client</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Client</th>
                  <th className="text-left p-3">Pack</th>
                  <th className="text-left p-3">Prototypes</th>
                  <th className="text-left p-3">Solutions</th>
                  <th className="text-left p-3">Statut</th>
                  <th className="text-left p-3">Dernière activité</th>
                </tr>
              </thead>
              <tbody>
                {companies.map((company) => (
                  <tr key={company.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="p-3 font-medium">{company.name}</td>
                    <td className="p-3">
                      <Badge variant="outline">{company.pack}</Badge>
                    </td>
                    <td className="p-3">{company.activeModels}</td>
                    <td className="p-3">{company.modelsCount}</td>
                    <td className="p-3">
                      <Badge variant={company.status === 'active' ? 'default' : 'secondary'}>
                        {company.status === 'active' ? 'Actif' : 'Inactif'}
                      </Badge>
                    </td>
                    <td className="p-3 text-gray-600 dark:text-gray-300">
                      {company.lastActivity}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
