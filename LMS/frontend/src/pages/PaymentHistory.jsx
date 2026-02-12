import { useState, useEffect } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const PaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const { data } = await api.get('/payments/history');
      if (data.success) {
        setPayments(data.payments);
      }
    } catch (error) {
      toast.error('Failed to fetch payment history');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (paymentId) => {
    try {
      const { data } = await api.post(`/payments/${paymentId}/pay`);
      if (data.success) {
        toast.success('Payment marked as paid!');
        fetchPayments();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to process payment');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Payment History</h1>

      {payments.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-600 text-lg">No payment history yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {payments.map((payment) => (
            <div key={payment._id} className="card">
              <div className="mb-4">
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {payment.borrow?.book?.title || 'N/A'}
                </h3>
                <p className="text-gray-600">
                  {payment.borrow?.book?.author || 'N/A'}
                </p>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-bold text-primary text-lg">
                    ${payment.amount.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      payment.status === 'Paid'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-orange-100 text-orange-800'
                    }`}
                  >
                    {payment.status}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Created:</span>
                  <span className="text-sm">
                    {new Date(payment.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {payment.paymentDate && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Paid On:</span>
                    <span className="text-sm">
                      {new Date(payment.paymentDate).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>

              {payment.status === 'Pending' && (
                <button
                  onClick={() => handlePayment(payment._id)}
                  className="btn-primary w-full"
                >
                  Mark as Paid
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Summary */}
      <div className="card mt-8 bg-blue-50">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Payment Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-gray-600 mb-1">Total Payments:</p>
            <p className="text-3xl font-bold text-gray-800">{payments.length}</p>
          </div>
          <div>
            <p className="text-gray-600 mb-1">Pending:</p>
            <p className="text-3xl font-bold text-orange-600">
              {payments.filter((p) => p.status === 'Pending').length}
            </p>
          </div>
          <div>
            <p className="text-gray-600 mb-1">Paid:</p>
            <p className="text-3xl font-bold text-green-600">
              {payments.filter((p) => p.status === 'Paid').length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentHistory;
