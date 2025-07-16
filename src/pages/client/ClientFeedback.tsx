import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faComments, 
  faEnvelope, 
  faPhone, 
  faPaperPlane,
  faHeart,
  faCheckCircle
} from '@fortawesome/free-solid-svg-icons';

export default function ClientFeedback() {
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
    rating: 0
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.subject || !formData.message) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulation de l'envoi
    setTimeout(() => {
      setIsSubmitting(false);
      setFormData({ subject: '', message: '', rating: 0 });
      toast({
        title: "Message envoyé",
        description: "Votre feedback a été transmis à notre équipe. Merci !",
      });
    }, 2000);
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleRating = (rating: number) => {
    setFormData(prev => ({
      ...prev,
      rating
    }));
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Feedback & Support
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Partagez votre expérience et contactez notre équipe
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Formulaire de feedback */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FontAwesomeIcon icon={faComments} className="h-5 w-5 text-blue-600" />
              <span>Laissez-nous votre avis</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Évaluation par étoiles */}
              <div>
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Évaluez notre service
                </Label>
                <div className="flex space-x-1 mt-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleRating(star)}
                      className={`text-2xl transition-colors ${
                        star <= formData.rating
                          ? 'text-yellow-400'
                          : 'text-gray-300 dark:text-gray-600'
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              {/* Sujet */}
              <div>
                <Label htmlFor="subject" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Sujet *
                </Label>
                <Input
                  id="subject"
                  type="text"
                  value={formData.subject}
                  onChange={(e) => handleInputChange('subject', e.target.value)}
                  placeholder="Ex: Amélioration suggérée, Bug rencontré..."
                  className="mt-1"
                />
              </div>

              {/* Message */}
              <div>
                <Label htmlFor="message" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Votre message *
                </Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  placeholder="Décrivez votre expérience, vos suggestions ou vos préoccupations..."
                  rows={6}
                  className="mt-1"
                />
              </div>

              {/* Bouton d'envoi */}
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full"
              >
                {isSubmitting ? (
                  <>
                    <FontAwesomeIcon icon={faCheckCircle} className="mr-2 h-4 w-4 animate-spin" />
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faPaperPlane} className="mr-2 h-4 w-4" />
                    Envoyer le feedback
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Section contact et informations */}
        <div className="space-y-6">
          {/* Contact direct */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faEnvelope} className="h-5 w-5 text-green-600" />
                <span>Contact direct</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Besoin d'une réponse rapide ? Contactez-nous directement.
              </p>
              
              <Button 
                onClick={() => setShowContact(!showContact)}
                variant="outline" 
                className="w-full mb-4"
              >
                <FontAwesomeIcon icon={faPhone} className="mr-2 h-4 w-4" />
                Afficher les informations de contact
              </Button>

              {showContact && (
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg space-y-2">
                  <div className="flex items-center space-x-2">
                    <FontAwesomeIcon icon={faEnvelope} className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">support@aidatapme.com</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FontAwesomeIcon icon={faPhone} className="h-4 w-4 text-green-600" />
                    <span className="text-sm">+33 1 23 45 67 89</span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Disponible du lundi au vendredi, 9h-18h
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Message de réassurance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faHeart} className="h-5 w-5 text-red-500" />
                <span>Votre avis compte</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  ✓ Chaque feedback est lu et analysé par notre équipe
                </p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  ✓ Vos suggestions nous aident à améliorer nos services
                </p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  ✓ Réponse garantie sous 48h pour les questions urgentes
                </p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  ✓ Confidentialité totale de vos échanges
                </p>
              </div>
            </CardContent>
          </Card>

          {/* FAQ rapide */}
          <Card>
            <CardHeader>
              <CardTitle>Questions fréquentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                    Comment améliorer la précision des prédictions ?
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    Assurez-vous de charger des données récentes et complètes.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                    Puis-je exporter les résultats ?
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    Cette fonctionnalité sera disponible prochainement.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                    Mes données sont-elles sécurisées ?
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    Oui, toutes les données sont chiffrées et protégées.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}