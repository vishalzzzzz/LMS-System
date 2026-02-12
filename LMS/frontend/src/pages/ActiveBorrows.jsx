import { useState, useEffect } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import ReturnModal from '../components/ReturnModal';
import { useAuth } from '../context/AuthContext';

const ActiveBorrows = () => {
  const [borrows, setBorrows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBorrow, setSelectedBorrow] = useState(null);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const { updateUser } = useAuth();

  useEffect(() => {
    fetchActiveBorrows();
  }, []);

  const fetchActiveBorrows = async () => {
    try {
      const { data } = await api.get('/borrows/active');
      if (data.success) {
        setBorrows(data.borrows);
      }
    } catch (error) {
      toast.error('Failed to fetch active borrows');
    } finally {
      setLoading(false);
    }
  };

  const handleReturnClick = (borrow) => {
    setSelectedBorrow(borrow);
    setShowReturnModal(true);
  };

  const handleReturnSuccess = () => {
    fetchActiveBorrows();
    updateUser();
    setShowReturnModal(false);
    setSelectedBorrow(null);
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
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Active Borrows</h1>

      {borrows.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-600 text-lg">You have no active borrows</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {borrows.map((borrow) => (
            <div key={borrow._id} className="card">
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {borrow.book.title}
              </h3>
              <p className="text-gray-600 mb-4">by {borrow.book.author}</p>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Borrow Date:</span>
                  <span className="font-medium">
                    {new Date(borrow.borrowDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Due Date:</span>
                  <span className="font-medium text-orange-600">
                    {new Date(borrow.dueDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Days:</span>
                  <span className="font-medium">{borrow.numberOfDays}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Cost:</span>
                  <span className="font-bold text-primary">${borrow.totalCost.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={() => handleReturnClick(borrow)}
                className="btn-primary w-full"
              >
                Return Book
              </button>
            </div>
          ))}
        </div>
      )}

      {showReturnModal && selectedBorrow && (
        <ReturnModal
          borrow={selectedBorrow}
          onClose={() => {
            setShowReturnModal(false);
            setSelectedBorrow(null);
          }}
          onSuccess={handleReturnSuccess}
        />
      )}
    </div>
  );
};

export default ActiveBorrows;
