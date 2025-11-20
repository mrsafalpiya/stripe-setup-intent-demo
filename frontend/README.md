# Stripe Pre-Authorization Frontend

React + TypeScript frontend for demonstrating Stripe $0 pre-authorization payment method addition.

## Features

- Modern React with TypeScript
- Stripe Elements integration
- TailwindCSS for styling
- Lucide React icons
- Real-time payment method display
- Beautiful, responsive UI

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your Stripe publishable key:
   ```
   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
   VITE_API_URL=http://localhost:3001
   ```

3. **Run development server:**
   ```bash
   npm run dev
   ```
   
   The app will be available at `http://localhost:5173`

4. **Build for production:**
   ```bash
   npm run build
   npm run preview
   ```

## Project Structure

```
src/
├── components/
│   ├── PaymentForm.tsx          # Stripe payment form with card input
│   └── PaymentMethodsList.tsx   # Display saved payment methods
├── services/
│   └── api.ts                   # API client for backend communication
├── types/
│   └── index.ts                 # TypeScript type definitions
├── App.tsx                      # Main application component
├── main.tsx                     # Application entry point
└── index.css                    # Global styles with Tailwind
```

## How It Works

1. User enters their email address
2. Backend creates a Stripe customer and $0 payment intent
3. Frontend displays Stripe Elements card input form
4. User enters card details
5. Stripe validates the card with $0 authorization
6. Payment method is saved to customer
7. Saved payment methods are displayed

## Test Cards

Use these test cards in development:

- **Success**: `4242 4242 4242 4242`
- **Declined**: `4000 0000 0000 0002`
- **Requires Authentication**: `4000 0025 0000 3155`

Use any future expiry date and any 3-digit CVC.

## Technologies

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **Stripe Elements** - Secure card input
- **Axios** - HTTP client
- **Lucide React** - Icons
