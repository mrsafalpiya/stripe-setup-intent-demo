import axios from 'axios';
import { PaymentIntentResponse, PaymentMethodsResponse } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: `${API_URL}/api/payment`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const createPaymentIntent = async (
  customerEmail: string
): Promise<PaymentIntentResponse> => {
  const response = await api.post<PaymentIntentResponse>('/create-payment-intent', {
    customerEmail,
  });
  return response.data;
};

export const getPaymentMethods = async (
  customerId: string
): Promise<PaymentMethodsResponse> => {
  const response = await api.get<PaymentMethodsResponse>(`/payment-methods/${customerId}`);
  return response.data;
};

export const removePaymentMethod = async (
  paymentMethodId: string
): Promise<{ success: boolean; data?: { message: string }; error?: string }> => {
  const response = await api.delete(`/payment-method/${paymentMethodId}`);
  return response.data;
};
