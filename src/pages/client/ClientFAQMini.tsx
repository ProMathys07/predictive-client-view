import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
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
  faCog,
  faChartBar,
  faFileAlt,
  faUsers,
  faClock,
  faDownload,
  faWifi,
  faKey,
  faDatabase,
  faRocket,
  faLifeRing
} from '@fortawesome/free-solid-svg-icons';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'general' | 'predictions' | 'security' | 'technical' | 'support' | 'data' | 'account';
  icon: any;
}

const miniFAQ: FAQItem[] = [
  // Questions essentielles (8 questions total)
  {
    id: '1',
    question: 'Comment démarrer ?',
    answer: 'Chargez vos données et lancez votre première prédiction.',
    category: 'general',
    icon: faRocket
  },
  {
    id: '2',
    question: 'Quels modèles ?',
    answer: 'Classification, régression, prévisions temporelles.',
    category: 'predictions',
    icon: faBrain
  },
  {
    id: '3',
    question: 'Formats supportés ?',
    answer: 'CSV, Excel (.xlsx). Max 100MB.',
    category: 'technical',
    icon: faUpload
  },
  {
    id: '4',
    question: 'Données sécurisées ?',
    answer: 'Stockage France, RGPD, chiffrement bout-en-bout.',
    category: 'security',
    icon: faShieldAlt
  },
  {
    id: '5',
    question: 'Combien de données ?',
    answer: 'Minimum 100 lignes, idéalement 1000+.',
    category: 'predictions',
    icon: faDatabase
  },
  {
    id: '6',
    question: 'Contacter support ?',
    answer: 'Via Feedback ou support@aidatapme.com',
    category: 'support',
    icon: faHeadset
  },
  {
    id: '7',
    question: 'Exporter résultats ?',
    answer: 'CSV, Excel, PDF disponibles.',
    category: 'technical',
    icon: faDownload
  },
  {
    id: '8',
    question: 'Supprimer données ?',
    answer: 'Suppression immédiate en un clic.',
    category: 'security',
    icon: faShieldAlt
  }
];

const categoryLabels = {
  general: 'Général',
  predictions: 'IA',
  security: 'Sécurité', 
  technical: 'Tech',
  support: 'Aide'
};

const categoryColors = {
  general: 'text-blue-600',
  predictions: 'text-purple-600',
  security: 'text-green-600',
  technical: 'text-orange-600',
  support: 'text-red-600',
  data: 'text-indigo-600',
  account: 'text-pink-600'
};

export default function ClientFAQMini() {
  const [searchTerm, setSearchTerm] = useState('');
  const [openItems, setOpenItems] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredFAQ = miniFAQ.filter(item => {
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
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <FontAwesomeIcon icon={faQuestionCircle} className="h-4 w-4 text-blue-600" />
          FAQ
        </h2>
      </div>

      {/* Recherche et filtres compacts */}
      <Card>
        <CardContent className="pt-4">
          <div className="space-y-3">
            {/* Barre de recherche compacte */}
            <div className="relative">
              <FontAwesomeIcon icon={faSearch} className="absolute left-2 top-2.5 h-3 w-3 text-gray-400" />
              <Input
                type="text"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 h-8 text-sm"
              />
            </div>

            {/* Filtres compacts */}
            <div className="flex flex-wrap gap-1">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
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
                  className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
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
      <div className="space-y-1 max-h-64 overflow-y-auto">
        {filteredFAQ.length === 0 ? (
          <Card>
            <CardContent className="pt-4">
              <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                <FontAwesomeIcon icon={faQuestionCircle} className="h-8 w-8 mb-2 text-gray-300" />
                <p className="text-sm">Aucune question trouvée</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredFAQ.map((item) => (
            <Card key={item.id} className="border border-gray-100 dark:border-gray-800">
              <Collapsible 
                open={openItems.includes(item.id)}
                onOpenChange={() => toggleItem(item.id)}
              >
                <CollapsibleTrigger className="w-full">
                  <div className="p-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <div className="flex items-center justify-between text-left">
                      <span className="text-xs font-medium text-gray-900 dark:text-white">{item.question}</span>
                      <FontAwesomeIcon 
                        icon={openItems.includes(item.id) ? faChevronUp : faChevronDown} 
                        className="h-2 w-2 text-gray-400 flex-shrink-0 ml-2" 
                      />
                    </div>
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="px-2 pb-2">
                    <div className="text-xs text-gray-600 dark:text-gray-300">
                      {item.answer}
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          ))
        )}
      </div>

      {/* Contact */}
      <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <CardContent className="pt-2 pb-2">
          <div className="text-center">
            <p className="text-xs text-blue-800 dark:text-blue-300">
              Question ? Utilisez Feedback
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}