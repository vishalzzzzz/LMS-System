import { useState, useEffect } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const { data } = await api.get('/borrows/history');
      if (data.success) {
        setHistory(data.borrows);
      }
    } catch (error) {
      toast.error('Failed to fetch history');
    } finally {
      setLoading(false);
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
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Borrow History</h1>

      {history.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-600 text-lg">No borrow history yet</p>
        </div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Book</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Author</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Borrow Date</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Return Date</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Days</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Cost</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Overdue</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Total</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {history.map((borrow) => (
                <tr key={borrow._id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <p className="font-medium text-gray-800">{borrow.book.title}</p>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{borrow.book.author}</td>
                  <td className="py-3 px-4 text-gray-600">
                    {new Date(borrow.borrowDate).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    {new Date(borrow.returnDate).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 text-gray-600">{borrow.numberOfDays}</td>
                  <td className="py-3 px-4 font-medium">${borrow.totalCost.toFixed(2)}</td>
                  <td className="py-3 px-4">
                    {borrow.overdueDays > 0 ? (
                      <span className="text-red-600 font-medium">
                        {borrow.overdueDays} days (${borrow.overdueAmount.toFixed(2)})
                      </span>
                    ) : (
                      <span className="text-green-600">-</span>
                    )}
                  </td>
                  <td className="py-3 px-4 font-bold text-primary">
                    ${borrow.totalAmount.toFixed(2)}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        borrow.status === 'Returned'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {borrow.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default History;
