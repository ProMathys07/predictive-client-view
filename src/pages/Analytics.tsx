
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Brain,
  Calendar,
  Download,
  Filter,
  RefreshCw
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

// Données simulées pour les graphiques
const performanceData = [
  { month: 'Jan', predictions: 1200, accuracy: 94.2, clients: 18 },
  { month: 'Fév', predictions: 1400, accuracy: 95.1, clients: 20 },
  { month: 'Mar', predictions: 1600, accuracy: 93.8, clients: 22 },
  { month: 'Avr', predictions: 1800, accuracy: 96.3, clients: 24 },
  { month: 'Mai', predictions: 2100, accuracy: 95.7, clients: 26 },
  { month: 'Jun', predictions: 2300, accuracy: 97.1, clients: 28 },
];

const clientActivityData = [
  { client: 'TechCorp', predictions: 450, active: true },
  { client: 'DataFlow', predictions: 380, active: true },
  { client: 'AI Innovations', predictions: 320, active: false },
  { client: 'Smart Analytics', predictions: 280, active: true },
  { client: 'Future Tech', predictions: 200, active: true },
];

// Page d'analytics avec graphiques et statistiques détaillées
export default function Analytics() {
  const [selectedPeriod, setSelectedPeriod] = useState('6m');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fonction pour rafraîchir les données
  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulation d'un rafraîchissement
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

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
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filtrer
          </Button>
        </div>
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
            <CardTitle className="text-sm font-medium">Prédictions Totales</CardTitle>
            <BarChart3 className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12,847</div>
            <p className="text-xs text-green-600">+18% vs mois dernier</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Précision Moyenne</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">95.8%</div>
            <p className="text-xs text-green-600">+2.3% vs mois dernier</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clients Actifs</CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">28</div>
            <p className="text-xs text-green-600">+4 nouveaux clients</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Modèles Déployés</CardTitle>
            <Brain className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">67</div>
            <p className="text-xs text-green-600">+8 ce mois</p>
          </CardContent>
        </Card>
      </div>

      {/* Graphiques principaux */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Graphique des performances */}
        <Card>
          <CardHeader>
            <CardTitle>Performance sur 6 mois</CardTitle>
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
                  dataKey="predictions" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  name="Prédictions"
                />
                <Line 
                  type="monotone" 
                  dataKey="accuracy" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  name="Précision (%)"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Graphique activité clients */}
        <Card>
          <CardHeader>
            <CardTitle>Activité par Client</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={clientActivityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="client" />
                <YAxis />
                <Tooltip />
                <Bar 
                  dataKey="predictions" 
                  fill="#3b82f6"
                  name="Prédictions"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Tableau détaillé */}
      <Card>
        <CardHeader>
          <CardTitle>Détails par Client</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Client</th>
                  <th className="text-left p-2">Prédictions</th>
                  <th className="text-left p-2">Précision</th>
                  <th className="text-left p-2">Statut</th>
                  <th className="text-left p-2">Dernière activité</th>
                </tr>
              </thead>
              <tbody>
                {clientActivityData.map((client, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-2 font-medium">{client.client}</td>
                    <td className="p-2">{client.predictions}</td>
                    <td className="p-2">
                      {(Math.random() * 10 + 90).toFixed(1)}%
                    </td>
                    <td className="p-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        client.active 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
                          : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                      }`}>
                        {client.active ? 'Actif' : 'Inactif'}
                      </span>
                    </td>
                    <td className="p-2 text-gray-600 dark:text-gray-300">
                      {Math.floor(Math.random() * 5) + 1}h
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
