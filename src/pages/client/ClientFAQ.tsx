import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faQuestionCircle, 
  faSearch, 
  faChevronDown, 
  faChevronUp,
  faBrain,
  faUpload,
  faShieldAlt,
  faHeadset,
  faCog
} from '@fortawesome/free-solid-svg-icons';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'general' | 'predictions' | 'security' | 'technical' | 'support';
  icon: any;
}

const faqData: FAQItem[] = [
  {
    id: '1',
    question: 'Comment commencer avec AIDataPME ?',
    answer: 'Chargez vos données, choisissez un modèle et lancez votre première prédiction en quelques clics. Notre interface intuitive vous guide à chaque étape.',
    category: 'general',
    icon: faBrain
  },
  {
    id: '1b',
    question: 'Comment fonctionne la plateforme AIDataPME ?',
    answer: 'AIDataPME utilise des algorithmes d\'intelligence artificielle avancés pour analyser vos données et générer des prédictions précises. Vous chargez vos fichiers, sélectionnez un modèle adapté, et notre système traite vos données pour vous fournir des insights exploitables.',
    category: 'general',
    icon: faBrain
  },
  {
    id: '1c',
    question: 'Combien coûte le service ?',
    answer: 'Nos tarifs démarrent à 29€/mois. Contactez-nous pour un devis personnalisé selon vos besoins. Nous proposons plusieurs formules adaptées aux PME.',
    category: 'general',
    icon: faBrain
  },
  {
    id: '2',
    question: 'Quels types de fichiers puis-je charger ?',
    answer: 'Vous pouvez charger des fichiers CSV, Excel (.xlsx, .xls), JSON et TXT. Assurez-vous que vos données sont bien structurées avec des colonnes clairement définies pour obtenir les meilleurs résultats.',
    category: 'predictions',
    icon: faUpload
  },
  {
    id: '3',
    question: 'Mes données sont-elles sécurisées ?',
    answer: 'Absolument. Toutes vos données sont chiffrées en transit et au repos. Nous respectons le RGPD et ne partageons jamais vos données avec des tiers. Vous restez propriétaire de vos données et pouvez les supprimer à tout moment.',
    category: 'security',
    icon: faShieldAlt
  },
  {
    id: '4',
    question: 'Combien de temps prend une prédiction ?',
    answer: 'Le temps de traitement dépend de la taille de vos données et de la complexité du modèle choisi. En général, comptez entre 2 à 10 minutes pour des fichiers de taille moyenne (< 50MB).',
    category: 'predictions',
    icon: faBrain
  },
  {
    id: '5',
    question: 'Comment interpréter les résultats de précision ?',
    answer: 'La précision indique le pourcentage de prédictions correctes sur l\'ensemble de test. Un score de 85% signifie que le modèle prédit correctement 85% des cas. La confiance indique la certitude du modèle pour chaque prédiction.',
    category: 'predictions',
    icon: faBrain
  },
  {
    id: '6',
    question: 'Que faire si j\'ai une erreur lors du chargement ?',
    answer: 'Vérifiez d\'abord le format de votre fichier et sa taille (max 100MB). Assurez-vous que vos colonnes ont des noms explicites et qu\'il n\'y a pas de caractères spéciaux. Si le problème persiste, contactez notre support.',
    category: 'technical',
    icon: faCog
  },
  {
    id: '7',
    question: 'Comment contacter le support technique ?',
    answer: 'Vous pouvez nous contacter via l\'onglet "Feedback" de votre interface, par email à support@aidatapme.com ou par téléphone au +33 1 23 45 67 89. Notre équipe répond sous 24h pour les priorités moyennes.',
    category: 'support',
    icon: faHeadset
  },
  {
    id: '8',
    question: 'Puis-je télécharger mes résultats ?',
    answer: 'Oui, tous vos résultats de prédictions peuvent être exportés au format CSV ou PDF depuis votre historique. Vous pouvez également obtenir un rapport détaillé avec graphiques et métriques.',
    category: 'predictions',
    icon: faUpload
  },
  {
    id: '9',
    question: 'Y a-t-il une limite au nombre de prédictions ?',
    answer: 'Cela dépend de votre abonnement. Consultez votre profil pour voir vos quotas actuels. En cas de dépassement, vous pouvez upgrader votre plan ou contacter notre équipe commerciale.',
    category: 'general',
    icon: faBrain
  },
  {
    id: '10',
    question: 'Les modèles s\'améliorent-ils avec le temps ?',
    answer: 'Oui, nos modèles sont régulièrement mis à jour et entraînés sur de nouvelles données pour améliorer leur performance. Vos prédictions passées restent accessibles et comparables.',
    category: 'technical',
    icon: faCog
  }
];

