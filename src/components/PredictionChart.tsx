
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useClient } from '@/contexts/ClientContext';

const periodOptions = [
  { value: '1m', label: 'Le dernier mois' },
  { value: '3m', label: 'Les 3 derniers mois' },
  { value: '6m', label: 'Les 6 derniers mois' },
];

// Graphique vide - données par défaut pour l'API REST
const emptyData = [
  { time: '0', predictions: 0 },
  { time: '1', predictions: 0 },
  { time: '2', predictions: 0 },
  { time: '3', predictions: 0 },
  { time: '4', predictions: 0 },
  { time: '5', predictions: 0 },
  { time: '6', predictions: 0 },
];

export default function PredictionChart() {
  const { clientData } = useClient();
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState(periodOptions[0].value);

  // Générer les options de modèles basées sur le nombre de modèles actifs du client
  const getModelOptions = () => {
    const activeModelsCount = clientData?.metrics?.activeModels || 0;
    const modelOptions = [];
    
    for (let i = 1; i <= activeModelsCount; i++) {
      modelOptions.push({
        value: `model${i}`,
        label: `Modèle ${i}`,
      });
    }
    
    return modelOptions;
  };

  const modelOptions = getModelOptions();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Évolution de la performance du modèle</CardTitle>
          <div className="flex gap-4">
            <Select value={selectedModel} onValueChange={setSelectedModel}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sélectionner un modèle" />
              </SelectTrigger>
              <SelectContent>
                {modelOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sélectionner une période" />
              </SelectTrigger>
              <SelectContent>
                {periodOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={emptyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Line 
              type="monotone" 
              dataKey="predictions" 
              stroke="#3b82f6" 
              strokeWidth={2}
              dot={{ fill: '#3b82f6' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
