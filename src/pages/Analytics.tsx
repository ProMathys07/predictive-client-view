
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
  faDownload,
  faChartLine,
  faChartBar,
  faChevronDown
} from '@fortawesome/free-solid-svg-icons';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { exportToPDF, exportToCSV, exportToJSON } from '@/lib/exportUtils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function Analytics() {
  const { companies } = useCompanies();

  const handleExportPDF = () => {
    exportToPDF('analytics-page', 'analytics-aidatapme.pdf');
  };

  const handleExportCSV = () => {
    const analyticsData = companies.map(company => ({
      client: company.name,
      etape: company.pack,
      prototypes: company.activeModels,
      deploiement: company.modelsCount,
      solutions: company.activeModels + company.modelsCount,
      derniereActivite: company.lastActivity
    }));
    exportToCSV(analyticsData, 'analytics-data.csv');
  };

  const handleExportJSON = () => {
    const analyticsData = {
      metriques: {
        prototypesActifs: companies.reduce((sum, c) => sum + c.activeModels, 0),
        solutionsOperationnelles: companies.filter(c => c.pack === 'deploiement').length,
        clientsActifs: companies.length,
        modelesDeployes: companies.reduce((sum, c) => sum + c.modelsCount, 0)
      },
      clients: companies.map(company => ({
        nom: company.name,
        etape: company.pack,
        prototypes: company.activeModels,
        deploiement: company.modelsCount,
        solutions: company.activeModels + company.modelsCount,
        derniereActivite: company.lastActivity
      })),
      timestamp: new Date().toISOString()
    };
    exportToJSON(analyticsData, 'analytics-data.json');
  };

  return (
    <div id="analytics-page" className="p-6 space-y-6">
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <FontAwesomeIcon icon={faDownload} className="h-4 w-4 mr-2" />
                Exporter
                <FontAwesomeIcon icon={faChevronDown} className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleExportPDF}>
                <FontAwesomeIcon icon={faDownload} className="h-4 w-4 mr-2" />
                Exporter en PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleExportCSV}>
                <FontAwesomeIcon icon={faDownload} className="h-4 w-4 mr-2" />
                Exporter en CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleExportJSON}>
                <FontAwesomeIcon icon={faDownload} className="h-4 w-4 mr-2" />
                Exporter en JSON
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
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
              <LineChart data={[]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="prototypes" stroke="#3b82f6" strokeWidth={2} />
                <Line type="monotone" dataKey="solutions" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
            <div className="flex items-center justify-center h-20 text-gray-500 dark:text-gray-400">
              Données à venir
            </div>
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
              <BarChart data={[]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis />
                <YAxis />
                <Tooltip />
                <Bar dataKey="prototypes" fill="#3b82f6" />
                <Bar dataKey="deploiement" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
            <div className="flex items-center justify-center h-20 text-gray-500 dark:text-gray-400">
              Données à venir
            </div>
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
                  <th className="text-left p-3">Étape</th>
                  <th className="text-left p-3">Prototypes</th>
                  <th className="text-left p-3">Déploiement</th>
                  <th className="text-left p-3">Solutions</th>
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
                    <td className="p-3 font-semibold text-blue-600">
                      {company.activeModels + company.modelsCount}
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
