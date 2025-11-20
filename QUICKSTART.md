# Quick Start Guide

Get the Stripe $0 Pre-Auth demo running in 5 minutes!

## Step 1: Get Stripe API Keys (2 minutes)

1. Visit [https://dashboard.stripe.com/register](https://dashboard.stripe.com/register)
2. Create a free Stripe account (or login)
3. Go to [https://dashboard.stripe.com/test/apikeys](https://dashboard.stripe.com/test/apikeys)
4. Copy these two keys:
   - **Publishable key** (starts with `pk_test_`)
   - **Secret key** (starts with `sk_test_`)

## Step 2: Setup Backend (1 minute)

```bash
cd backend
npm install
cp .env.example .env
```

Edit `backend/.env` and paste your **Secret key**:

```env
STRIPE_SECRET_KEY=sk_test_YOUR_KEY_HERE
PORT=3001
FRONTEND_URL=http://localhost:5173
```

Start the backend:

```bash
npm run dev
```

✅ You should see: `🚀 Server running on http://localhost:3001`

## Step 3: Setup Frontend (1 minute)

Open a **new terminal** and run:

```bash
cd frontend
npm install
cp .env.example .env
```

Edit `frontend/.env` and paste your **Publishable key**:

```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_KEY_HERE
VITE_API_URL=http://localhost:3001
```

Start the frontend:

```bash
npm run dev
```

✅ You should see: `Local: http://localhost:5173/`

## Step 4: Test It! (1 minute)

1. Open [http://localhost:5173](http://localhost:5173) in your browser
2. Enter any email (e.g., `test@example.com`)
3. Click **Continue**
4. Enter test card: `4242 4242 4242 4242`
5. Use any future expiry (e.g., `12/25`) and any CVC (e.g., `123`)
6. Click **Add Payment Method**

🎉 **Success!** Your card is validated without any charge and saved!

## Common Test Cards

| Card Number           | Result                |
| --------------------- | --------------------- |
| `4242 4242 4242 4242` | ✅ Success            |
| `4000 0000 0000 0002` | ❌ Declined           |
| `4000 0025 0000 3155` | 🔐 Requires 3D Secure |

## Troubleshooting

**Backend won't start?**

- Make sure you're in the `backend` folder
- Check that port 3001 is not in use
- Verify your Stripe secret key is correct

**Frontend won't start?**

- Make sure you're in the `frontend` folder
- Check that port 5173 is not in use
- Verify your Stripe publishable key is correct

**Card validation fails?**

- Make sure both backend and frontend are running
- Check browser console for errors
- Verify API keys are from the same Stripe account

## What's Next?

- Check the main [README.md](./README.md) for detailed documentation
- Explore the code in `backend/src/` and `frontend/src/`
- Read about [Stripe Payment Intents](https://stripe.com/docs/payments/payment-intents)
- Learn about [saving payment methods](https://stripe.com/docs/payments/save-and-reuse)

## Need Help?

- Review the [Stripe API docs](https://stripe.com/docs)
- Check the browser console for errors
- Look at the terminal logs for backend errors
- Ensure you're using test mode API keys (pk*test* and sk*test*)

---

**Pro Tip:** Keep both terminal windows open side-by-side to see real-time logs from both backend and frontend!
