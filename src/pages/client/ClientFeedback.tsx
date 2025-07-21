import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useClient } from '@/contexts/ClientContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faComments, 
  faEnvelope, 
  faPhone, 
  faPaperPlane,
  faHeart,
  faCheckCircle,
  faHistory,
  faExclamationTriangle,
  faInfo,
  faFlag
} from '@fortawesome/free-solid-svg-icons';

export default function ClientFeedback() {
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
    priority: 'medium' as 'low' | 'medium' | 'high'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const { feedbacks, addFeedback } = useClient();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.subject.trim() || !formData.message.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    console.log('📤 Envoi du feedback...', formData);
    
    // Utilisation du hook qui notifie automatiquement l'admin
    const feedback = addFeedback({
      subject: formData.subject.trim(),
      message: formData.message.trim(),
      priority: formData.priority
    });

    if (feedback) {
      setFormData({ subject: '', message: '', priority: 'medium' });
      console.log('✅ Feedback envoyé avec succès, notification admin créée');
      toast({
        title: "Message envoyé",
        description: "Votre feedback a été transmis à notre équipe. L'admin recevra une notification !",
      });
    }
    
    setIsSubmitting(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return faExclamationTriangle;
      case 'medium': return faInfo;
      case 'low': return faFlag;
      default: return faInfo;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100 dark:bg-red-900/20';
      case 'medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
      case 'low': return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Feedback & Support
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Partagez votre expérience et contactez notre équipe IADataPME
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Formulaire de feedback */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FontAwesomeIcon icon={faComments} className="h-5 w-5 text-blue-600" />
              <span>Nouveau feedback</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
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
                  placeholder="Ex: Amélioration suggérée, Bug rencontré, Question technique..."
                  className="mt-1"
                />
              </div>

              {/* Priorité */}
              <div>
                <Label htmlFor="priority" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Priorité
                </Label>
                <Select value={formData.priority} onValueChange={(value) => handleInputChange('priority', value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">
                      <div className="flex items-center space-x-2">
                        <FontAwesomeIcon icon={faFlag} className="h-3 w-3 text-green-600" />
                        <span>Faible - Suggestion ou question générale</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="medium">
                      <div className="flex items-center space-x-2">
                        <FontAwesomeIcon icon={faInfo} className="h-3 w-3 text-yellow-600" />
                        <span>Moyenne - Problème affectant l'utilisation</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="high">
                      <div className="flex items-center space-x-2">
                        <FontAwesomeIcon icon={faExclamationTriangle} className="h-3 w-3 text-red-600" />
                        <span>Élevée - Problème critique ou urgent</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
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
                  placeholder="Décrivez en détail votre expérience, vos suggestions ou vos préoccupations. Plus votre description est précise, mieux nous pourrons vous aider."
                  rows={8}
                  className="mt-1"
                />
              </div>

              {/* Bouton d'envoi */}
              <Button 
                type="submit" 
                disabled={isSubmitting || !formData.subject.trim() || !formData.message.trim()}
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

        {/* Section contact et historique */}
        <div className="space-y-6">
          {/* Historique des feedbacks */}
          {feedbacks.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FontAwesomeIcon icon={faHistory} className="h-5 w-5 text-purple-600" />
                  <span>Vos feedbacks récents</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {feedbacks.slice(0, 5).map((feedback) => (
                    <div key={feedback.id} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                          {feedback.subject}
                        </h4>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(feedback.priority)}`}>
                          <FontAwesomeIcon icon={getPriorityIcon(feedback.priority)} className="mr-1 h-3 w-3" />
                          {feedback.priority === 'high' && 'Urgent'}
                          {feedback.priority === 'medium' && 'Moyen'}
                          {feedback.priority === 'low' && 'Faible'}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                        {feedback.message.length > 100 ? `${feedback.message.substring(0, 100)}...` : feedback.message}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">
                          {new Date(feedback.timestamp).toLocaleDateString('fr-FR')}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded ${
                          feedback.status === 'new' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300' :
                          feedback.status === 'read' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300' :
                          'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                        }`}>
                          {feedback.status === 'new' && 'Nouveau'}
                          {feedback.status === 'read' && 'Lu'}
                          {feedback.status === 'responded' && 'Répondu'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

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
                Besoin d'une réponse immédiate ? Contactez directement notre équipe.
              </p>
              
              <Button 
                onClick={() => setShowContact(!showContact)}
                variant="outline" 
                className="w-full mb-4"
              >
                <FontAwesomeIcon icon={faPhone} className="mr-2 h-4 w-4" />
                {showContact ? 'Masquer' : 'Afficher'} les informations de contact
              </Button>

              {showContact && (
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg space-y-3">
                  <div className="flex items-center space-x-3">
                    <FontAwesomeIcon icon={faEnvelope} className="h-4 w-4 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium">Email support</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">info@aidatapme.fr</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <FontAwesomeIcon icon={faPhone} className="h-4 w-4 text-green-600" />
                    <div>
                      <p className="text-sm font-medium">Téléphone</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">+33 7 81 71 55 12</p>
                    </div>
                  </div>
                  <div className="border-t border-gray-200 dark:border-gray-600 pt-3">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      <strong>Horaires :</strong> Lundi au vendredi, 9h-18h<br/>
                      <strong>Réponse :</strong> Sous 24h en moyenne
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Message de réassurance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faHeart} className="h-5 w-5 text-red-500" />
                <span>Votre avis compte pour IADataPME</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  ✓ Chaque feedback est personnellement lu par notre équipe
                </p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  ✓ Vos suggestions façonnent l'évolution de notre plateforme
                </p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  ✓ Réponse garantie sous 48h pour les demandes urgentes
                </p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  ✓ Confidentialité totale de vos échanges et données
                </p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  ✓ Accompagnement personnalisé selon vos besoins métier
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}