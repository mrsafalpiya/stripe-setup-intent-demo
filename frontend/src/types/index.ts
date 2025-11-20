export interface PaymentIntentResponse {
  success: boolean;
  data?: {
    clientSecret: string;
    customerId: string;
    setupIntentId: string;
  };
  error?: string;
}

export interface PaymentMethod {
  id: string;
  card: {
    brand: string;
    last4: string;
    exp_month: number;
    exp_year: number;
  };
}

export interface PaymentMethodsResponse {
  success: boolean;
  data?: {
    paymentMethods: PaymentMethod[];
  };
  error?: string;
}
