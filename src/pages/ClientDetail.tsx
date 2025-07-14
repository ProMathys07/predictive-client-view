
import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Play, Pause, Power, PowerOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useCompanies } from '@/contexts/CompanyContext';
import AddModelDialog from '@/components/AddModelDialog';

export default function ClientDetail() {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const { getCompanyById, updateCompany, updateActiveModels } = useCompanies();
  const [models, setModels] = useState<any[]>([]); // Tableau vide par défaut
  const [showAddModelDialog, setShowAddModelDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [modelToDelete, setModelToDelete] = useState<string | null>(null);

  const company = getCompanyById(clientId || '');
  const isCompanyActive = company?.status === 'active';

  // Calculer et mettre à jour le nombre de modèles actifs
  const updateActiveModelsCount = (newModels: typeof models) => {
    const activeCount = newModels.filter(model => model.isActive).length;
    if (clientId && company) {
      updateActiveModels(clientId, activeCount);
      updateCompany(clientId, { modelsCount: newModels.length });
    }
  };

  const handleToggleCompany = () => {
    if (company) {
      updateCompany(company.id, {
        status: isCompanyActive ? 'inactive' : 'active'
      });
    }
  };

  const handleToggleModel = (modelId: string) => {
    const newModels = models.map(model => 
      model.id === modelId 
        ? { ...model, isActive: !model.isActive }
        : model
    );
    setModels(newModels);
    updateActiveModelsCount(newModels);
  };

  const handleDeleteModel = (modelId: string) => {
    setModelToDelete(modelId);
    setShowDeleteDialog(true);
  };

  const confirmDeleteModel = () => {
    if (modelToDelete) {
      const newModels = models.filter(model => model.id !== modelToDelete);
      setModels(newModels);
      updateActiveModelsCount(newModels);
      setModelToDelete(null);
      setShowDeleteDialog(false);
    }
  };

  const cancelDeleteModel = () => {
    setModelToDelete(null);
    setShowDeleteDialog(false);
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
    const newModels = [...models, newModel];
    setModels(newModels);
    updateActiveModelsCount(newModels);
  };

  const handleModelClick = (modelId: string) => {
    navigate(`/client/${clientId}/model/${modelId}`);
  };

  const clientInfo = {
    name: company?.name || 'TechCorp Solutions',
    description: company?.description || 'Entreprise spécialisée dans les solutions technologiques innovantes',
    numeroClient: 'TC-2024-001',
    telephone: company?.contact?.phone || '+33 1 23 45 67 89',
    email: company?.contact?.email || 'contact@techcorp-solutions.fr',
    adresse: '123 Avenue des Champs-Élysées, 75008 Paris',
    status: company?.status || 'active',
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
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleToggleCompany}
            className="text-gray-700 border-gray-300 hover:bg-gray-50"
          >
            {isCompanyActive ? (
              <>
                <PowerOff className="h-4 w-4 mr-2" />
                Désactiver
              </>
            ) : (
              <>
                <Power className="h-4 w-4 mr-2" />
                Activer
              </>
            )}
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setShowAddModelDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nouveau Modèle
          </Button>
        </div>
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
            {models.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg mb-4">Aucun modèle créé pour ce client</p>
                <p className="text-gray-400 text-sm mb-6">
                  Commencez par ajouter un nouveau modèle pour ce client
                </p>
                <Button 
                  className="bg-blue-600 hover:bg-blue-700" 
                  onClick={() => setShowAddModelDialog(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter le premier modèle
                </Button>
              </div>
            ) : (
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
            )}
          </div>
        </TabsContent>

        <TabsContent value="info" className="space-y-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Info Client</h2>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${clientInfo.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className={`text-sm font-medium ${clientInfo.status === 'active' ? 'text-green-600' : 'text-red-600'}`}>
                  {clientInfo.status === 'active' ? 'Actif' : 'Inactif'}
                </span>
              </div>
            </div>
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirmation de suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer ce modèle ?
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-between space-x-2 pt-4">
            <Button
              variant="outline"
              onClick={confirmDeleteModel}
            >
              Oui
            </Button>
            <Button
              variant="destructive"
              onClick={cancelDeleteModel}
            >
              Non
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
