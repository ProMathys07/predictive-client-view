// ================================================================================================
// COMPOSANT ClientFAQMini - Mini FAQ pour le tableau de bord client
// ================================================================================================
// Ce composant affiche une version compacte de la FAQ directement dans le dashboard client
// Il permet aux utilisateurs d'accéder rapidement aux questions fréquentes sans navigation
// ================================================================================================

// Import de React avec hook useState pour gérer l'état local du composant
import React, { useState } from 'react';

// Import des composants UI de la librairie shadcn/ui pour l'interface
import { Card, CardContent } from '@/components/ui/card'; // Cards pour l'affichage en cartes
import { Input } from '@/components/ui/input'; // Champ de saisie pour la recherche
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
    // Container principal avec espacement vertical entre les éléments
    <div className="space-y-4">
      
      {/* ================================================================================================
          SECTION TITRE - En-tête de la FAQ avec icône
          ================================================================================================ */}
      <div>
        {/* Titre "FAQ" avec icône question et styling responsive */}
        <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
          {/* Icône question circulaire colorée en bleu */}
          <FontAwesomeIcon icon={faQuestionCircle} className="h-3 w-3 text-blue-600" />
          FAQ {/* Texte du titre */}
        </h2>
      </div>

      {/* ================================================================================================
          SECTION RECHERCHE - Barre de recherche compacte avec icône
          ================================================================================================ */}
      <div className="relative"> {/* Position relative pour placer l'icône en absolu */}
        {/* Icône de recherche positionnée en absolu à gauche du champ */}
        <FontAwesomeIcon icon={faSearch} className="absolute left-2 top-2 h-2 w-2 text-gray-400" />
        {/* Champ de saisie pour la recherche */}
        <Input
          type="text"                                    // Type input texte
          placeholder="Rechercher..."                    // Texte d'aide
          value={searchTerm}                            // Valeur contrôlée par l'état React
          onChange={(e) => setSearchTerm(e.target.value)} // Met à jour l'état à chaque frappe
          className="pl-6 h-6 text-xs border-gray-200 dark:border-gray-700" // Styles : padding-left pour l'icône, hauteur compacte, texte petit, bordures adaptatives
        />
      </div>

      {/* ================================================================================================
          SECTION QUESTIONS - Liste des questions FAQ pliables/dépliables
          ================================================================================================ */}
      <div className="space-y-1 max-h-64 overflow-y-auto"> {/* Container avec espacement entre éléments, hauteur max et scroll vertical */}
        {/* Condition : afficher message si aucune question ne correspond aux filtres */}
        {filteredFAQ.length === 0 ? (
          // Message d'état vide quand aucun résultat
          <div className="text-center py-2 text-gray-400">
            <p className="text-xs">Aucune question trouvée</p>
          </div>
        ) : (
          // Sinon, afficher les questions filtrées (maximum 4 avec slice)
          filteredFAQ.slice(0, 4).map((item) => (
            // Container pour chaque question avec bordure et coins arrondis
            <div key={item.id} className="border border-gray-100 dark:border-gray-800 rounded-md">
              {/* Composant Collapsible pour gérer l'ouverture/fermeture */}
              <Collapsible
                open={openItems.includes(item.id)}     // État ouvert/fermé basé sur l'array openItems
                onOpenChange={() => toggleItem(item.id)} // Fonction appelée lors du clic pour toggle
              >
                {/* Trigger/bouton pour cliquer et ouvrir/fermer la question */}
                <CollapsibleTrigger className="w-full"> {/* Largeur 100% pour cliquer partout */}
                  {/* Zone cliquable avec effet hover */}
                  <div className="p-1.5 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    {/* Layout flex pour aligner question et flèche */}
                    <div className="flex items-center justify-between text-left">
                      {/* Texte de la question */}
                      <span className="text-xs text-gray-900 dark:text-white">{item.question}</span>
                      {/* Icône flèche qui change selon l'état ouvert/fermé */}
                      <FontAwesomeIcon 
                        icon={openItems.includes(item.id) ? faChevronUp : faChevronDown} // Flèche up si ouvert, down si fermé
                        className="h-2 w-2 text-gray-400 flex-shrink-0 ml-1" // Petite taille, couleur grise, ne rétrécit pas, marge à gauche
                      />
                    </div>
                  </div>
                </CollapsibleTrigger>
                
                {/* Contenu qui s'affiche/cache selon l'état */}
                <CollapsibleContent>
                  {/* Container pour la réponse avec padding */}
                  <div className="px-1.5 pb-1.5">
                    {/* Texte de la réponse avec couleur plus claire */}
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {item.answer} {/* Affichage de la réponse */}
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          ))
        )}
      </div>

      {/* ================================================================================================
          SECTION CONTACT - Bandeau d'information pour obtenir plus d'aide
          ================================================================================================ */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-2 text-center">
        {/* Message d'incitation avec couleurs bleues cohérentes */}
        <p className="text-xs text-blue-700 dark:text-blue-300">
          Autre question ? Utilisez Feedback {/* Texte d'incitation à utiliser le bouton Feedback */}
        </p>
      </div>
    </div>
  );
}