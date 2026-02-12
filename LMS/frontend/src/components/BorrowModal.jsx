import { useState } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const BorrowModal = ({ book, onClose, onSuccess }) => {
  const [numberOfDays, setNumberOfDays] = useState(1);
  const [totalCost, setTotalCost] = useState(book.pricePerDay);
  const [loading, setLoading] = useState(false);

  const handleDaysChange = (e) => {
    const days = parseInt(e.target.value) || 0;
    setNumberOfDays(days);
    setTotalCost(book.pricePerDay * days);
  };

  const handleBorrow = async () => {
    if (numberOfDays <= 0 || numberOfDays > 30) {
      toast.error('Number of days must be between 1 and 30');
      return;
    }

    setLoading(true);

    try {
      // Validate borrow
      const validateRes = await api.post('/borrow/validate', { bookId: book._id });
      
      if (!validateRes.data.success) {
        toast.error(validateRes.data.message);
        setLoading(false);
        return;
      }

      // Borrow the book
      const borrowRes = await api.post('/borrow', {
        bookId: book._id,
        numberOfDays: numberOfDays
      });

      if (borrowRes.data.success) {
        toast.success('Book borrowed successfully!');
        onSuccess();
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to borrow book';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Borrow Book</h2>

        <div className="space-y-4 mb-6">
          <div>
            <p className="text-gray-600 mb-1">Book Title:</p>
            <p className="font-semibold text-gray-800">{book.title}</p>
          </div>

          <div>
            <p className="text-gray-600 mb-1">Author:</p>
            <p className="font-semibold text-gray-800">{book.author}</p>
          </div>

          <div>
            <p className="text-gray-600 mb-1">Price per Day:</p>
            <p className="font-semibold text-gray-800">${book.pricePerDay}</p>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Number of Days (Max 30):
            </label>
            <input
              type="number"
              min="1"
              max="30"
              value={numberOfDays}
              onChange={handleDaysChange}
              className="input-field"
              placeholder="Enter number of days"
            />
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-gray-700 mb-1">Total Cost:</p>
            <p className="text-2xl font-bold text-primary">${totalCost.toFixed(2)}</p>
            <p className="text-sm text-gray-600 mt-2">
              Due Date: {new Date(Date.now() + numberOfDays * 24 * 60 * 60 * 1000).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={handleBorrow}
            disabled={loading || numberOfDays <= 0}
            className="btn-primary flex-1"
          >
            {loading ? 'Processing...' : 'Confirm Borrow'}
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

export default BorrowModal;
