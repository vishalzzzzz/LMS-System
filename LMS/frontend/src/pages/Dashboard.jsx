import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardSummary();
  }, []);

  const fetchDashboardSummary = async () => {
    try {
      const { data } = await api.get('/dashboard/summary');
      if (data.success) {
        setSummary(data.summary);
      }
    } catch (error) {
      toast.error('Failed to fetch dashboard data');
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
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <h3 className="text-lg font-medium mb-2 opacity-90">Active Borrows</h3>
          <p className="text-4xl font-bold">{summary?.activeBorrows || 0}</p>
        </div>

        <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
          <h3 className="text-lg font-medium mb-2 opacity-90">Balance</h3>
          <p className="text-4xl font-bold">${summary?.balance || '0.00'}</p>
        </div>

        <div className="card bg-gradient-to-br from-red-500 to-red-600 text-white">
          <h3 className="text-lg font-medium mb-2 opacity-90">Total Debt</h3>
          <p className="text-4xl font-bold">${summary?.totalDebt || '0.00'}</p>
        </div>

        <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <h3 className="text-lg font-medium mb-2 opacity-90">History Count</h3>
          <p className="text-4xl font-bold">{summary?.historyCount || 0}</p>
        </div>
      </div>

      {/* Amount Due Section */}
      {summary?.totalAmountDue > 0 && (
        <div className="card bg-orange-50 border border-orange-200 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-orange-800 mb-1">
                Total Amount Due
              </h3>
              <p className="text-gray-600">You have pending payments</p>
            </div>
            <div className="text-right">
              <p className="text-4xl font-bold text-orange-600">
                ${summary.totalAmountDue}
              </p>
              <Link to="/payments" className="text-orange-600 hover:underline text-sm">
                View Payments →
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Overdue Warning */}
      {summary?.overdueCount > 0 && (
        <div className="card bg-red-50 border border-red-200 mb-8">
          <div className="flex items-center">
            <span className="text-3xl mr-4">⚠️</span>
            <div>
              <h3 className="text-xl font-bold text-red-800">
                You have {summary.overdueCount} overdue book(s)
              </h3>
              <p className="text-red-600">Please return them as soon as possible</p>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Link to="/books" className="card hover:shadow-lg transition-shadow cursor-pointer">
          <div className="text-center">
            <div className="text-5xl mb-3">📚</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Browse Books</h3>
            <p className="text-gray-600">Find your next read</p>
          </div>
        </Link>

        <Link to="/active-borrows" className="card hover:shadow-lg transition-shadow cursor-pointer">
          <div className="text-center">
            <div className="text-5xl mb-3">📖</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Active Borrows</h3>
            <p className="text-gray-600">Manage your borrows</p>
          </div>
        </Link>

        <Link to="/history" className="card hover:shadow-lg transition-shadow cursor-pointer">
          <div className="text-center">
            <div className="text-5xl mb-3">📜</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">History</h3>
            <p className="text-gray-600">View past borrows</p>
          </div>
        </Link>
      </div>

      {/* Recent Borrows */}
      {summary?.recentBorrows && summary.recentBorrows.length > 0 && (
        <div className="card">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Recent Borrows</h2>
          <div className="space-y-3">
            {summary.recentBorrows.map((borrow) => (
              <div
                key={borrow._id}
                className="flex items-center justify-between border-b pb-3 last:border-0"
              >
                <div>
                  <p className="font-semibold text-gray-800">{borrow.book.title}</p>
                  <p className="text-sm text-gray-600">by {borrow.book.author}</p>
                </div>
                <div className="text-right">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      borrow.status === 'Active'
                        ? 'bg-blue-100 text-blue-800'
                        : borrow.status === 'Returned'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {borrow.status}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(borrow.borrowDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
