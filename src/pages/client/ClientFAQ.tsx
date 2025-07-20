// ================================================================================================
// COMPOSANT ClientFAQ - Page complète FAQ pour le client
// ================================================================================================
// Cette page affiche la FAQ complète avec recherche et filtres par catégorie
// Interface moderne et cohérente avec le design system de l'application
// ================================================================================================

// Import de React avec hook useState pour gérer l'état local
import React, { useState } from 'react';

// Import des composants UI shadcn/ui avec design system tokens
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

// Import des icônes FontAwesome
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
  // Général
  {
    id: '1',
    question: 'Comment commencer avec AIDataPME ?',
    answer: 'Pour débuter : 1) Connectez-vous à votre espace client, 2) Chargez vos données via l\'onglet "Prédictions", 3) Sélectionnez le modèle d\'IA approprié, 4) Lancez l\'analyse. Notre interface intuitive vous guide étape par étape avec des tooltips et exemples.',
    category: 'general',
    icon: faBrain
  },
  {
    id: '2',
    question: 'Comment fonctionne la plateforme AIDataPME ?',
    answer: 'AIDataPME utilise des algorithmes d\'intelligence artificielle de pointe (Machine Learning, Deep Learning) pour analyser vos données métier. Notre plateforme traite vos fichiers, identifie les patterns, et génère des prédictions exploitables avec un taux de précision moyen de 87%.',
    category: 'general',
    icon: faBrain
  },
  {
    id: '3',
    question: 'Combien coûte le service ?',
    answer: 'Nos tarifs débutent à 29€/mois pour le plan Starter (500 prédictions/mois). Plan Business : 89€/mois (2000 prédictions). Plan Enterprise : sur devis. Tous nos plans incluent le support technique et la formation initiale.',
    category: 'general',
    icon: faBrain
  },
  {
    id: '4',
    question: 'Quels secteurs d\'activité sont compatibles ?',
    answer: 'AIDataPME s\'adapte à tous les secteurs : commerce (prévision des ventes), industrie (maintenance prédictive), services (optimisation RH), finance (analyse de risque), logistique (gestion des stocks), et bien d\'autres.',
    category: 'general',
    icon: faBrain
  },
  {
    id: '5',
    question: 'Ai-je besoin de compétences techniques ?',
    answer: 'Aucune compétence technique n\'est requise ! Notre interface no-code permet à tous de créer des modèles prédictifs. Un accompagnement personnalisé de 2h est inclus pour vous former aux bonnes pratiques.',
    category: 'general',
    icon: faBrain
  },

  // Prédictions et Données
  {
    id: '10',
    question: 'Quels types de fichiers puis-je charger ?',
    answer: 'Formats acceptés : CSV, Excel (.xlsx, .xls), JSON, TXT et bases de données (MySQL, PostgreSQL). Taille max : 500MB. Vos données doivent avoir des colonnes nommées et au moins 100 lignes pour de bons résultats.',
    category: 'predictions',
    icon: faUpload
  },
  {
    id: '11',
    question: 'Combien de temps prend une prédiction ?',
    answer: 'Temps de traitement selon la taille : Fichiers < 10MB : 2-5 min, 10-50MB : 5-15 min, 50-500MB : 15-45 min. Les modèles complexes (Deep Learning) prennent 20% de temps supplémentaire.',
    category: 'predictions',
    icon: faBrain
  },
  {
    id: '12',
    question: 'Comment interpréter les résultats de précision ?',
    answer: 'Précision = % de prédictions correctes. 85% = très bon, 70-84% = bon, 60-69% = acceptable, <60% = à améliorer. La confiance indique la certitude du modèle pour chaque prédiction (seuil recommandé : >75%).',
    category: 'predictions',
    icon: faBrain
  },
  {
    id: '13',
    question: 'Puis-je améliorer la précision de mes modèles ?',
    answer: 'Oui ! Conseils : 1) Augmentez la quantité de données, 2) Nettoyez les données incohérentes, 3) Ajoutez des variables pertinentes, 4) Utilisez notre outil d\'optimisation automatique, 5) Réentraînez régulièrement.',
    category: 'predictions',
    icon: faBrain
  },
  {
    id: '14',
    question: 'Comment exporter mes résultats ?',
    answer: 'Exportation disponible en CSV, Excel, PDF et JSON. Inclut : prédictions détaillées, graphiques de performance, métriques d\'évaluation, et rapport d\'analyse. API REST disponible pour l\'intégration dans vos systèmes.',
    category: 'predictions',
    icon: faUpload
  },

  // Sécurité
  {
    id: '20',
    question: 'Mes données sont-elles sécurisées ?',
    answer: 'Sécurité maximale garantie : chiffrement AES-256, conformité RGPD, hébergement en France (OVH), certificats SSL, accès limité, sauvegardes quotidiennes. Vos données restent votre propriété exclusive.',
    category: 'security',
    icon: faShieldAlt
  },
  {
    id: '21',
    question: 'Qui peut accéder à mes données ?',
    answer: 'Seuls vous et les utilisateurs que vous autorisez peuvent accéder à vos données. Notre équipe technique n\'y accède qu\'avec votre autorisation explicite pour le support. Aucun partage avec des tiers.',
    category: 'security',
    icon: faShieldAlt
  },
  {
    id: '22',
    question: 'Puis-je supprimer mes données définitivement ?',
    answer: 'Oui, suppression totale en 48h sur demande. Inclut : fichiers sources, modèles entraînés, historique des prédictions, métadonnées et sauvegardes. Certificat de suppression fourni.',
    category: 'security',
    icon: faShieldAlt
  },

  // Technique
  {
    id: '30',
    question: 'Que faire en cas d\'erreur de chargement ?',
    answer: 'Vérifications : 1) Format de fichier compatible, 2) Taille < 500MB, 3) Colonnes nommées correctement, 4) Pas de caractères spéciaux dans les noms, 5) Minimum 100 lignes de données. Utilisez notre validateur intégré.',
    category: 'technical',
    icon: faCog
  },
  {
    id: '31',
    question: 'Comment connecter mes systèmes existants ?',
    answer: 'Intégrations disponibles : API REST, webhooks, connecteurs Zapier, Power Automate. Documentation développeur complète et SDK Python/JavaScript fournis. Support technique dédié pour l\'intégration.',
    category: 'technical',
    icon: faCog
  },
  {
    id: '32',
    question: 'Les modèles s\'améliorent-ils automatiquement ?',
    answer: 'Oui ! Réentraînement automatique mensuel avec vos nouvelles données. Détection d\'anomalies et alertes de performance. Historique des versions conservé. Option de réentraînement manuel à tout moment.',
    category: 'technical',
    icon: faCog
  },

  // Support
  {
    id: '40',
    question: 'Comment obtenir de l\'aide ?',
    answer: 'Support multicanal : 1) Chat en direct (9h-18h), 2) Email support@aidatapme.com (réponse < 4h), 3) Téléphone +33 1 23 45 67 89, 4) Base de connaissances, 5) Formation personnalisée sur demande.',
    category: 'support',
    icon: faHeadset
  },
  {
    id: '41',
    question: 'Proposez-vous de la formation ?',
    answer: 'Formation complète incluse : webinaire d\'onboarding, documentation interactive, tutoriels vidéo, session 1-to-1 de 2h, certification utilisateur. Formation avancée disponible (analyses prédictives métier).',
    category: 'support',
    icon: faHeadset
  },
  {
    id: '42',
    question: 'Quels sont les horaires du support ?',
    answer: 'Support technique : Lun-Ven 9h-18h (France). Urgences critiques : 24h/7j. Support commercial : Lun-Ven 8h-19h. Chat automatique disponible en permanence pour les questions fréquentes.',
    category: 'support',
    icon: faHeadset
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
    // Container principal moderne utilisant le design system 
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        
        {/* Header moderne avec design system tokens */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center">
            <div className="p-4 bg-primary rounded-full shadow-lg">
              <FontAwesomeIcon icon={faQuestionCircle} className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-foreground">
            Centre d'Aide AIDataPME
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Trouvez rapidement les réponses à vos questions et exploitez pleinement la puissance de l'IA pour votre entreprise
          </p>
        </div>

        {/* Recherche et filtres avec design system */}
        <Card className="shadow-lg">
          <CardContent className="pt-6">
            <div className="space-y-6">
              
              {/* Barre de recherche avec tokens sémantiques */}
              <div className="relative">
                <FontAwesomeIcon icon={faSearch} className="absolute left-4 top-4 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Posez votre question ou recherchez par mots-clés..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-12 text-lg border-border focus:border-ring"
                />
              </div>

              {/* Filtres par catégorie - Button "Toutes les questions" SANS emoji loupe */}
              <div className="flex flex-wrap gap-3">
                <Button
                  variant={selectedCategory === 'all' ? "default" : "outline"}
                  onClick={() => setSelectedCategory('all')}
                  className="px-6 py-3"
                >
                  Toutes les questions
                </Button>
                {categories.map(category => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    onClick={() => setSelectedCategory(category)}
                    className="px-6 py-3"
                  >
                    {categoryLabels[category]}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Questions et réponses avec design moderne */}
        <div className="space-y-4">
          {filteredFAQ.length === 0 ? (
            // État vide modernisé
            <Card className="shadow-lg">
              <CardContent className="pt-6">
                <div className="text-center py-12 text-muted-foreground">
                  <div className="p-4 bg-muted rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                    <FontAwesomeIcon icon={faQuestionCircle} className="h-10 w-10" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-foreground">Aucun résultat trouvé</h3>
                  <p>Essayez avec d'autres mots-clés ou contactez notre support</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            // Liste des questions avec design cohérent
            filteredFAQ.map((item) => (
              <Card key={item.id} className="shadow-lg hover:shadow-xl transition-shadow">
                <Collapsible 
                  open={openItems.includes(item.id)}
                  onOpenChange={() => toggleItem(item.id)}
                >
                  <CollapsibleTrigger className="w-full">
                    <CardHeader className="hover:bg-accent transition-colors">
                      <CardTitle className="flex items-center justify-between text-left">
                        <div className="flex items-center gap-4">
                          <div className={`p-2 rounded-lg ${
                            item.category === 'general' ? 'bg-blue-500' :
                            item.category === 'predictions' ? 'bg-purple-500' :
                            item.category === 'security' ? 'bg-green-500' :
                            item.category === 'technical' ? 'bg-orange-500' :
                            'bg-red-500'
                          }`}>
                            <FontAwesomeIcon icon={item.icon} className="h-4 w-4 text-white" />
                          </div>
                          <span className="text-foreground text-lg font-medium">
                            {item.question}
                          </span>
                        </div>
                        <div className={`p-2 rounded-full bg-muted transition-transform ${
                          openItems.includes(item.id) ? 'rotate-180' : ''
                        }`}>
                          <FontAwesomeIcon icon={faChevronDown} className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </CardTitle>
                    </CardHeader>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent>
                    <CardContent className="pt-0 pb-6">
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <div className="text-foreground leading-relaxed text-base">
                          {item.answer}
                        </div>
                      </div>
                      <div className="mt-4 flex items-center gap-3">
                        <span className={`text-sm px-3 py-1 rounded-full font-medium ${
                          item.category === 'general' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                          item.category === 'predictions' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' :
                          item.category === 'security' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                          item.category === 'technical' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300' :
                          'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                        }`}>
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

        {/* Section contact avec design system */}
        <Card className="bg-primary text-primary-foreground shadow-xl">
          <CardContent className="pt-8 pb-8">
            <div className="text-center">
              <div className="p-4 bg-primary-foreground/20 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <FontAwesomeIcon icon={faHeadset} className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold mb-3">
                Besoin d'aide personnalisée ?
              </h3>
              <p className="text-primary-foreground/80 mb-6 text-lg max-w-md mx-auto">
                Notre équipe d'experts vous accompagne pour exploiter pleinement AIDataPME
              </p>
              <div className="grid md:grid-cols-2 gap-4 max-w-lg mx-auto">
                <div className="bg-primary-foreground/10 p-4 rounded-xl">
                  <FontAwesomeIcon icon={faHeadset} className="h-6 w-6 mb-2" />
                  <p className="font-semibold">Support Email</p>
                  <p className="text-primary-foreground/80 text-sm">support@aidatapme.com</p>
                  <p className="text-primary-foreground/60 text-xs mt-1">Réponse sous 4h</p>
                </div>
                <div className="bg-primary-foreground/10 p-4 rounded-xl">
                  <FontAwesomeIcon icon={faHeadset} className="h-6 w-6 mb-2" />
                  <p className="font-semibold">Chat en Direct</p>
                  <p className="text-primary-foreground/80 text-sm">9h-18h • Lun-Ven</p>
                  <p className="text-primary-foreground/60 text-xs mt-1">Assistance immédiate</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}