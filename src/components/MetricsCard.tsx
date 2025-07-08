
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';

interface MetricsCardProps {
  title: string;
  value: string;
  change: number;
  icon: React.ReactNode;
  trend: 'up' | 'down' | 'neutral';
}

export default function MetricsCard({ title, value, change, icon, trend }: MetricsCardProps) {
  const getTrendColor = () => {
    switch (trend) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4" />;
      case 'down': return <TrendingDown className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">
          {title}
        </CardTitle>
        <div className="text-blue-600">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className={`flex items-center text-xs ${getTrendColor()}`}>
          {getTrendIcon()}
          <span className="ml-1">
            {change > 0 ? '+' : ''}{change}% vs mois dernier
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
