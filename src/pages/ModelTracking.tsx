
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Upload, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { exportToCSV } from '@/lib/exportUtils';

// Empty data for initial state
const emptyData: any[] = [];
const emptyPredictions: any[] = [];
const emptyClassificationData: any[] = [];

const versions = ['V1', 'V1.2', 'V1.5', 'V2', 'V2.1'];

// Mock model names for demonstration
const modelNames: { [key: string]: string } = {
  '1': 'Stock Prediction Model',
  '2': 'Demand Forecasting',
  '3': 'Quality Control AI',
};

export default function ModelTracking() {
  const { clientId, modelId } = useParams();
  const [showModifyDialog, setShowModifyDialog] = useState(false);
  const [selectedVersions, setSelectedVersions] = useState<string[]>([]);

  const modelName = modelNames[modelId || ''] || 'Modèle Inconnu';

  const handleVersionChange = (version: string, checked: boolean) => {
    if (checked) {
      setSelectedVersions([...selectedVersions, version]);
    } else {
      setSelectedVersions(selectedVersions.filter(v => v !== version));
    }
  };

  const handleExportCSV = () => {
    // Export empty data structure
    const exportData = [
      { Type: 'Métrique Générale', Nom: 'Précision', Valeur: 'Non disponible', Détails: 'En attente de connexion GCP' },
      { Type: 'Métrique Générale', Nom: 'Loss', Valeur: 'Non disponible', Détails: 'En attente de connexion GCP' },
      { Type: 'Métrique Générale', Nom: 'AUC', Valeur: 'Non disponible', Détails: 'En attente de connexion GCP' },
      { Type: 'Métrique Générale', Nom: 'ROC', Valeur: 'Non disponible', Détails: 'En attente de connexion GCP' },
      { Type: 'Matrice de Confusion', Nom: 'Données', Valeur: 'Non disponibles', Détails: 'En attente de connexion GCP' },
      { Type: 'Classification Report', Nom: 'Rapport', Valeur: 'Non généré', Détails: 'En attente de connexion GCP' },
      { Type: 'Prédictions', Nom: 'Aucune prédiction', Valeur: 'Vide', Détails: 'En attente de connexion GCP' }
    ];
    
    exportToCSV(exportData, `model-${modelName.replace(/\s+/g, '-').toLowerCase()}-metrics.csv`);
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
            <h1 className="text-3xl font-bold text-gray-900">
              Suivi du modèle - <span className="text-blue-600">{modelName}</span>
            </h1>
            <p className="text-gray-600">Métriques et performance détaillées</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={handleExportCSV}>
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
          <Button onClick={() => setShowModifyDialog(true)}>
            Modifier le Modèle
          </Button>
        </div>
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
                <div className="h-[300px] flex items-center justify-center border border-dashed border-gray-300 rounded bg-gray-50">
                  <p className="text-gray-500">Données à venir</p>
                </div>
              </TabsContent>
              <TabsContent value="loss" className="space-y-4">
                <div className="h-[300px] flex items-center justify-center border border-dashed border-gray-300 rounded bg-gray-50">
                  <p className="text-gray-500">Données à venir</p>
                </div>
              </TabsContent>
              <TabsContent value="auc" className="space-y-4">
                <div className="h-[300px] flex items-center justify-center border border-dashed border-gray-300 rounded bg-gray-50">
                  <p className="text-gray-500">Données à venir</p>
                </div>
              </TabsContent>
              <TabsContent value="roc" className="space-y-4">
                <div className="h-[300px] flex items-center justify-center border border-dashed border-gray-300 rounded bg-gray-50">
                  <p className="text-gray-500">Données à venir</p>
                </div>
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
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-gray-500">
                      Aucune prédiction disponible
                    </td>
                  </tr>
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <div className="text-center">
              <h3 className="font-semibold mb-2">Précision</h3>
              <div className="text-2xl font-bold text-gray-400">--</div>
              <p className="text-xs text-gray-500">Données non disponibles</p>
            </div>
            <div className="text-center">
              <h3 className="font-semibold mb-2">Loss</h3>
              <div className="text-2xl font-bold text-gray-400">--</div>
              <p className="text-xs text-gray-500">Données non disponibles</p>
            </div>
            <div className="text-center">
              <h3 className="font-semibold mb-2">AUC</h3>
              <div className="text-2xl font-bold text-gray-400">--</div>
              <p className="text-xs text-gray-500">Données non disponibles</p>
            </div>
            <div className="text-center">
              <h3 className="font-semibold mb-2">ROC</h3>
              <div className="text-2xl font-bold text-gray-400">--</div>
              <p className="text-xs text-gray-500">Données non disponibles</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Matrice de Confusion */}
            <div>
              <h3 className="font-semibold mb-4">Matrice de Confusion</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-100 p-4 rounded text-center">
                  <div className="text-sm text-gray-600">Vrais Positifs</div>
                  <div className="text-xl font-bold text-gray-400">--</div>
                </div>
                <div className="bg-gray-100 p-4 rounded text-center">
                  <div className="text-sm text-gray-600">Faux Positifs</div>
                  <div className="text-xl font-bold text-gray-400">--</div>
                </div>
                <div className="bg-gray-100 p-4 rounded text-center">
                  <div className="text-sm text-gray-600">Faux Négatifs</div>
                  <div className="text-xl font-bold text-gray-400">--</div>
                </div>
                <div className="bg-gray-100 p-4 rounded text-center">
                  <div className="text-sm text-gray-600">Vrais Négatifs</div>
                  <div className="text-xl font-bold text-gray-400">--</div>
                </div>
              </div>
              <p className="text-center text-sm text-gray-500 mt-2">Matrice vide</p>
            </div>

            {/* Classification Report */}
            <div>
              <h3 className="font-semibold mb-4">Classification Report</h3>
              <div className="overflow-x-auto">
                <table className="w-full border border-gray-200 rounded-lg">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="text-left p-3 border-b">Classe</th>
                      <th className="text-left p-3 border-b">Precision</th>
                      <th className="text-left p-3 border-b">Recall</th>
                      <th className="text-left p-3 border-b">F1-Score</th>
                      <th className="text-left p-3 border-b">Support</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-gray-500">
                        Rapport non généré
                      </td>
                    </tr>
                  </tbody>
                </table>
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
