
import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AddModelDialog from '@/components/AddModelDialog';

const mockModels = [
  {
    id: '1',
    name: 'Stock Prediction Model',
    version: '2.1.3',
    isActive: true,
    createdAt: '15/01/2024',
    lastPrediction: '2 heures',
  },
  {
    id: '2',
    name: 'Demand Forecasting',
    version: '1.8.1',
    isActive: true,
    createdAt: '10/01/2024',
    lastPrediction: '30 minutes',
  },
  {
    id: '3',
    name: 'Quality Control AI',
    version: '3.0.0',
    isActive: false,
    createdAt: '08/01/2024',
    lastPrediction: '2 jours',
  },
];

const clientInfo = {
  name: 'TechCorp Solutions',
  description: 'Entreprise spécialisée dans les solutions technologiques innovantes',
  numeroClient: 'TC-2024-001',
  telephone: '+33 1 23 45 67 89',
  email: 'contact@techcorp-solutions.fr',
  adresse: '123 Avenue des Champs-Élysées, 75008 Paris',
};

export default function ClientDetail() {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const [models, setModels] = useState(mockModels);
  const [showAddModelDialog, setShowAddModelDialog] = useState(false);

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

  const handleAddModel = (modelData: { name: string; version: string; file?: File }) => {
    const newModel = {
      id: (models.length + 1).toString(),
      name: modelData.name,
      version: modelData.version,
      isActive: true,
      createdAt: new Date().toLocaleDateString('fr-FR'),
      lastPrediction: 'Jamais',
    };
    setModels([...models, newModel]);
  };

  const handleModelClick = (modelId: string) => {
    navigate(`/client/${clientId}/model/${modelId}`);
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
            <h1 className="text-3xl font-bold text-gray-900">Client: {clientInfo.name}</h1>
            <p className="text-gray-600">Gestion des modèles et informations client</p>
          </div>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setShowAddModelDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nouveau Modèle
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="models" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="models">Modèles</TabsTrigger>
          <TabsTrigger value="info">Info Client</TabsTrigger>
        </TabsList>

        <TabsContent value="models" className="space-y-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Modèles du Client</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {models.map((model) => (
                <div
                  key={model.id}
                  className="bg-white p-4 rounded-lg border border-gray-200 cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => handleModelClick(model.id)}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-lg">{model.name}</h3>
                      <div className={`w-3 h-3 rounded-full ${model.isActive ? 'bg-green-500' : 'bg-red-500'}`} />
                    </div>
                    
                    <div className="space-y-2 text-sm text-gray-600">
                      <div>Version: {model.version}</div>
                      <div>Créé le: {model.createdAt}</div>
                      <div>Dernière prédiction: {model.lastPrediction}</div>
                    </div>

                    <div className="flex gap-2 pt-2" onClick={(e) => e.stopPropagation()}>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-gray-700 border-gray-300 hover:bg-gray-50"
                        onClick={() => handleToggleModel(model.id)}
                      >
                        {model.isActive ? (
                          <>
                            <Pause className="h-3 w-3 mr-1" />
                            Désactiver
                          </>
                        ) : (
                          <>
                            <Play className="h-3 w-3 mr-1" />
                            Activer
                          </>
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteModel(model.id)}
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Supprimer
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="info" className="space-y-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Info Client</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-700">Nom du client</h3>
                  <p className="text-gray-900">{clientInfo.name}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700">Description</h3>
                  <p className="text-gray-900">{clientInfo.description}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700">Numéro client</h3>
                  <p className="text-gray-900">{clientInfo.numeroClient}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-700">Téléphone</h3>
                  <p className="text-gray-900">{clientInfo.telephone}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700">Email</h3>
                  <p className="text-gray-900">{clientInfo.email}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700">Adresse</h3>
                  <p className="text-gray-900">{clientInfo.adresse}</p>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Add Model Dialog */}
      <AddModelDialog
        open={showAddModelDialog}
        onOpenChange={setShowAddModelDialog}
        onAddModel={handleAddModel}
      />
    </div>
  );
}
