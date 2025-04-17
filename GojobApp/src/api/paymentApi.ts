// src/api/paymentApi.ts
import apiClient from './apiClient';
// Définition des types
interface PaymentDetails {
  number?: string;
  name?: string;
  expiry?: string;
  cvc?: string;
  [key: string]: any;
}

interface PaymentPayload {
  packageId: string;
  paymentMethod: string;
  paymentDetails: PaymentDetails;
}

interface Transaction {
  id: string;
  packageId: string;
  paymentMethod: string;
  amount: string;
  date: string;
  status: 'pending' | 'completed' | 'failed';
}


// Les méthodes d'API pour les paiements
export const paymentApi = {
  // Traiter un paiement
  processPayment: (paymentData: PaymentPayload) => {
    return apiClient.post<Transaction>('/payments/process', paymentData);
  },
  
  // Récupérer l'historique des paiements
  getPaymentHistory: () => {
    return apiClient.get<Transaction[]>('/payments/history');
  },
  
  // Récupérer les détails d'un paiement spécifique
  getPaymentDetails: (paymentId: string) => {
    return apiClient.get<Transaction>(`/payments/${paymentId}`);
  },
  
  // Annuler un paiement en attente
  cancelPayment: (paymentId: string) => {
    return apiClient.post<{ success: boolean }>(`/payments/${paymentId}/cancel`);
  }
};