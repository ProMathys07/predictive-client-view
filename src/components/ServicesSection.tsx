
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import ServiceCard from './ServiceCard';
import { useToast } from '@/hooks/use-toast';

interface Service {
  id: string;
  title: string;
  status: 'active' | 'inactive';
  lastModified: string;
}

export default function ServicesSection() {
  const [services, setServices] = useState<Service[]>([
    {
      id: '1',
      title: 'Diagnostic',
      status: 'active',
      lastModified: '2 heures'
    },
    {
      id: '2',
      title: 'Prototype mensuel',
      status: 'active',
      lastModified: '1 jour'
    },
    {
      id: '3',
      title: 'Prototype',
      status: 'active',
      lastModified: '3 jours'
    },
    {
      id: '4',
      title: 'Déploiement',
      status: 'active',
      lastModified: '1 semaine'
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newServiceTitle, setNewServiceTitle] = useState('');
  const { toast } = useToast();

  const handleAddService = () => {
    if (newServiceTitle.trim()) {
      const newService: Service = {
        id: Date.now().toString(),
        title: newServiceTitle.trim(),
        status: 'active',
        lastModified: 'À l\'instant'
      };
      setServices(prev => [...prev, newService]);
      setNewServiceTitle('');
      setShowAddForm(false);
      toast({
        title: "Service ajouté",
        description: `Le service "${newServiceTitle}" a été créé.`,
      });
    }
  };

  const handleEditService = (updatedService: Service) => {
    setServices(prev => prev.map(service => 
      service.id === updatedService.id 
        ? { ...updatedService, lastModified: 'À l\'instant' }
        : service
    ));
  };

  const handleDeleteService = (serviceId: string) => {
    setServices(prev => prev.filter(service => service.id !== serviceId));
  };

  const handleServiceHistory = (serviceId: string) => {
    const service = services.find(s => s.id === serviceId);
    toast({
      title: "Historique du service",
      description: `Affichage de l'historique pour "${service?.title}".`,
    });
    // Ici vous pourrez implémenter l'ouverture d'un modal avec l'historique
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">Services</CardTitle>
          <Button onClick={() => setShowAddForm(!showAddForm)}>
            <FontAwesomeIcon icon={faPlus} className="h-4 w-4 mr-2" />
            Ajouter un service
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {showAddForm && (
          <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border">
            <h3 className="text-lg font-medium mb-3">Nouveau service</h3>
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Nom du service"
                value={newServiceTitle}
                onChange={(e) => setNewServiceTitle(e.target.value)}
                className="flex-1 px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
              />
              <Button onClick={handleAddService}>
                Ajouter
              </Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Annuler
              </Button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {services.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onEdit={handleEditService}
              onDelete={handleDeleteService}
              onHistory={handleServiceHistory}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
