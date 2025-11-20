import { Request, Response } from 'express';
import { stripe } from '../config/stripe';
import { CreatePaymentIntentRequest, ConfirmPaymentRequest, ApiResponse } from '../types';

/**
 * Creates a setup intent for pre-authorization check
 * This validates the card without charging it
 */
export const createPaymentIntent = async (
  req: Request<{}, {}, CreatePaymentIntentRequest>,
  res: Response<ApiResponse>
): Promise<void> => {
  try {
    const { customerId, customerEmail } = req.body;

    let customer;
    
    // Create or retrieve customer
    if (customerId) {
      customer = await stripe.customers.retrieve(customerId);
    } else if (customerEmail) {
      // Check if customer exists
      const existingCustomers = await stripe.customers.list({
        email: customerEmail,
        limit: 1,
      });
      
      if (existingCustomers.data.length > 0) {
        customer = existingCustomers.data[0];
      } else {
        customer = await stripe.customers.create({
          email: customerEmail,
        });
      }
    } else {
      // Create anonymous customer
      customer = await stripe.customers.create();
    }

    // Create a setup intent for card validation (no charge)
    const setupIntent = await stripe.setupIntents.create({
      customer: customer.id,
      payment_method_types: ['card'],
      usage: 'off_session', // Save payment method for future use
      metadata: {
        type: 'card_validation',
      },
    });

    res.json({
      success: true,
      data: {
        clientSecret: setupIntent.client_secret,
        customerId: customer.id,
        setupIntentId: setupIntent.id,
      },
    });
  } catch (error) {
    console.error('Error creating setup intent:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create setup intent',
    });
  }
};

/**
 * Retrieves payment methods for a customer
 */
export const getPaymentMethods = async (
  req: Request<{ customerId: string }>,
  res: Response<ApiResponse>
): Promise<void> => {
  try {
    const { customerId } = req.params;

    if (!customerId) {
      res.status(400).json({
        success: false,
        error: 'Customer ID is required',
      });
      return;
    }

    const paymentMethods = await stripe.paymentMethods.list({
      customer: customerId,
      type: 'card',
    });

    res.json({
      success: true,
      data: {
        paymentMethods: paymentMethods.data,
      },
    });
  } catch (error) {
    console.error('Error retrieving payment methods:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to retrieve payment methods',
    });
  }
};

/**
 * Retrieves payment intent status
 */
export const getPaymentIntentStatus = async (
  req: Request<{ paymentIntentId: string }>,
  res: Response<ApiResponse>
): Promise<void> => {
  try {
    const { paymentIntentId } = req.params;

    if (!paymentIntentId) {
      res.status(400).json({
        success: false,
        error: 'Payment Intent ID is required',
      });
      return;
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    res.json({
      success: true,
      data: {
        status: paymentIntent.status,
        paymentMethod: paymentIntent.payment_method,
        customer: paymentIntent.customer,
      },
    });
  } catch (error) {
    console.error('Error retrieving payment intent:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to retrieve payment intent',
    });
  }
};

/**
 * Removes (detaches) a payment method from a customer
 */
export const removePaymentMethod = async (
  req: Request<{ paymentMethodId: string }>,
  res: Response<ApiResponse>
): Promise<void> => {
  try {
    const { paymentMethodId } = req.params;

    if (!paymentMethodId) {
      res.status(400).json({
        success: false,
        error: 'Payment Method ID is required',
      });
      return;
    }

    // Detach the payment method from the customer
    const paymentMethod = await stripe.paymentMethods.detach(paymentMethodId);

    res.json({
      success: true,
      data: {
        paymentMethodId: paymentMethod.id,
        message: 'Payment method removed successfully',
      },
    });
  } catch (error) {
    console.error('Error removing payment method:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to remove payment method',
    });
  }
};
