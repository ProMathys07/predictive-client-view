import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus, faSpinner } from '@fortawesome/free-solid-svg-icons';

export default function CreateClientAccountForm() {
  const { createClientAccount, user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    company: '',
    temporaryPassword: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.name || !formData.company || !formData.temporaryPassword) {
      toast({
        title: "Erreur",
        description: "Tous les champs sont obligatoires",
        variant: "destructive"
      });
      return;
    }

    if (formData.temporaryPassword.length < 6) {
      toast({
        title: "Erreur",
        description: "Le mot de passe temporaire doit contenir au moins 6 caractères",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    const success = await createClientAccount(
      formData.email,
      formData.name,
      formData.company,
      formData.temporaryPassword
    );

    if (success) {
      setFormData({ email: '', name: '', company: '', temporaryPassword: '' });
    }
    setLoading(false);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FontAwesomeIcon icon={faUserPlus} className="h-5 w-5" />
          Créer un Compte Client
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email du client</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="client@entreprise.com"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="name">Nom complet</Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Jean Dupont"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="company">Entreprise</Label>
            <Input
              id="company"
              type="text"
              value={formData.company}
              onChange={(e) => handleChange('company', e.target.value)}
              placeholder="Nom de l'entreprise"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="temporaryPassword">Mot de passe temporaire</Label>
            <Input
              id="temporaryPassword"
              type="password"
              value={formData.temporaryPassword}
              onChange={(e) => handleChange('temporaryPassword', e.target.value)}
              placeholder="Minimum 6 caractères"
              required
              minLength={6}
            />
            <p className="text-sm text-muted-foreground">
              Le client devra changer ce mot de passe lors de sa première connexion
            </p>
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={loading}
          >
            {loading ? (
              <>
                <FontAwesomeIcon icon={faSpinner} spin className="mr-2 h-4 w-4" />
                Création en cours...
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faUserPlus} className="mr-2 h-4 w-4" />
                Créer le compte
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}