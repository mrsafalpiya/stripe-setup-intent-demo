import { useEffect, useState } from 'react';
import { CreditCard, RefreshCw, Trash2 } from 'lucide-react';
import { getPaymentMethods, removePaymentMethod } from '../services/api';
import { PaymentMethod } from '../types';

interface PaymentMethodsListProps {
  customerId: string;
  refresh: boolean;
}

export default function PaymentMethodsList({ customerId, refresh }: PaymentMethodsListProps) {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchPaymentMethods = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getPaymentMethods(customerId);
      if (response.success && response.data) {
        setPaymentMethods(response.data.paymentMethods);
      } else {
        setError(response.error || 'Failed to fetch payment methods');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleRemovePaymentMethod = async (paymentMethodId: string) => {
    if (!confirm('Are you sure you want to remove this payment method?')) {
      return;
    }

    try {
      setDeletingId(paymentMethodId);
      const response = await removePaymentMethod(paymentMethodId);
      
      if (response.success) {
        // Remove from local state
        setPaymentMethods(prev => prev.filter(pm => pm.id !== paymentMethodId));
      } else {
        setError(response.error || 'Failed to remove payment method');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    if (customerId) {
      fetchPaymentMethods();
    }
  }, [customerId, refresh]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="w-6 h-6 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
        {error}
      </div>
    );
  }

  if (paymentMethods.length === 0) {
    return (
      <div className="text-center p-8 bg-gray-50 rounded-lg border border-gray-200">
        <CreditCard className="w-12 h-12 mx-auto text-gray-400 mb-3" />
        <p className="text-gray-600">No payment methods added yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-gray-900">Saved Payment Methods</h3>
      <div className="space-y-2">
        {paymentMethods.map((method) => (
          <div
            key={method.id}
            className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-lg hover:border-indigo-300 transition-colors"
          >
            <CreditCard className="w-5 h-5 text-gray-600" />
            <div className="flex-1">
              <p className="font-medium text-gray-900 capitalize">
                {method.card.brand} •••• {method.card.last4}
              </p>
              <p className="text-sm text-gray-500">
                Expires {method.card.exp_month}/{method.card.exp_year}
              </p>
            </div>
            <button
              onClick={() => handleRemovePaymentMethod(method.id)}
              disabled={deletingId === method.id}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Remove payment method"
            >
              {deletingId === method.id ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <Trash2 className="w-5 h-5" />
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
