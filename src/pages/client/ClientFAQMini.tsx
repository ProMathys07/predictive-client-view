// ================================================================================================
// COMPOSANT ClientFAQMini - Mini FAQ pour le tableau de bord client
// ================================================================================================
// Ce composant affiche une version compacte de la FAQ directement dans le dashboard client
// Il permet aux utilisateurs d'accéder rapidement aux questions fréquentes sans navigation
// ================================================================================================

// Import de React avec hook useState pour gérer l'état local du composant
import React, { useState } from 'react';

// Import des composants UI de la librairie shadcn/ui pour l'interface
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'; // Cards pour l'affichage en cartes
import { Input } from '@/components/ui/input'; // Champ de saisie pour la recherche
import { Button } from '@/components/ui/button'; // Bouton interactif
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'; // Éléments pliables pour les Q&R

// Import de FontAwesome pour les icônes vectorielles
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faQuestionCircle,  // Icône pour le titre FAQ
  faSearch,          // Icône pour la barre de recherche
  faChevronDown,     // Flèche vers le bas (question fermée)
  faChevronUp,       // Flèche vers le haut (question ouverte)
  faBrain,          // Icône cerveau pour l'IA/prédictions
  faUpload,         // Icône upload pour les fichiers
  faShieldAlt,      // Icône bouclier pour la sécurité
  faHeadset,        // Icône casque pour le support
  faCog,            // Icône engrenage pour technique
  faChartBar,       // Icône graphique pour analytics
  faFileAlt,        // Icône fichier pour documents
  faUsers,          // Icône utilisateurs pour comptes
  faClock,          // Icône horloge pour temps
  faDownload,       // Icône téléchargement
  faWifi,           // Icône wifi pour connexion
  faKey,            // Icône clé pour accès
  faDatabase,       // Icône base de données
  faRocket,         // Icône fusée pour démarrage
  faLifeRing        // Icône bouée pour aide
} from '@fortawesome/free-solid-svg-icons';

// ================================================================================================
// INTERFACE TypeScript pour définir la structure d'un élément FAQ
// ================================================================================================
interface FAQItem {
  id: string;        // Identifiant unique pour chaque question
  question: string;  // Texte de la question
  answer: string;    // Texte de la réponse
  category: 'general' | 'predictions' | 'security' | 'technical' | 'support' | 'data' | 'account'; // Catégorie de la question
  icon: any;         // Icône FontAwesome associée à la question
}

// ================================================================================================
// DONNÉES STATIQUES - Configuration des questions FAQ et catégories
// ================================================================================================

// Array contenant toutes les questions fréquemment posées avec leurs réponses
// Chaque objet FAQItem contient une question, sa réponse, sa catégorie et son icône
const miniFAQ: FAQItem[] = [
  {
    id: '1',  // Identifiant unique pour la gestion de l'état (ouvert/fermé)
    question: 'Comment commencer avec AIDataPME ?',  // Question affichée à l'utilisateur
    answer: 'Chargez vos données, choisissez un modèle et lancez votre première prédiction.',  // Réponse détaillée
    category: 'general',  // Catégorie pour le filtrage
    icon: faRocket  // Icône fusée pour symboliser le démarrage
  },
  {
    id: '2',
    question: 'Comment fonctionne la plateforme ?',
    answer: 'La plateforme analyse vos données avec l\'IA pour générer des prédictions.',  // Utilisation de \' pour échapper l'apostrophe
    category: 'general',
    icon: faBrain  // Icône cerveau pour symboliser l'intelligence artificielle
  },
  {
    id: '3',
    question: 'Quels types de fichiers puis-je charger ?',
    answer: 'CSV, Excel (.xlsx). Taille max 100MB par fichier.',
    category: 'technical',  // Catégorie technique car concerne les spécifications
    icon: faUpload  // Icône upload pour symboliser le téléchargement de fichiers
  },
  {
    id: '4',
    question: 'Mes données sont-elles sécurisées ?',
    answer: 'Oui, stockage sécurisé en France avec chiffrement.',
    category: 'security',  // Catégorie sécurité
    icon: faShieldAlt  // Icône bouclier pour symboliser la protection
  },
  {
    id: '5',
    question: 'Comment interpréter les résultats ?',
    answer: 'Chaque prédiction inclut un score de confiance et des explications.',
    category: 'predictions',  // Catégorie prédictions/IA
    icon: faBrain  // Icône cerveau pour l'aspect analytique
  },
  {
    id: '6',
    question: 'Comment obtenir de l\'aide ?',
    answer: 'Utilisez le bouton Feedback ou contactez le support.',
    category: 'support',  // Catégorie support client
    icon: faHeadset  // Icône casque pour symboliser l'assistance
  }
];