const categoryLabels = {
  general: 'Général',
  predictions: 'Prédictions',
  security: 'Sécurité',
  technical: 'Technique',
  support: 'Support'
};

const categoryColors = {
  general: 'text-blue-600',
  predictions: 'text-purple-600',
  security: 'text-green-600',
  technical: 'text-orange-600',
  support: 'text-red-600'
};

export default function ClientFAQ() {
  const [searchTerm, setSearchTerm] = useState('');
  const [openItems, setOpenItems] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredFAQ = faqData.filter(item => {
    const matchesSearch = item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleItem = (id: string) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const categories = Object.keys(categoryLabels) as Array<keyof typeof categoryLabels>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <FontAwesomeIcon icon={faQuestionCircle} className="h-8 w-8 text-blue-600" />
          Foire Aux Questions
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Trouvez rapidement les réponses à vos questions sur l'utilisation d'AIDataPME
        </p>
      </div>

      {/* Recherche et filtres */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {/* Barre de recherche */}
            <div className="relative">
              <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Rechercher dans la FAQ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filtres par catégorie */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === 'all' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                Toutes
              </button>
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category 
                      ? `bg-blue-600 text-white` 
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {categoryLabels[category]}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Questions et réponses */}
      <div className="space-y-4">
        {filteredFAQ.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <FontAwesomeIcon icon={faQuestionCircle} className="h-12 w-12 mb-4 text-gray-300" />
                <p>Aucune question trouvée pour votre recherche</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredFAQ.map((item) => (
            <Card key={item.id}>
              <Collapsible 
                open={openItems.includes(item.id)}
                onOpenChange={() => toggleItem(item.id)}
              >
                <CollapsibleTrigger className="w-full">
                  <CardHeader className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <CardTitle className="flex items-center justify-between text-left">
                      <div className="flex items-center gap-3">
                        <FontAwesomeIcon 
                          icon={item.icon} 
                          className={`h-5 w-5 ${categoryColors[item.category]}`} 
                        />
                        <span className="text-gray-900 dark:text-white">{item.question}</span>
                      </div>
                      <FontAwesomeIcon 
                        icon={openItems.includes(item.id) ? faChevronUp : faChevronDown} 
                        className="h-4 w-4 text-gray-400" 
                      />
                    </CardTitle>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="pt-0">
                    <div className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {item.answer}
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      <span className={`text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 ${categoryColors[item.category]}`}>
                        {categoryLabels[item.category]}
                      </span>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          ))
        )}
      </div>

      {/* Contact pour questions non trouvées */}
      <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <CardContent className="pt-6">
          <div className="text-center">
            <FontAwesomeIcon icon={faHeadset} className="h-8 w-8 text-blue-600 mb-3" />
            <h3 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">
              Vous ne trouvez pas votre réponse ?
            </h3>
            <p className="text-blue-800 dark:text-blue-300 mb-4">
              Notre équipe support est là pour vous aider ! Contactez-nous via l'onglet Feedback.
            </p>
            <div className="flex items-center justify-center gap-4 text-sm">
              <span className="text-blue-700 dark:text-blue-300">
                <FontAwesomeIcon icon={faHeadset} className="mr-1" />
                support@aidatapme.com
              </span>
              <span className="text-blue-700 dark:text-blue-300">
                +33 1 23 45 67 89
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}