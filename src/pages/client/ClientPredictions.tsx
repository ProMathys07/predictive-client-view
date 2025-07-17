import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useClient } from '@/contexts/ClientContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUpload, 
  faBrain, 
  faChartBar, 
  faSpinner,
  faFileUpload,
  faHistory,
  faCheck,
  faEye,
  faFlask,
  faRocket
} from '@fortawesome/free-solid-svg-icons';

export default function ClientPredictions() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [modelType, setModelType] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPrediction, setSelectedPrediction] = useState<any>(null);
  const { predictions, createPrediction } = useClient();
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      toast({
        title: "Fichier sélectionné",
        description: `${file.name} est prêt pour l'analyse`,
      });
    }
  };

  const handleCreatePrediction = async () => {
    if (!selectedFile || !modelType) {
      toast({
        title: "Informations manquantes",
        description: "Veuillez sélectionner un fichier et un modèle",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    
    // Création de la prédiction via le hook (qui notifie l'admin)
    const prediction = createPrediction({
      fileName: selectedFile.name,
      dataSize: `${(selectedFile.size / 1024).toFixed(0)} KB`,
      modelType: modelType
    });

    if (prediction) {
      toast({
        title: "Prédiction lancée",
        description: "Votre analyse est en cours de traitement",
      });
      
      // Reset du formulaire
      setSelectedFile(null);
      setModelType('');
      
      // Reset de l'input file
      const fileInput = document.getElementById('file-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    }

    setIsProcessing(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      case 'processing': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20';
      case 'uploading': return 'text-orange-600 bg-orange-100 dark:bg-orange-900/20';
      case 'error': return 'text-red-600 bg-red-100 dark:bg-red-900/20';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return faCheck;
      case 'processing': return faBrain;
      case 'uploading': return faUpload;
      default: return faSpinner;
    }
  };

  const getModelStatusIcon = (modelType: string) => {
    if (modelType.includes('prototype')) return faFlask;
    if (modelType.includes('déploiement')) return faRocket;
    return faBrain;
  };

  const getModelStatusLabel = (modelType: string) => {
    if (modelType.includes('prototype')) return 'Prototype';
    if (modelType.includes('déploiement')) return 'En Déploiement';
    return 'Actif';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Prédictions IA
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Analysez vos données et obtenez des prédictions personnalisées pour votre entreprise
        </p>
      </div>

      {/* Onglets de navigation */}
      <Tabs defaultValue="nouvelle" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="nouvelle">Nouvelle Prédiction</TabsTrigger>
          <TabsTrigger value="historique">Historique des Prédictions</TabsTrigger>
        </TabsList>

        {/* Onglet Nouvelle Prédiction */}
        <TabsContent value="nouvelle" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faFileUpload} className="h-5 w-5 text-blue-600" />
                <span>Nouvelle prédiction</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Sélection de fichier */}
                <div>
                  <Label htmlFor="file-upload">Fichier de données</Label>
                  <Input 
                    id="file-upload"
                    type="file" 
                    accept=".csv,.xlsx,.json"
                    onChange={handleFileChange}
                    className="mt-1"
                  />
                  {selectedFile && (
                    <p className="text-sm text-green-600 mt-1">
                      ✓ {selectedFile.name} ({(selectedFile.size / 1024).toFixed(0)} KB)
                    </p>
                  )}
                </div>

                {/* Sélection du modèle */}
                <div>
                  <Label htmlFor="model-type">Type de modèle IA</Label>
                  <Select value={modelType} onValueChange={setModelType}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Choisir un modèle..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="stock-optimization">
                        <div className="flex items-center space-x-2">
                          <FontAwesomeIcon icon={getModelStatusIcon('stock-optimization')} className="h-4 w-4" />
                          <span>Optimisation des stocks</span>
                          <span className="text-xs bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 px-2 py-1 rounded">
                            {getModelStatusLabel('stock-optimization')}
                          </span>
                        </div>
                      </SelectItem>
                      <SelectItem value="sales-forecast-prototype">
                        <div className="flex items-center space-x-2">
                          <FontAwesomeIcon icon={getModelStatusIcon('sales-forecast-prototype')} className="h-4 w-4" />
                          <span>Prévision des ventes</span>
                          <span className="text-xs bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300 px-2 py-1 rounded">
                            {getModelStatusLabel('sales-forecast-prototype')}
                          </span>
                        </div>
                      </SelectItem>
                      <SelectItem value="maintenance-prediction-déploiement">
                        <div className="flex items-center space-x-2">
                          <FontAwesomeIcon icon={getModelStatusIcon('maintenance-prediction-déploiement')} className="h-4 w-4" />
                          <span>Maintenance prédictive</span>
                          <span className="text-xs bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 px-2 py-1 rounded">
                            {getModelStatusLabel('maintenance-prediction-déploiement')}
                          </span>
                        </div>
                      </SelectItem>
                      <SelectItem value="energy-optimization">
                        <div className="flex items-center space-x-2">
                          <FontAwesomeIcon icon={getModelStatusIcon('energy-optimization')} className="h-4 w-4" />
                          <span>Optimisation énergétique</span>
                          <span className="text-xs bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 px-2 py-1 rounded">
                            {getModelStatusLabel('energy-optimization')}
                          </span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button 
                onClick={handleCreatePrediction}
                disabled={!selectedFile || !modelType || isProcessing}
                className="w-full md:w-auto"
              >
                {isProcessing ? (
                  <>
                    <FontAwesomeIcon icon={faSpinner} spin className="mr-2 h-4 w-4" />
                    Lancement en cours...
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faBrain} className="mr-2 h-4 w-4" />
                    Lancer la prédiction
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Résultats des prédictions completées */}
          {predictions.filter(p => p.status === 'completed' && p.results).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FontAwesomeIcon icon={faChartBar} className="h-5 w-5 text-green-600" />
                  <span>Résultats des prédictions</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {predictions.filter(p => p.status === 'completed' && p.results).map((prediction) => (
                    <div key={`results-${prediction.id}`} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-3">{prediction.fileName}</h4>
                      {prediction.results && (
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 gap-4">
                            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                              <h5 className="font-semibold text-green-800 dark:text-green-300">Précision du modèle</h5>
                              <p className="text-2xl font-bold text-green-600">{prediction.results.accuracy.toFixed(1)}%</p>
                            </div>
                          </div>
                          
                          <div>
                            <h5 className="font-semibold text-gray-900 dark:text-white mb-3">Tableau détaillé des prédictions</h5>
                            <div className="overflow-x-auto">
                              <table className="w-full border border-gray-200 dark:border-gray-700 rounded-lg">
                                <thead>
                                  <tr className="bg-gray-50 dark:bg-gray-800">
                                    <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white border-b">ID</th>
                                    <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white border-b">Données d'entrée</th>
                                    <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white border-b">Prédiction</th>
                                    <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white border-b">Confiance</th>
                                    <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white border-b">Statut</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {prediction.results.predictions.map((pred, index) => (
                                    <tr key={index} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                      <td className="py-3 px-4 text-gray-600 dark:text-gray-400">#{index + 1}</td>
                                      <td className="py-3 px-4 text-gray-900 dark:text-white">{pred.input}</td>
                                      <td className="py-3 px-4 text-gray-900 dark:text-white font-medium">{pred.output}</td>
                                      <td className="py-3 px-4">
                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                          pred.probability >= 0.8 ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300' :
                                          pred.probability >= 0.6 ? 'bg-amber-100 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300' :
                                          'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300'
                                        }`}>
                                          {(pred.probability * 100).toFixed(0)}%
                                        </span>
                                      </td>
                                      <td className="py-3 px-4">
                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                          pred.probability >= 0.8 ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300' :
                                          pred.probability >= 0.6 ? 'bg-amber-100 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300' :
                                          'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300'
                                        }`}>
                                          {pred.probability >= 0.8 ? 'Fiable' : pred.probability >= 0.6 ? 'Incertain' : 'À vérifier'}
                                        </span>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Onglet Historique */}
        <TabsContent value="historique" className="space-y-4">
          {predictions.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FontAwesomeIcon icon={faHistory} className="h-5 w-5 text-purple-600" />
                  <span>Historique des prédictions</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {predictions.map((prediction) => (
                    <div key={prediction.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <FontAwesomeIcon 
                              icon={getStatusIcon(prediction.status)} 
                              className={`h-4 w-4 ${
                                prediction.status === 'completed' ? 'text-green-600' :
                                prediction.status === 'processing' ? 'text-blue-600' :
                                'text-gray-400'
                              }`} 
                            />
                            <h4 className="font-medium text-gray-900 dark:text-white">{prediction.fileName}</h4>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(prediction.status)}`}>
                              {prediction.status === 'uploading' && 'Chargement'}
                              {prediction.status === 'processing' && 'Analyse'}
                              {prediction.status === 'completed' && 'Terminé'}
                              {prediction.status === 'error' && 'Erreur'}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {prediction.modelType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} • {new Date(prediction.createdAt).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {prediction.results && (
                            <div className="text-right text-sm">
                              <p className="text-green-600">Précision: {prediction.results.accuracy.toFixed(1)}%</p>
                              <p className="text-blue-600">Confiance: {prediction.results.confidence.toFixed(1)}%</p>
                            </div>
                          )}
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <FontAwesomeIcon icon={faEye} className="h-4 w-4 mr-2" />
                                Détails
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl">
                              <DialogHeader>
                                <DialogTitle>Détails de la prédiction - {prediction.fileName}</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <h4 className="font-semibold text-gray-900 dark:text-white">Informations générales</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Fichier: {prediction.fileName}</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Taille: {prediction.dataSize}</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Modèle: {prediction.modelType}</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Date: {new Date(prediction.createdAt).toLocaleDateString('fr-FR')}</p>
                                  </div>
                                  {prediction.results && (
                                    <div>
                                      <h4 className="font-semibold text-gray-900 dark:text-white">Résultats</h4>
                                      <p className="text-sm text-green-600">Précision: {prediction.results.accuracy.toFixed(1)}%</p>
                                      <p className="text-sm text-blue-600">Confiance: {prediction.results.confidence.toFixed(1)}%</p>
                                    </div>
                                  )}
                                </div>
                                
                                {prediction.results && (
                                  <div>
                                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Détails des prédictions</h4>
                                    <div className="max-h-64 overflow-y-auto">
                                      <table className="w-full text-sm">
                                        <thead>
                                          <tr className="border-b border-gray-200 dark:border-gray-700">
                                            <th className="text-left py-2 px-3">Entrée</th>
                                            <th className="text-left py-2 px-3">Prédiction</th>
                                            <th className="text-left py-2 px-3">Confiance</th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {prediction.results.predictions.map((pred, index) => (
                                            <tr key={index} className="border-b border-gray-100 dark:border-gray-800">
                                              <td className="py-2 px-3">{pred.input}</td>
                                              <td className="py-2 px-3">{pred.output}</td>
                                              <td className="py-2 px-3">{(pred.probability * 100).toFixed(0)}%</td>
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-12">
                <div className="text-center">
                  <FontAwesomeIcon icon={faBrain} className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Aucune prédiction encore
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Chargez vos données et lancez votre première analyse prédictive
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
