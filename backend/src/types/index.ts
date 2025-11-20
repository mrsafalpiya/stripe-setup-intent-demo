export interface CreatePaymentIntentRequest {
  customerId?: string;
  customerEmail?: string;
}

export interface ConfirmPaymentRequest {
  setupIntentId: string;
  paymentMethodId: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}
