import apiClient from './apiClient';

export const subscriptionApi = {
  getSubscriptions: () => {
    return apiClient.get('/subscriptions');
  },
  
  subscribe: (packageId: string) => {
    return apiClient.post('/subscriptions', { packageId });
  },
  
  cancelSubscription: (subscriptionId: number) => {
    return apiClient.delete(`/subscriptions/${subscriptionId}`);
  }
};