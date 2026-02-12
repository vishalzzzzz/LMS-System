import { useState } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const ReturnModal = ({ borrow, onClose, onSuccess }) => {
  const [returnDate, setReturnDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);

  const calculateOverdue = () => {
    const dueDate = new Date(borrow.dueDate);
    const selectedReturnDate = new Date(returnDate);
    
    if (selectedReturnDate > dueDate) {
      const diffTime = Math.abs(selectedReturnDate - dueDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const overdueAmount = diffDays * borrow.pricePerDay * 0.5;
      return { days: diffDays, amount: overdueAmount };
    }
    return { days: 0, amount: 0 };
  };

  const overdue = calculateOverdue();
  const totalAmount = borrow.totalCost + overdue.amount;

  const handleReturn = async () => {
    if (!returnDate) {
      toast.error('Please select a return date');
      return;
    }

    setLoading(true);

    try {
      const { data } = await api.post(`/borrows/${borrow._id}/submit`, {
        returnDate: returnDate
      });

      if (data.success) {
        toast.success('Book returned successfully!');
        onSuccess();
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to return book';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Return Book</h2>

        <div className="space-y-4 mb-6">
          <div>
            <p className="text-gray-600 mb-1">Book:</p>
            <p className="font-semibold text-gray-800">{borrow.book.title}</p>
          </div>

          <div>
            <p className="text-gray-600 mb-1">Due Date:</p>
            <p className="font-semibold text-gray-800">
              {new Date(borrow.dueDate).toLocaleDateString()}
            </p>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Return Date:
            </label>
            <input
              type="date"
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              className="input-field"
            />
          </div>

          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Original Cost:</span>
              <span className="font-semibold">${borrow.totalCost.toFixed(2)}</span>
            </div>

            {overdue.days > 0 && (
              <>
                <div className="flex justify-between text-red-600">
                  <span>Overdue Days:</span>
                  <span className="font-semibold">{overdue.days}</span>
                </div>
                <div className="flex justify-between text-red-600">
                  <span>Overdue Fee:</span>
                  <span className="font-semibold">${overdue.amount.toFixed(2)}</span>
                </div>
              </>
            )}

            <div className="border-t pt-2 flex justify-between">
              <span className="font-bold text-gray-700">Total Amount:</span>
              <span className="font-bold text-primary text-xl">
                ${totalAmount.toFixed(2)}
              </span>
            </div>
          </div>

          {overdue.days > 0 && (
            <div className="bg-red-50 border border-red-200 p-3 rounded-lg">
              <p className="text-sm text-red-800">
                ⚠️ This book is overdue by {overdue.days} day(s). An additional fee of $
                {overdue.amount.toFixed(2)} will be charged.
              </p>
            </div>
          )}
        </div>

        <div className="flex space-x-3">
          <button
            onClick={handleReturn}
            disabled={loading}
            className="btn-primary flex-1"
          >
            {loading ? 'Processing...' : 'Confirm Return'}
          </button>
          <button
            onClick={onClose}
            disabled={loading}
            className="btn-secondary flex-1"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReturnModal;
