# Stripe Pre-Authorization Backend

Backend API for demonstrating Stripe Setup Intent payment method addition without charging.

## Features

- Create Setup Intent for card validation (no charge)
- Retrieve payment methods for customers
- Check setup intent status
- TypeScript with Express.js
- Stripe API integration

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your Stripe secret key:
   ```
   STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
   PORT=3001
   FRONTEND_URL=http://localhost:5173
   ```

3. **Run development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   npm start
   ```

## API Endpoints

### POST `/api/payment/create-payment-intent`
Creates a Setup Intent for card validation (no charge).

**Request Body:**
```json
{
  "customerEmail": "user@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "clientSecret": "seti_xxx_secret_xxx",
    "customerId": "cus_xxx",
    "setupIntentId": "seti_xxx"
  }
}
```

### GET `/api/payment/payment-methods/:customerId`
Retrieves all payment methods for a customer.

### GET `/api/payment/payment-intent/:paymentIntentId`
Retrieves setup intent status.

### DELETE `/api/payment/payment-method/:paymentMethodId`
Removes (detaches) a payment method from a customer.

**Response:**
```json
{
  "success": true,
  "data": {
    "paymentMethodId": "pm_xxx",
    "message": "Payment method removed successfully"
  }
}
```

## How It Works

1. Frontend requests a Setup Intent
2. Backend creates a Stripe customer and Setup Intent
3. Frontend collects card details using Stripe Elements
4. Stripe validates the card without any charge or authorization
5. Payment method is saved to the customer for future use
6. No actual charge or authorization hold is made

## Security Notes

- Never commit `.env` file
- Use environment variables for sensitive data
- Validate all inputs
- Use HTTPS in production