// ================================================================================================
// CONFIGURATION DES CATÉGORIES - Labels d'affichage pour chaque catégorie
// ================================================================================================
// Objet qui mappe les clés de catégories vers leurs labels d'affichage français
const categoryLabels = {
  general: 'Général',      // Questions générales sur la plateforme
  predictions: 'IA',       // Questions sur l'intelligence artificielle et prédictions
  security: 'Sécurité',    // Questions sur la sécurité des données
  technical: 'Tech',       // Questions techniques (formats, limites, etc.)
  support: 'Aide'          // Questions sur l'obtention d'aide
};

// ================================================================================================
// COULEURS DES CATÉGORIES - Classes CSS Tailwind pour colorer les catégories
// ================================================================================================
// Objet qui associe chaque catégorie à une couleur spécifique pour l'interface
const categoryColors = {
  general: 'text-blue-600',      // Bleu pour les questions générales
  predictions: 'text-purple-600', // Violet pour l'IA (couleur souvent associée à la technologie)
  security: 'text-green-600',    // Vert pour la sécurité (couleur positive/sûre)
  technical: 'text-orange-600',  // Orange pour technique (couleur d'attention/focus)
  support: 'text-red-600',       // Rouge pour le support (couleur d'urgence/aide)
  data: 'text-indigo-600',       // Indigo pour les données (non utilisé actuellement)
  account: 'text-pink-600'       // Rose pour les comptes (non utilisé actuellement)
};

