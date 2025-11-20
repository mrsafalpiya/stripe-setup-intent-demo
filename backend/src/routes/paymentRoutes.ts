import { Router } from 'express';
import {
  createPaymentIntent,
  getPaymentMethods,
  getPaymentIntentStatus,
  removePaymentMethod,
} from '../controllers/paymentController';

const router = Router();

// Create a setup intent for card validation
router.post('/create-payment-intent', createPaymentIntent);

// Get payment methods for a customer
router.get('/payment-methods/:customerId', getPaymentMethods);

// Get payment intent status
router.get('/payment-intent/:paymentIntentId', getPaymentIntentStatus);

// Remove (detach) a payment method
router.delete('/payment-method/:paymentMethodId', removePaymentMethod);

export default router;
