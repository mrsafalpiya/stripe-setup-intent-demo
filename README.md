# Stripe Setup Intent Demo

A full-stack application demonstrating how to add payment methods using Stripe's Setup Intents. This validates credit cards without charging them, making it perfect for saving payment methods for future use.

## 🎯 Features

- **Setup Intents**: Validate cards without charging using Stripe Setup Intents
- **Customer Management**: Automatic customer creation and retrieval
- **Payment Method Storage**: Save cards for future transactions
- **Payment Method Removal**: Delete saved payment methods with confirmation
- **Real-time Updates**: See saved payment methods immediately
- **Modern UI**: Beautiful, responsive interface with TailwindCSS
- **Type-Safe**: Full TypeScript implementation
- **Secure**: Industry best practices with Stripe Elements

## 🏗️ Architecture

```
card-pre-auth-and-payment-method-add/
├── backend/                    # Node.js + Express + TypeScript
│   ├── src/
│   │   ├── config/            # Stripe configuration
│   │   ├── controllers/       # Request handlers
│   │   ├── routes/            # API routes
│   │   ├── middleware/        # Error handling
│   │   ├── types/             # TypeScript types
│   │   └── server.ts          # Entry point
│   └── package.json
│
└── frontend/                   # React + TypeScript + Vite
    ├── src/
    │   ├── components/        # React components
    │   ├── services/          # API client
    │   ├── types/             # TypeScript types
    │   ├── App.tsx            # Main app
    │   └── main.tsx           # Entry point
    └── package.json
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Stripe account ([sign up here](https://stripe.com))

### 1. Clone and Setup

```bash
cd card-pre-auth-and-payment-method-add
```

### 2. Backend Setup

```bash
cd backend
npm install

# Configure environment
cp .env.example .env
# Edit .env and add your Stripe secret key

# Start backend server
npm run dev
```

Backend will run on `http://localhost:3001`

### 3. Frontend Setup

```bash
cd frontend
npm install

# Configure environment
cp .env.example .env
# Edit .env and add your Stripe publishable key

# Start frontend dev server
npm run dev
```

Frontend will run on `http://localhost:5173`

### 4. Get Stripe API Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys)
2. Copy your **Publishable key** (starts with `pk_test_`)
3. Copy your **Secret key** (starts with `sk_test_`)
4. Add them to the respective `.env` files

## 💳 How It Works

### How It Works
```
1. User enters email
   ↓
2. Backend creates Stripe customer + Setup Intent
   ↓
3. Frontend displays Stripe Elements card form
   ↓
4. User enters card details
   ↓
5. Stripe validates card (no charge)
   ↓
6. Payment method saved to customer
   ↓
7. Frontend displays saved payment methods
```

### Key Concepts

**Setup Intents**
- Designed specifically for saving payment methods without charging
- Validates the card is active and not blocked
- No authorization hold or charge appears on statement
- Payment method is saved for future use
- Recommended by Stripe for this use case

**Off-Session Usage**
- Set `usage: 'off_session'` to save the payment method
- Allows charging the card later without customer present
- Perfect for subscriptions and recurring payments

## 🧪 Testing

### Test Cards

| Card Number | Scenario |
|-------------|----------|
| `4242 4242 4242 4242` | Success |
| `4000 0000 0000 0002` | Card declined |
| `4000 0025 0000 3155` | Requires authentication |

Use any future expiry date and any 3-digit CVC.

### API Endpoints

**POST** `/api/payment/create-payment-intent`
```json
{
  "customerEmail": "user@example.com"
}
```

**GET** `/api/payment/payment-methods/:customerId`

**GET** `/api/payment/payment-intent/:paymentIntentId`

**DELETE** `/api/payment/payment-method/:paymentMethodId`

## 📦 Tech Stack

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **TypeScript** - Type safety
- **Stripe Node SDK** - Payment processing
- **Helmet** - Security headers
- **CORS** - Cross-origin requests

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **Stripe.js & Elements** - Secure card input
- **Axios** - HTTP client
- **Lucide React** - Icons

## 🔒 Security Best Practices

✅ **Implemented:**
- API keys in environment variables
- Stripe Elements for PCI compliance
- HTTPS required in production
- Input validation on backend
- CORS configuration
- Helmet security headers
- No sensitive data in frontend

⚠️ **For Production:**
- Use HTTPS everywhere
- Implement rate limiting
- Add authentication/authorization
- Enable Stripe webhook signature verification
- Set up proper logging and monitoring
- Use Stripe's production API keys

## 🎨 UI Features

- **Responsive Design**: Works on mobile, tablet, and desktop
- **Loading States**: Visual feedback during API calls
- **Error Handling**: Clear error messages
- **Success Feedback**: Confirmation when card is added
- **Card Display**: Shows saved payment methods with brand and last 4 digits
- **Modern Styling**: Gradient backgrounds, shadows, and smooth transitions

## 📝 Environment Variables

### Backend (.env)
```env
STRIPE_SECRET_KEY=sk_test_...
PORT=3001
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)
```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
VITE_API_URL=http://localhost:3001
```

## 🐛 Troubleshooting

**Backend won't start:**
- Check Node.js version (18+)
- Verify Stripe secret key is set
- Ensure port 3001 is available

**Frontend can't connect:**
- Verify backend is running
- Check CORS settings
- Confirm API URL in frontend .env

**Stripe errors:**
- Verify API keys are correct
- Check you're using test keys (pk_test_, sk_test_)
- Ensure keys match the same Stripe account

## 📚 Resources

- [Stripe API Documentation](https://stripe.com/docs/api)
- [Stripe Elements](https://stripe.com/docs/stripe-js)
- [Payment Intents](https://stripe.com/docs/payments/payment-intents)
- [Save Payment Methods](https://stripe.com/docs/payments/save-and-reuse)

## 📄 License

MIT

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

---

Built with ❤️ using Stripe, React, and Node.js
