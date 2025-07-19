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
  {
    id: '1',
    question: 'Comment commencer avec AIDataPME ?',
    answer: 'Chargez vos données, choisissez un modèle et lancez votre première prédiction.',
    category: 'general',
    icon: faRocket
  },
  {
    id: '2',
    question: 'Comment fonctionne la plateforme ?',
    answer: 'La plateforme analyse vos données avec l\'IA pour générer des prédictions.',
    category: 'general',
    icon: faBrain
  },
  {
    id: '3',
    question: 'Quels types de fichiers puis-je charger ?',
    answer: 'CSV, Excel (.xlsx). Taille max 100MB par fichier.',
    category: 'technical',
    icon: faUpload
  },
  {
    id: '4',
    question: 'Mes données sont-elles sécurisées ?',
    answer: 'Oui, stockage sécurisé en France avec chiffrement.',
    category: 'security',
    icon: faShieldAlt
  },
  {
    id: '5',
    question: 'Comment interpréter les résultats ?',
    answer: 'Chaque prédiction inclut un score de confiance et des explications.',
    category: 'predictions',
    icon: faBrain
  },
  {
    id: '6',
    question: 'Comment obtenir de l\'aide ?',
    answer: 'Utilisez le bouton Feedback ou contactez le support.',
    category: 'support',
    icon: faHeadset
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
        <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
          <FontAwesomeIcon icon={faQuestionCircle} className="h-3 w-3 text-blue-600" />
          FAQ
        </h2>
      </div>

      {/* Recherche compacte */}
      <div className="relative">
        <FontAwesomeIcon icon={faSearch} className="absolute left-2 top-2 h-2 w-2 text-gray-400" />
        <Input
          type="text"
          placeholder="Rechercher..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-6 h-6 text-xs border-gray-200 dark:border-gray-700"
        />
      </div>

      {/* Questions et réponses */}
      <div className="space-y-1 max-h-64 overflow-y-auto">
        {filteredFAQ.length === 0 ? (
          <div className="text-center py-2 text-gray-400">
            <p className="text-xs">Aucune question trouvée</p>
          </div>
        ) : (
          filteredFAQ.slice(0, 4).map((item) => (
            <div key={item.id} className="border border-gray-100 dark:border-gray-800 rounded-md">
              <Collapsible
                open={openItems.includes(item.id)}
                onOpenChange={() => toggleItem(item.id)}
              >
                <CollapsibleTrigger className="w-full">
                  <div className="p-1.5 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <div className="flex items-center justify-between text-left">
                      <span className="text-xs text-gray-900 dark:text-white">{item.question}</span>
                      <FontAwesomeIcon 
                        icon={openItems.includes(item.id) ? faChevronUp : faChevronDown} 
                        className="h-2 w-2 text-gray-400 flex-shrink-0 ml-1" 
                      />
                    </div>
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="px-1.5 pb-1.5">
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {item.answer}
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          ))
        )}
      </div>

      {/* Contact minimal */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-2 text-center">
        <p className="text-xs text-blue-700 dark:text-blue-300">
          Autre question ? Utilisez Feedback
        </p>
      </div>
    </div>
  );
}