import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Play, Pause, Power, PowerOff, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useCompanies } from '@/contexts/CompanyContext';
import AddModelDialog from '@/components/AddModelDialog';

export default function ClientDetail() {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const { getCompanyById, updateCompany, updateActiveModels, companies } = useCompanies();
  const [models, setModels] = useState<any[]>([]);
  const [deletedModels, setDeletedModels] = useState<any[]>([]);
  const [showAddModelDialog, setShowAddModelDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showRestoreDialog, setShowRestoreDialog] = useState(false);
  const [showPermanentDeleteDialog, setShowPermanentDeleteDialog] = useState(false);
  const [modelToDelete, setModelToDelete] = useState<string | null>(null);
  const [modelToRestore, setModelToRestore] = useState<string | null>(null);
  const [modelToPermanentlyDelete, setModelToPermanentlyDelete] = useState<string | null>(null);

  const company = getCompanyById(clientId || '');
  const isCompanyActive = company?.status === 'active';

  // Charger les modèles sauvegardés au montage du composant
  useEffect(() => {
    if (company?.models) {
      setModels(company.models.filter((m: any) => !m.isDeleted) || []);
      setDeletedModels(company.models.filter((m: any) => m.isDeleted) || []);
    }
  }, [company]);

  // Sauvegarder les modèles dans le contexte
  const saveModelsToCompany = (newModels: any[], newDeletedModels: any[]) => {
    if (clientId && company) {
      const allModels = [...newModels, ...newDeletedModels];
      updateCompany(clientId, { 
        models: allModels,
        modelsCount: newModels.length
      });
      updateActiveModels(clientId, newModels.filter(model => model.isActive).length);
    }
  };

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
    saveModelsToCompany(newModels, deletedModels);
    updateActiveModelsCount(newModels);
  };

  const handleDeleteModel = (modelId: string) => {
    setModelToDelete(modelId);
    setShowDeleteDialog(true);
  };

  const confirmDeleteModel = () => {
    if (modelToDelete) {
      const modelToMove = models.find(model => model.id === modelToDelete);
      if (modelToMove) {
        // Désactiver le modèle et l'ajouter à la corbeille
        const deletedModel = {
          ...modelToMove,
          isActive: false,
          isDeleted: true,
          deletedAt: new Date().toLocaleDateString('fr-FR')
        };
        const newDeletedModels = [...deletedModels, deletedModel];
        setDeletedModels(newDeletedModels);
        
        // Retirer de la liste active
        const newModels = models.filter(model => model.id !== modelToDelete);
        setModels(newModels);
        saveModelsToCompany(newModels, newDeletedModels);
        updateActiveModelsCount(newModels);
      }
      setModelToDelete(null);
      setShowDeleteDialog(false);
    }
  };

  const handleRestoreModel = (modelId: string) => {
    setModelToRestore(modelId);
    setShowRestoreDialog(true);
  };

  const confirmRestoreModel = () => {
    if (modelToRestore) {
      const modelToMove = deletedModels.find(model => model.id === modelToRestore);
      if (modelToMove) {
        // Retirer deletedAt et isDeleted, ajouter à la liste active
        const { deletedAt, isDeleted, ...restoredModel } = modelToMove;
        const newModels = [...models, restoredModel];
        setModels(newModels);
        
        // Retirer de la corbeille
        const newDeletedModels = deletedModels.filter(model => model.id !== modelToRestore);
        setDeletedModels(newDeletedModels);
        saveModelsToCompany(newModels, newDeletedModels);
        updateActiveModelsCount(newModels);
      }
      setModelToRestore(null);
      setShowRestoreDialog(false);
    }
  };

  const handlePermanentDeleteModel = (modelId: string) => {
    setModelToPermanentlyDelete(modelId);
    setShowPermanentDeleteDialog(true);
  };

  const confirmPermanentDeleteModel = () => {
    if (modelToPermanentlyDelete) {
      const newDeletedModels = deletedModels.filter(model => model.id !== modelToPermanentlyDelete);
      setDeletedModels(newDeletedModels);
      saveModelsToCompany(models, newDeletedModels);
      setModelToPermanentlyDelete(null);
      setShowPermanentDeleteDialog(false);
    }
  };

  const cancelDeleteModel = () => {
    setModelToDelete(null);
    setShowDeleteDialog(false);
  };

  const cancelRestoreModel = () => {
    setModelToRestore(null);
    setShowRestoreDialog(false);
  };

  const cancelPermanentDeleteModel = () => {
    setModelToPermanentlyDelete(null);
    setShowPermanentDeleteDialog(false);
  };

  const handleAddModel = (modelData: { name: string; version: string; file?: File }) => {
    const newModel = {
      id: Date.now().toString(), // ID unique basé sur timestamp
      name: modelData.name,
      version: modelData.version,
      isActive: true,
      createdAt: new Date().toLocaleDateString('fr-FR'),
      lastPrediction: 'Jamais',
    };
    const newModels = [...models, newModel];
    setModels(newModels);
    saveModelsToCompany(newModels, deletedModels);
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
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="models">Modèles</TabsTrigger>
          <TabsTrigger value="trash">Corbeille</TabsTrigger>
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

        <TabsContent value="trash" className="space-y-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Modèles supprimés</h2>
            {deletedModels.length === 0 ? (
              <div className="text-center py-12">
                <Trash2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-lg mb-2">Aucun modèle dans la corbeille</p>
                <p className="text-gray-400 text-sm">
                  Les modèles supprimés apparaîtront ici
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {deletedModels.map((model) => (
                  <div
                    key={model.id}
                    className="bg-gray-50 p-4 rounded-lg border border-gray-200 opacity-75"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-lg text-gray-700">{model.name}</h3>
                        <div className="w-3 h-3 rounded-full bg-red-500" />
                      </div>
                      
                      <div className="space-y-2 text-sm text-gray-600">
                        <div>Version: {model.version}</div>
                        <div>Créé le: {model.createdAt}</div>
                        <div>Supprimé le: {model.deletedAt}</div>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-green-700 border-green-300 hover:bg-green-50"
                          onClick={() => handleRestoreModel(model.id)}
                        >
                          <RotateCcw className="h-3 w-3 mr-1" />
                          Restaurer
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handlePermanentDeleteModel(model.id)}
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
            <DialogTitle>Déplacer vers la corbeille</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir déplacer ce modèle vers la corbeille ? Il sera désactivé automatiquement.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-between space-x-2 pt-4">
            <Button
              variant="outline"
              onClick={confirmDeleteModel}
            >
              Oui, déplacer
            </Button>
            <Button
              variant="destructive"
              onClick={cancelDeleteModel}
            >
              Annuler
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Restore Confirmation Dialog */}
      <Dialog open={showRestoreDialog} onOpenChange={setShowRestoreDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Restaurer le modèle</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir restaurer ce modèle ? Il sera remis dans la liste active.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-between space-x-2 pt-4">
            <Button
              variant="outline"
              onClick={confirmRestoreModel}
            >
              Oui, restaurer
            </Button>
            <Button
              variant="destructive"
              onClick={cancelRestoreModel}
            >
              Annuler
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Permanent Delete Confirmation Dialog */}
      <Dialog open={showPermanentDeleteDialog} onOpenChange={setShowPermanentDeleteDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Suppression définitive</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer définitivement ce modèle ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-between space-x-2 pt-4">
            <Button
              variant="outline"
              onClick={confirmPermanentDeleteModel}
            >
              Oui, supprimer définitivement
            </Button>
            <Button
              variant="destructive"
              onClick={cancelPermanentDeleteModel}
            >
              Annuler
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
