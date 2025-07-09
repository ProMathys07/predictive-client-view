
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faDownload, 
  faExclamationTriangle, 
  faCheckCircle,
  faClockRotateLeft,
  faEuroSign
} from '@fortawesome/free-solid-svg-icons';
import { useToast } from '@/hooks/use-toast';
import { useNotifications } from '@/hooks/useNotifications';

interface BillingModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceId: string | null;
}

interface Invoice {
  id: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  downloadUrl?: string;
}

export default function BillingModal({ isOpen, onClose, serviceId }: BillingModalProps) {
  const { toast } = useToast();
  const { addNotification } = useNotifications();

  // Données simulées pour les factures
  const [invoices] = useState<Invoice[]>([
    {
      id: 'INV-001',
      date: '2025-01-01',
      amount: 850,
      status: 'paid'
    },
    {
      id: 'INV-002',
      date: '2025-01-15',
      amount: 490,
      status: 'pending'
    },
    {
      id: 'INV-003',
      date: '2024-12-15',
      amount: 2900,
      status: 'overdue'
    }
  ]);

  const handleDownloadInvoice = (invoiceId: string) => {
    toast({
      title: "Téléchargement en cours",
      description: `Téléchargement de la facture ${invoiceId}...`,
    });
    
    addNotification({
      id: Date.now().toString(),
      type: 'invoice_downloaded',
      title: 'Facture téléchargée',
      description: `La facture ${invoiceId} a été téléchargée.`,
      timestamp: new Date().toISOString(),
      read: false
    });
  };

  const handleSendReminder = (invoiceId: string) => {
    toast({
      title: "Rappel envoyé",
      description: `Rappel de paiement envoyé pour la facture ${invoiceId}.`,
    });
    
    addNotification({
      id: Date.now().toString(),
      type: 'payment_reminder',
      title: 'Rappel de paiement envoyé',
      description: `Rappel envoyé pour la facture ${invoiceId}.`,
      timestamp: new Date().toISOString(),
      read: false
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Payée</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">En attente</Badge>;
      case 'overdue':
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">En retard</Badge>;
      default:
        return <Badge>Inconnu</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <FontAwesomeIcon icon={faCheckCircle} className="h-4 w-4 text-green-600" />;
      case 'pending':
        return <FontAwesomeIcon icon={faClockRotateLeft} className="h-4 w-4 text-yellow-600" />;
      case 'overdue':
        return <FontAwesomeIcon icon={faExclamationTriangle} className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FontAwesomeIcon icon={faEuroSign} className="h-5 w-5" />
            Historique de facturation - Service {serviceId}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <h3 className="font-medium text-blue-900 dark:text-blue-100">Total facturé</h3>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {invoices.reduce((sum, inv) => sum + inv.amount, 0)}€
              </p>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <h3 className="font-medium text-green-900 dark:text-green-100">Payé</h3>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.amount, 0)}€
              </p>
            </div>
            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
              <h3 className="font-medium text-red-900 dark:text-red-100">En attente</h3>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                {invoices.filter(inv => inv.status !== 'paid').reduce((sum, inv) => sum + inv.amount, 0)}€
              </p>
            </div>
          </div>

          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Facture</th>
                  <th className="px-4 py-3 text-left font-medium">Date</th>
                  <th className="px-4 py-3 text-left font-medium">Montant</th>
                  <th className="px-4 py-3 text-left font-medium">Statut</th>
                  <th className="px-4 py-3 text-left font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {invoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="px-4 py-3 font-mono">{invoice.id}</td>
                    <td className="px-4 py-3">{new Date(invoice.date).toLocaleDateString('fr-FR')}</td>
                    <td className="px-4 py-3 font-medium">{invoice.amount}€</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(invoice.status)}
                        {getStatusBadge(invoice.status)}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDownloadInvoice(invoice.id)}
                        >
                          <FontAwesomeIcon icon={faDownload} className="h-3 w-3 mr-1" />
                          PDF
                        </Button>
                        {invoice.status !== 'paid' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleSendReminder(invoice.id)}
                            className="text-orange-600 border-orange-600 hover:bg-orange-50"
                          >
                            <FontAwesomeIcon icon={faExclamationTriangle} className="h-3 w-3 mr-1" />
                            Rappel
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
