
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const mockData = [
  { name: 'Epoch 1', entrainement: 0.65, actuelle: 0.62 },
  { name: 'Epoch 2', entrainement: 0.72, actuelle: 0.69 },
  { name: 'Epoch 3', entrainement: 0.78, actuelle: 0.75 },
  { name: 'Epoch 4', entrainement: 0.85, actuelle: 0.82 },
  { name: 'Epoch 5', entrainement: 0.91, actuelle: 0.88 },
];

const recentPredictions = [
  { id: '1', timestamp: '14:30', input: 'Stock A', result: 'Optimal', confidence: '96%' },
  { id: '2', timestamp: '14:15', input: 'Product B', result: 'High Demand', confidence: '89%' },
  { id: '3', timestamp: '13:45', input: 'Stock C', result: 'Low Alert', confidence: '92%' },
];

const versions = ['V1', 'V1.2', 'V1.5', 'V2', 'V2.1'];

export default function ModelTracking() {
  const { clientId, modelId } = useParams();
  const [showModifyDialog, setShowModifyDialog] = useState(false);
  const [selectedVersions, setSelectedVersions] = useState<string[]>([]);

  const handleVersionChange = (version: string, checked: boolean) => {
    if (checked) {
      setSelectedVersions([...selectedVersions, version]);
    } else {
      setSelectedVersions(selectedVersions.filter(v => v !== version));
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to={`/client/${clientId}`}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Suivi du Modèle</h1>
            <p className="text-gray-600">Métriques et performance détaillées</p>
          </div>
        </div>
        <Button onClick={() => setShowModifyDialog(true)}>
          Modifier le Modèle
        </Button>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bloc visuel gauche */}
        <Card>
          <CardHeader>
            <CardTitle>Visualisations</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="precision" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="precision">Précision</TabsTrigger>
                <TabsTrigger value="loss">Loss</TabsTrigger>
                <TabsTrigger value="auc">AUC</TabsTrigger>
                <TabsTrigger value="roc">ROC</TabsTrigger>
              </TabsList>
              <TabsContent value="precision" className="space-y-4">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={mockData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="entrainement" stroke="#3b82f6" strokeWidth={2} />
                    <Line type="monotone" dataKey="actuelle" stroke="#10b981" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </TabsContent>
              <TabsContent value="loss" className="space-y-4">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={mockData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="entrainement" stroke="#3b82f6" strokeWidth={2} />
                    <Line type="monotone" dataKey="actuelle" stroke="#10b981" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </TabsContent>
              <TabsContent value="auc" className="space-y-4">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={mockData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="entrainement" stroke="#3b82f6" strokeWidth={2} />
                    <Line type="monotone" dataKey="actuelle" stroke="#10b981" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </TabsContent>
              <TabsContent value="roc" className="space-y-4">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={mockData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="entrainement" stroke="#3b82f6" strokeWidth={2} />
                    <Line type="monotone" dataKey="actuelle" stroke="#10b981" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Tableau récapitulatif droite */}
        <Card>
          <CardHeader>
            <CardTitle>Dernières Prédictions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Heure</th>
                    <th className="text-left py-2">Input</th>
                    <th className="text-left py-2">Résultat</th>
                    <th className="text-left py-2">Confiance</th>
                  </tr>
                </thead>
                <tbody>
                  {recentPredictions.map((prediction) => (
                    <tr key={prediction.id} className="border-b hover:bg-gray-50">
                      <td className="py-2">{prediction.timestamp}</td>
                      <td className="py-2">{prediction.input}</td>
                      <td className="py-2">
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                          {prediction.result}
                        </span>
                      </td>
                      <td className="py-2">{prediction.confidence}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tableau des métriques bas */}
      <Card>
        <CardHeader>
          <CardTitle>Métriques Détaillées</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <h3 className="font-semibold mb-2">Précision</h3>
              <div className="text-2xl font-bold text-blue-600">94.2%</div>
            </div>
            <div className="text-center">
              <h3 className="font-semibold mb-2">Loss</h3>
              <div className="text-2xl font-bold text-purple-600">0.058</div>
            </div>
            <div className="text-center">
              <h3 className="font-semibold mb-2">AUC</h3>
              <div className="text-2xl font-bold text-green-600">0.96</div>
            </div>
            <div className="text-center">
              <h3 className="font-semibold mb-2">ROC</h3>
              <div className="text-2xl font-bold text-orange-600">0.94</div>
            </div>
          </div>
          
          <div className="mt-6">
            <h3 className="font-semibold mb-4">Matrice de Confusion</h3>
            <div className="grid grid-cols-2 gap-4 max-w-md">
              <div className="bg-green-100 p-4 rounded text-center">
                <div className="text-sm text-gray-600">Vrais Positifs</div>
                <div className="text-xl font-bold">847</div>
              </div>
              <div className="bg-red-100 p-4 rounded text-center">
                <div className="text-sm text-gray-600">Faux Positifs</div>
                <div className="text-xl font-bold">52</div>
              </div>
              <div className="bg-red-100 p-4 rounded text-center">
                <div className="text-sm text-gray-600">Faux Négatifs</div>
                <div className="text-xl font-bold">73</div>
              </div>
              <div className="bg-green-100 p-4 rounded text-center">
                <div className="text-sm text-gray-600">Vrais Négatifs</div>
                <div className="text-xl font-bold">1028</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dialog Modifier le Modèle */}
      <Dialog open={showModifyDialog} onOpenChange={setShowModifyDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Ajouter un modèle</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex items-center space-x-2">
              <Button variant="outline" className="w-full">
                <Upload className="h-4 w-4 mr-2" />
                Charger
              </Button>
            </div>
            
            <div className="space-y-2">
              <Label>Versions disponibles:</Label>
              <div className="space-y-2">
                {versions.map((version) => (
                  <div key={version} className="flex items-center space-x-2">
                    <Checkbox
                      id={version}
                      checked={selectedVersions.includes(version)}
                      onCheckedChange={(checked) => handleVersionChange(version, checked as boolean)}
                    />
                    <Label htmlFor={version}>{version}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowModifyDialog(false)}>
              Annuler
            </Button>
            <Button onClick={() => setShowModifyDialog(false)}>
              Enregistrer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
