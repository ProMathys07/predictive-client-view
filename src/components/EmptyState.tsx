
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloud, faDatabase } from '@fortawesome/free-solid-svg-icons';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: 'cloud' | 'database';
}

export default function EmptyState({ title, description, icon = 'cloud' }: EmptyStateProps) {
  const iconComponent = icon === 'cloud' ? faCloud : faDatabase;

  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-16">
        <FontAwesomeIcon 
          icon={iconComponent} 
          className="h-16 w-16 text-gray-300 mb-4" 
        />
        <h3 className="text-lg font-semibold text-gray-600 mb-2">{title}</h3>
        <p className="text-gray-500 text-center max-w-md">{description}</p>
      </CardContent>
    </Card>
  );
}
