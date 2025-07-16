import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  faCheck
} from '@fortawesome/free-solid-svg-icons';

export default function ClientPredictions() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [modelType, setModelType] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
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

      {/* Formulaire de création de prédiction */}
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
                  <SelectItem value="stock-optimization">Optimisation des stocks</SelectItem>
                  <SelectItem value="sales-forecast">Prévision des ventes</SelectItem>
                  <SelectItem value="maintenance-prediction">Maintenance prédictive</SelectItem>
                  <SelectItem value="energy-optimization">Optimisation énergétique</SelectItem>
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

      {/* Historique des prédictions */}
      {predictions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FontAwesomeIcon icon={faHistory} className="h-5 w-5 text-purple-600" />
              <span>Historique des prédictions</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                      Fichier
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                      Modèle
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                      Statut
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                      Résultats
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {predictions.map((prediction) => (
                    <tr key={prediction.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="py-3 px-4">
                        <div>
                          <p className="text-gray-900 dark:text-white font-medium">{prediction.fileName}</p>
                          <p className="text-sm text-gray-500">{prediction.dataSize}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                        {prediction.modelType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(prediction.status)}`}>
                          <FontAwesomeIcon 
                            icon={getStatusIcon(prediction.status)} 
                            className={`mr-1 h-3 w-3 ${prediction.status === 'processing' ? 'animate-spin' : ''}`} 
                          />
                          {prediction.status === 'uploading' && 'Chargement'}
                          {prediction.status === 'processing' && 'Analyse'}
                          {prediction.status === 'completed' && 'Terminé'}
                          {prediction.status === 'error' && 'Erreur'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {prediction.results ? (
                          <div className="text-sm">
                            <p className="text-green-600">Précision: {prediction.results.accuracy.toFixed(1)}%</p>
                            <p className="text-blue-600">Confiance: {prediction.results.confidence.toFixed(1)}%</p>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm">En attente</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-500">
                        {new Date(prediction.createdAt).toLocaleDateString('fr-FR')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Résultats détaillés pour les prédictions terminées */}
      {predictions.filter(p => p.status === 'completed' && p.results).map((prediction) => (
        <Card key={`results-${prediction.id}`}>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FontAwesomeIcon icon={faChartBar} className="h-5 w-5 text-green-600" />
              <span>Résultats - {prediction.fileName}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {prediction.results && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <h4 className="font-semibold text-green-800 dark:text-green-300">Précision du modèle</h4>
                    <p className="text-2xl font-bold text-green-600">{prediction.results.accuracy.toFixed(1)}%</p>
                  </div>
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <h4 className="font-semibold text-blue-800 dark:text-blue-300">Niveau de confiance</h4>
                    <p className="text-2xl font-bold text-blue-600">{prediction.results.confidence.toFixed(1)}%</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Prédictions détaillées</h4>
                  <div className="space-y-2">
                    {prediction.results.predictions.map((pred, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{pred.input}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{pred.output}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-blue-600">{(pred.probability * 100).toFixed(0)}%</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}

      {/* Message si aucune prédiction */}
      {predictions.length === 0 && (
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
    </div>
  );
}