
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  BookOpen, 
  Play, 
  CheckCircle,
  ArrowRight,
  Users,
  BarChart3,
  Settings,
  Brain,
  Lightbulb,
  Target
} from 'lucide-react';

// Configuration des sections du tutoriel
const tutorialSections = [
  {
    id: 'dashboard',
    title: 'Tableau de Bord',
    icon: BarChart3,
    description: 'Découvrez les métriques principales et la vue d\'ensemble',
    steps: [
      'Consulter les métriques en temps réel',
      'Analyser les graphiques de performance',
      'Filtrer les données par période',
      'Exporter les rapports'
    ]
  },
  {
    id: 'clients',
    title: 'Gestion des Clients',
    icon: Users,
    description: 'Gérez vos clients et suivez leur activité',
    steps: [
      'Ajouter un nouveau client',
      'Consulter les détails d\'un client',
      'Suivre les modèles actifs',
      'Analyser les prédictions'
    ]
  },
  {
    id: 'models',
    title: 'Modèles IA',
    icon: Brain,
    description: 'Configurez et déployez vos modèles d\'intelligence artificielle',
    steps: [
      'Créer un nouveau modèle',
      'Configurer les paramètres',
      'Tester les performances',
      'Déployer en production'
    ]
  },
  {
    id: 'settings',
    title: 'Paramètres',
    icon: Settings,
    description: 'Personnalisez votre interface et gérez votre profil',
    steps: [
      'Modifier votre profil',
      'Changer le thème',
      'Configurer les notifications',
      'Gérer les préférences'
    ]
  }
];

// Page tutoriel avec guide interactif
export default function Tutorial() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

  // Fonction pour marquer une étape comme terminée
  const toggleStep = (stepId: string) => {
    setCompletedSteps(prev => 
      prev.includes(stepId) 
        ? prev.filter(id => id !== stepId)
        : [...prev, stepId]
    );
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* En-tête */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <BookOpen className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Tutoriel AIDataPME
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-300">
          Apprenez à utiliser efficacement votre dashboard d'administration
        </p>
      </div>

      {/* Barre de progression */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium">Progression du tutoriel</span>
            <span className="text-sm text-gray-500">
              {completedSteps.length} / {tutorialSections.reduce((acc, section) => acc + section.steps.length, 0)} étapes
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ 
                width: `${(completedSteps.length / tutorialSections.reduce((acc, section) => acc + section.steps.length, 0)) * 100}%` 
              }}
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Menu des sections */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Sections</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {tutorialSections.map((section) => (
                <Button
                  key={section.id}
                  variant={activeSection === section.id ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => setActiveSection(section.id)}
                >
                  <section.icon className="h-4 w-4 mr-2" />
                  {section.title}
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Contenu de la section active */}
        <div className="lg:col-span-2">
          {tutorialSections.map((section) => (
            activeSection === section.id && (
              <Card key={section.id}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <section.icon className="h-5 w-5" />
                    <span>{section.title}</span>
                  </CardTitle>
                  <p className="text-gray-600 dark:text-gray-300">
                    {section.description}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {section.steps.map((step, index) => {
                      const stepId = `${section.id}-${index}`;
                      const isCompleted = completedSteps.includes(stepId);
                      
                      return (
                        <div
                          key={stepId}
                          className={`flex items-center space-x-3 p-3 rounded-lg border transition-colors cursor-pointer ${
                            isCompleted 
                              ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                              : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700'
                          }`}
                          onClick={() => toggleStep(stepId)}
                        >
                          <div className="flex-shrink-0">
                            {isCompleted ? (
                              <CheckCircle className="h-5 w-5 text-green-600" />
                            ) : (
                              <div className="h-5 w-5 rounded-full border-2 border-gray-300 dark:border-gray-600" />
                            )}
                          </div>
                          <span className={`flex-1 ${isCompleted ? 'text-green-800 dark:text-green-200' : 'text-gray-700 dark:text-gray-300'}`}>
                            {step}
                          </span>
                          <ArrowRight className="h-4 w-4 text-gray-400" />
                        </div>
                      );
                    })}
                  </div>

                  {/* Boutons d'action */}
                  <div className="flex space-x-2 mt-6">
                    <Button className="flex items-center space-x-2">
                      <Play className="h-4 w-4" />
                      <span>Démarrer la démonstration</span>
                    </Button>
                    <Button variant="outline">
                      <span>Voir la documentation</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          ))}
        </div>
      </div>

      {/* Conseils rapides */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Lightbulb className="h-5 w-5" />
            <span>Conseils Rapides</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start space-x-3">
              <Target className="h-5 w-5 text-blue-600 mt-1" />
              <div>
                <h4 className="font-medium">Raccourcis clavier</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Utilisez Ctrl+D pour accéder au dashboard rapidement
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Target className="h-5 w-5 text-green-600 mt-1" />
              <div>
                <h4 className="font-medium">Thème adaptatif</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Le thème s'adapte automatiquement à vos préférences système
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
