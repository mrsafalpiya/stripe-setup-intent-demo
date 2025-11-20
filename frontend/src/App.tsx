import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { Shield } from 'lucide-react';
import PaymentForm from './components/PaymentForm';
import PaymentMethodsList from './components/PaymentMethodsList';
import { createPaymentIntent } from './services/api';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');

function App() {
  const [clientSecret, setClientSecret] = useState<string>('');
  const [customerId, setCustomerId] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [refreshPaymentMethods, setRefreshPaymentMethods] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter an email address');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await createPaymentIntent(email);
      if (response.success && response.data) {
        setClientSecret(response.data.clientSecret);
        setCustomerId(response.data.customerId);
      } else {
        setError(response.error || 'Failed to create payment intent');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    setRefreshPaymentMethods(!refreshPaymentMethods);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Shield className="w-10 h-10 text-indigo-600" />
              <h1 className="text-4xl font-bold text-gray-900">Stripe Setup Intent Demo</h1>
            </div>
            <p className="text-lg text-gray-600">
              Add a payment method without any charges using Setup Intents
            </p>
            <p className="text-sm text-gray-500 mt-2">
              No charges will be made. Your card will only be validated.
            </p>
          </div>

          {/* Main Content */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Left Column - Payment Form */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Add Payment Method
              </h2>

              {!clientSecret ? (
                <form onSubmit={handleEmailSubmit} className="space-y-4">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="customer@example.com"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                      required
                    />
                  </div>

                  {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    {loading ? 'Creating...' : 'Continue'}
                  </button>
                </form>
              ) : (
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                  <PaymentForm
                    clientSecret={clientSecret}
                    customerId={customerId}
                    onSuccess={handlePaymentSuccess}
                  />
                </Elements>
              )}
            </div>

            {/* Right Column - Payment Methods List */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Your Payment Methods
              </h2>

              {customerId ? (
                <PaymentMethodsList
                  customerId={customerId}
                  refresh={refreshPaymentMethods}
                />
              ) : (
                <div className="text-center p-8 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-gray-600">Enter your email to get started</p>
                </div>
              )}
            </div>
          </div>

          {/* Info Section */}
          <div className="mt-12 bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">
              How Setup Intents Work
            </h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-start gap-2">
                <span className="font-bold">1.</span>
                <span>
                  Enter your email and card details - we create a Setup Intent (no charge)
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold">2.</span>
                <span>
                  Stripe validates your card without charging it - this confirms the card is valid
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold">3.</span>
                <span>
                  Your payment method is saved for future use - ready for actual transactions
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold">4.</span>
                <span>
                  No authorization hold or charge appears on your statement - completely transparent
                </span>
              </li>
            </ul>
          </div>

          {/* Test Cards */}
          <div className="mt-8 bg-gray-50 border border-gray-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Test Cards</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium text-gray-700">Success:</p>
                <p className="font-mono text-gray-600">4242 4242 4242 4242</p>
              </div>
              <div>
                <p className="font-medium text-gray-700">Declined:</p>
                <p className="font-mono text-gray-600">4000 0000 0000 0002</p>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              Use any future expiry date and any 3-digit CVC
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