// ================================================================================================
// COMPOSANT PRINCIPAL - ClientFAQMini
// ================================================================================================
// Fonction principale qui exporte le composant React pour l'affichage de la mini FAQ
export default function ClientFAQMini() {
  
  // ================================================================================================
  // ÉTAT LOCAL DU COMPOSANT - Gestion avec useState hooks
  // ================================================================================================
  
  // État pour la valeur de recherche dans la barre de recherche
  // Initialisé à une chaîne vide, mis à jour quand l'utilisateur tape
  const [searchTerm, setSearchTerm] = useState('');
  
  // État pour suivre quelles questions sont ouvertes (expanded)
  // Array de string contenant les IDs des questions actuellement ouvertes
  const [openItems, setOpenItems] = useState<string[]>([]);
  
  // État pour la catégorie sélectionnée dans le filtre (non utilisé dans cette version mini)
  // Défini à 'all' par défaut pour afficher toutes les catégories
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // ================================================================================================
  // LOGIQUE DE FILTRAGE - Filtre les questions selon les critères de recherche
  // ================================================================================================
  
  // Fonction qui filtre le array miniFAQ selon les critères de recherche et catégorie
  const filteredFAQ = miniFAQ.filter(item => {
    // Vérifie si le terme de recherche est présent dans la question OU la réponse
    // toLowerCase() pour une recherche insensible à la casse
    const matchesSearch = item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.answer.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Vérifie si l'élément correspond à la catégorie sélectionnée
    // 'all' affiche toutes les catégories, sinon filtre par catégorie spécifique
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    
    // Retourne true seulement si les deux conditions sont remplies (ET logique)
    return matchesSearch && matchesCategory;
  });

  // ================================================================================================
  // FONCTION DE GESTION D'ÉTAT - Toggle des questions ouvertes/fermées
  // ================================================================================================
  
  // Fonction qui gère l'ouverture/fermeture d'une question spécifique
  const toggleItem = (id: string) => {
    // Utilise setOpenItems avec une fonction callback pour modifier l'état précédent
    setOpenItems(prev => 
      // Si l'ID est déjà dans le array (question ouverte)
      prev.includes(id) 
        ? prev.filter(item => item !== id)  // Le retirer (fermer la question)
        : [...prev, id]                     // L'ajouter (ouvrir la question) avec spread operator
    );
  };

  // ================================================================================================
  // UTILITAIRE - Extraction des clés de catégories avec typage TypeScript
  // ================================================================================================
  
  // Extrait les clés de l'objet categoryLabels et les type correctement
  // Non utilisé dans cette version mais gardé pour compatibilité future
  const categories = Object.keys(categoryLabels) as Array<keyof typeof categoryLabels>;

  // ================================================================================================
  // RENDU JSX - Structure HTML/React du composant
  // ================================================================================================
  
  return (
    // Container principal - Style moderne et cohérent avec les autres pages client
    <Card className="h-fit">
      <CardHeader className="pb-4">
        {/* En-tête avec titre principal */}
        <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
          <FontAwesomeIcon icon={faQuestionCircle} className="h-4 w-4 text-primary" />
          Centre d'Aide
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Trouvez rapidement les réponses à vos questions
        </p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Barre de recherche moderne sans emoji */}
        <div className="relative">
          <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Posez votre question ou recherchez par mots-clés..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-background border-border"
          />
        </div>

        {/* Button "Toutes les questions" sans emoji loupe */}
        <Button 
          variant="outline" 
          className="w-full justify-start text-muted-foreground border-border hover:bg-accent"
          onClick={() => setSearchTerm('')}
        >
          Toutes les questions
        </Button>

        {/* Liste des questions avec design moderne */}
        <div className="space-y-2">
          {filteredFAQ.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FontAwesomeIcon icon={faQuestionCircle} className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Aucune question trouvée</p>
            </div>
          ) : (
            filteredFAQ.slice(0, 6).map((item) => (
              <div key={item.id} className="border border-border rounded-lg overflow-hidden hover:shadow-sm transition-shadow">
                <Collapsible
                  open={openItems.includes(item.id)}
                  onOpenChange={() => toggleItem(item.id)}
                >
                  <CollapsibleTrigger className="w-full">
                    <div className="p-4 hover:bg-accent/50 transition-colors">
                      <div className="flex items-center justify-between text-left">
                        <div className="flex items-center gap-3">
                          <FontAwesomeIcon 
                            icon={item.icon} 
                            className={`h-4 w-4 ${categoryColors[item.category] || 'text-muted-foreground'}`} 
                          />
                          <span className="text-sm font-medium text-foreground">{item.question}</span>
                        </div>
                        <FontAwesomeIcon 
                          icon={openItems.includes(item.id) ? faChevronUp : faChevronDown}
                          className="h-4 w-4 text-muted-foreground flex-shrink-0"
                        />
                      </div>
                    </div>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent>
                    <div className="px-4 pb-4 border-t border-border bg-muted/30">
                      <div className="pt-3">
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {item.answer}
                        </p>
                        <div className="mt-2">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${categoryColors[item.category]} bg-current/10`}>
                            {categoryLabels[item.category]}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            ))
          )}
        </div>

        {/* Section contact modernisée */}
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <FontAwesomeIcon icon={faLifeRing} className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-foreground">Besoin d'aide supplémentaire ?</span>
          </div>
          <p className="text-sm text-muted-foreground mb-3">
            Notre équipe est là pour vous accompagner
          </p>
          <Button size="sm" className="text-xs">
            <FontAwesomeIcon icon={faHeadset} className="h-3 w-3 mr-2" />
            Contacter le Support
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}