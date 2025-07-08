
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { time: '00:00', predictions: 12 },
  { time: '04:00', predictions: 19 },
  { time: '08:00', predictions: 45 },
  { time: '12:00', predictions: 67 },
  { time: '16:00', predictions: 89 },
  { time: '20:00', predictions: 56 },
  { time: '24:00', predictions: 23 },
];

export default function PredictionChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Prédictions des dernières 24h</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
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
