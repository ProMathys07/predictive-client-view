
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faFileAlt, 
  faRobot, 
  faServer, 
  faChartPie, 
  faCheck, 
  faTasks,
  faTools,
  faDatabase,
  faUsers,
  faCloudUploadAlt,
  faUniversity,
  faChartLine
} from '@fortawesome/free-solid-svg-icons';

export default function Services() {
  // Configuration des packs de services
  const servicePackages = [
    {
      id: 'diagnostic',
      name: 'Diagnostic',
      price: '850€',
      commitment: 'Sans engagement',
      duration: '5 jours',
      mainFeature: 'Analyse de Données complète',
      icon: faChartPie,
      color: 'blue',
      features: [
        'Exploration de vos données existantes',
        'Visualisations avancées et tableaux de bord',
        'Identification des opportunités d\'optimisation',
        'Audit complet de votre patrimoine data',
      ],
      deliverable: 'Rapport d\'analyse complet avec recommandations',
      maintenance: null,
      ctaText: 'Choisir le Diagnostic'
    },
    {
      id: 'protoMonthly',
      name: 'Prototype Mensuel',
      price: '490€/Mois',
      commitment: 'Engagement 6 mois',
      duration: '1-2 semaines',
      mainFeature: 'Prototypage IA',
      icon: faRobot,
      color: 'green',
      features: [
        'Conception de modèles IA personnalisés',
        'Mise à Disposition d\'un Outil Web Dédié',
        'Suivi Basique de la Performance Client',
        'Validation des performances et ROI',
      ],
      maintenance: 'Inclus',
      deliverable: 'Rapport + Prototype fonctionnel avec démonstration',
      ctaText: 'Choisir le Prototype Mensuel'
    },
    {
      id: 'prototype',
      name: 'Prototype',
      price: '2 900€',
      commitment: 'Sans engagement',
      duration: '1-2 semaines',
      mainFeature: 'Prototypage IA',
      icon: faTools,
      color: 'purple',
      features: [
        'Conception de modèles IA personnalisés',
        'Mise à Disposition d\'un Outil Web Dédié',
        'Suivi Basique de la Performance Client',
        'Validation des performances et ROI',
        'Documentation technique complète et droits de la solution',
      ],
      maintenance: '150€/mois',
      deliverable: 'Rapport + Prototype fonctionnel avec démonstration',
      ctaText: 'Choisir le Prototype'
    },
    {
      id: 'deployment',
      name: 'Déploiement',
      price: '7 500€',
      commitment: 'Sans engagement',
      duration: '3-5 semaines',
      mainFeature: 'Déploiement & Intégration',
      icon: faServer,
      color: 'orange',
      features: [
        'Mise en production en « Temps Réel »',
        'Intégration avec vos systèmes actuels',
        'Hébergement sécurisé Cloud',
        'Formation de vos équipes',
        'Documentation technique complète et droits de la solution',
      ],
      maintenance: '250€/mois',
      deliverable: 'Solution IA 100% opérationnelle',
      ctaText: 'Choisir le Déploiement'
    }
  ];

  // Obtenir la couleur de fond en fonction de la couleur du pack
  const getBackgroundColor = (color: string) => {
    const colorMap: { [key: string]: string } = {
      blue: 'bg-blue-50 dark:bg-blue-900/20',
      green: 'bg-green-50 dark:bg-green-900/20',
      purple: 'bg-purple-50 dark:bg-purple-900/20',
      orange: 'bg-orange-50 dark:bg-orange-900/20',
    };
    return colorMap[color] || 'bg-gray-50 dark:bg-gray-800/50';
  };

  // Obtenir la couleur de l'icône en fonction de la couleur du pack
  const getIconColor = (color: string) => {
    const colorMap: { [key: string]: string } = {
      blue: 'text-blue-600 dark:text-blue-400',
      green: 'text-green-600 dark:text-green-400',
      purple: 'text-purple-600 dark:text-purple-400',
      orange: 'text-orange-600 dark:text-orange-400',
    };
    return colorMap[color] || 'text-gray-600 dark:text-gray-400';
  };

  // Obtenir la couleur du bouton en fonction de la couleur du pack
  const getButtonClass = (color: string) => {
    const colorMap: { [key: string]: string } = {
      blue: 'bg-blue-600 hover:bg-blue-700',
      green: 'bg-green-600 hover:bg-green-700',
      purple: 'bg-purple-600 hover:bg-purple-700',
      orange: 'bg-orange-600 hover:bg-orange-700',
    };
    return colorMap[color] || 'bg-gray-600 hover:bg-gray-700';
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Nos Services
        </h1>
        <div className="flex justify-center mb-6">
          <div className="h-20 w-20 rounded-full bg-white dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center">
            <span className="text-gray-400 dark:text-gray-500 text-sm">Logo</span>
          </div>
        </div>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
          Notre Approche est Modulaire
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {servicePackages.map((pack) => (
          <Card key={pack.id} className="flex flex-col h-full shadow-lg">
            <CardHeader className={`${getBackgroundColor(pack.color)} border-b`}>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-bold">{pack.name}</CardTitle>
                <FontAwesomeIcon icon={pack.icon} className={`h-6 w-6 ${getIconColor(pack.color)}`} />
              </div>
              <div className="mt-2">
                <span className="text-2xl font-bold">{pack.price}</span>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  ({pack.commitment})
                </p>
                <p className="text-sm font-medium mt-1">
                  {pack.duration}
                </p>
              </div>
            </CardHeader>
            <CardContent className="flex-grow py-6 px-5">
              <div className="mb-4">
                <p className="font-medium text-base text-center pb-2 border-b border-gray-200 dark:border-gray-700">
                  {pack.mainFeature}
                </p>
              </div>
              <ul className="space-y-3 mt-4">
                {pack.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <FontAwesomeIcon icon={faCheck} className="h-4 w-4 text-green-500 mt-1 mr-2" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
                {pack.maintenance && (
                  <li className="flex items-start pt-2 border-t border-gray-200 dark:border-gray-700 mt-4">
                    <span className="text-sm font-medium">Maintenance : {pack.maintenance}</span>
                  </li>
                )}
              </ul>
            </CardContent>
            <CardFooter className="pt-2 pb-4 px-5 flex flex-col">
              <p className="text-sm font-medium mb-3">
                Livrable : {pack.deliverable}
              </p>
              <Button className={`w-full ${getButtonClass(pack.color)}`}>
                {pack.ctaText}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
