import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUpload, 
  faBrain, 
  faChartBar, 
  faSpinner,
  faCheckCircle
} from '@fortawesome/free-solid-svg-icons';

interface PredictionResult {
  category: string;
  prediction: string;
  confidence: number;
  impact: 'positive' | 'negative' | 'neutral';
  value: string;
}

export default function ClientPredictions() {
  const [isLoading, setIsLoading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [predictionResults, setPredictionResults] = useState<PredictionResult[]>([]);
  const { toast } = useToast();

  const handleLoadData = async () => {
    setIsLoading(true);
    
    // Simulation du chargement des données
    setTimeout(() => {
      setDataLoaded(true);
      setIsLoading(false);
      toast({
        title: "Données chargées",
        description: "Les données ont été chargées avec succès.",
      });
    }, 2000);
  };

  const handleMakePrediction = async () => {
    if (!dataLoaded) {
      toast({
        title: "Erreur",
        description: "Veuillez d'abord charger les données.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    // Simulation de la prédiction
    setTimeout(() => {
      const mockResults: PredictionResult[] = [
        {
          category: 'Ventes Q1 2024',
          prediction: 'Augmentation prévue de 15%',
          confidence: 87,
          impact: 'positive',
          value: '+125 000 €'
        },
        {
          category: 'Stock optimal',
          prediction: 'Réduction possible de 20%',
          confidence: 92,
          impact: 'positive',
          value: '-45 000 € coûts'
        },
        {
          category: 'Maintenance équipements',
          prediction: 'Intervention nécessaire en Mars',
          confidence: 78,
          impact: 'neutral',
          value: '12 000 € budget'
        },
        {
          category: 'Consommation énergétique',
          prediction: 'Pic attendu en Février',
          confidence: 85,
          impact: 'negative',
          value: '+8 500 € coûts'
        }
      ];

      setPredictionResults(mockResults);
      setIsLoading(false);
      toast({
        title: "Prédiction terminée",
        description: "Les résultats sont disponibles ci-dessous.",
      });
    }, 3000);
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'positive': return 'text-green-600 dark:text-green-400';
      case 'negative': return 'text-red-600 dark:text-red-400';
      default: return 'text-blue-600 dark:text-blue-400';
    }
  };

  const getImpactBg = (impact: string) => {
    switch (impact) {
      case 'positive': return 'bg-green-100 dark:bg-green-900/20';
      case 'negative': return 'bg-red-100 dark:bg-red-900/20';
      default: return 'bg-blue-100 dark:bg-blue-900/20';
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
          Analysez vos données et obtenez des prédictions personnalisées
        </p>
      </div>

      {/* Actions principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FontAwesomeIcon icon={faUpload} className="h-5 w-5 text-blue-600" />
              <span>Étape 1: Charger les données</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Chargez vos données récentes pour alimenter le modèle de prédiction.
            </p>
            <Button 
              onClick={handleLoadData}
              disabled={isLoading || dataLoaded}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} spin className="mr-2 h-4 w-4" />
                  Chargement...
                </>
              ) : dataLoaded ? (
                <>
                  <FontAwesomeIcon icon={faCheckCircle} className="mr-2 h-4 w-4" />
                  Données chargées
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faUpload} className="mr-2 h-4 w-4" />
                  Charger les données
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FontAwesomeIcon icon={faBrain} className="h-5 w-5 text-purple-600" />
              <span>Étape 2: Faire la prédiction</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Lancez l'analyse prédictive basée sur vos données chargées.
            </p>
            <Button 
              onClick={handleMakePrediction}
              disabled={!dataLoaded || isLoading}
              className="w-full"
              variant={dataLoaded ? "default" : "secondary"}
            >
              {isLoading ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} spin className="mr-2 h-4 w-4" />
                  Analyse en cours...
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faBrain} className="mr-2 h-4 w-4" />
                  Faire la prédiction
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Tableau récapitulatif des prédictions */}
      {predictionResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FontAwesomeIcon icon={faChartBar} className="h-5 w-5 text-green-600" />
              <span>Résultats des prédictions</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                      Catégorie
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                      Prédiction
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                      Confiance
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                      Impact financier
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {predictionResults.map((result, index) => (
                    <tr key={index} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="py-3 px-4 text-gray-900 dark:text-white font-medium">
                        {result.category}
                      </td>
                      <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                        {result.prediction}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${result.confidence}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {result.confidence}%
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getImpactBg(result.impact)} ${getImpactColor(result.impact)}`}>
                          {result.value}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Visuels statiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Tendances historiques</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <FontAwesomeIcon icon={faChartBar} className="h-8 w-8 text-gray-400 mb-2" />
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Graphique en développement
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Évolution prévue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <FontAwesomeIcon icon={faChartBar} className="h-8 w-8 text-gray-400 mb-2" />
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Résultats en temps réel (bientôt)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}