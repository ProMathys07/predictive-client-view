
import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Plus, BarChart3, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ModelCard from '@/components/ModelCard';
import PredictionChart from '@/components/PredictionChart';

const mockModels = [
  {
    id: '1',
    name: 'Stock Prediction Model',
    version: '2.1.3',
    isActive: true,
    createdAt: '15/01/2024',
    lastPrediction: '2 heures',
    accuracy: 94.2,
  },
  {
    id: '2',
    name: 'Demand Forecasting',
    version: '1.8.1',
    isActive: true,
    createdAt: '10/01/2024',
    lastPrediction: '30 minutes',
    accuracy: 91.7,
  },
  {
    id: '3',
    name: 'Quality Control AI',
    version: '3.0.0',
    isActive: false,
    createdAt: '08/01/2024',
    lastPrediction: '2 jours',
    accuracy: 88.9,
  },
];

const recentPredictions = [
  { id: '1', timestamp: '14:30', model: 'Stock Prediction', result: 'Optimal', confidence: 96 },
  { id: '2', timestamp: '14:15', model: 'Demand Forecasting', result: 'High Demand', confidence: 89 },
  { id: '3', timestamp: '13:45', model: 'Stock Prediction', result: 'Low Stock Alert', confidence: 92 },
  { id: '4', timestamp: '13:20', model: 'Quality Control', result: 'Pass', confidence: 94 },
];

export default function ClientDetail() {
  const { clientId } = useParams();
  const [models, setModels] = useState(mockModels);

  const clientName = 'TechCorp Solutions'; // In real app, fetch from API

  const handleToggleModel = (modelId: string) => {
    setModels(models.map(model => 
      model.id === modelId 
        ? { ...model, isActive: !model.isActive }
        : model
    ));
  };

  const handleDeleteModel = (modelId: string) => {
    setModels(models.filter(model => model.id !== modelId));
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Client: {clientName}</h1>
            <p className="text-gray-600">Gestion des modèles et métriques</p>
          </div>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Nouveau Modèle
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="models" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="models">Modèles</TabsTrigger>
          <TabsTrigger value="predictions">Dernières Prédictions</TabsTrigger>
          <TabsTrigger value="metrics">Métriques</TabsTrigger>
          <TabsTrigger value="visualizations">Visualisations</TabsTrigger>
        </TabsList>

        <TabsContent value="models" className="space-y-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Modèles du Client</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {models.map((model) => (
                <ModelCard
                  key={model.id}
                  model={model}
                  onToggleActive={handleToggleModel}
                  onDelete={handleDeleteModel}
                />
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="predictions" className="space-y-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Dernières Prédictions</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Heure</th>
                    <th className="text-left py-3 px-4">Modèle</th>
                    <th className="text-left py-3 px-4">Résultat</th>
                    <th className="text-left py-3 px-4">Confiance</th>
                  </tr>
                </thead>
                <tbody>
                  {recentPredictions.map((prediction) => (
                    <tr key={prediction.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-gray-500" />
                        {prediction.timestamp}
                      </td>
                      <td className="py-3 px-4">{prediction.model}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                          {prediction.result}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${prediction.confidence}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium">{prediction.confidence}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="metrics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold mb-2">Précision Moyenne</h3>
              <div className="text-3xl font-bold text-green-600">91.6%</div>
              <p className="text-sm text-gray-600">Sur les 7 derniers jours</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold mb-2">Prédictions/Jour</h3>
              <div className="text-3xl font-bold text-blue-600">247</div>
              <p className="text-sm text-gray-600">Moyenne quotidienne</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold mb-2">Temps de Réponse</h3>
              <div className="text-3xl font-bold text-purple-600">0.3s</div>
              <p className="text-sm text-gray-600">Moyenne par prédiction</p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="visualizations" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PredictionChart />
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold mb-4">Performance par Modèle</h3>
              <div className="space-y-4">
                {models.map((model) => (
                  <div key={model.id} className="flex items-center justify-between">
                    <span className="font-medium">{model.name}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full" 
                          style={{ width: `${model.accuracy}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">{model.accuracy}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
