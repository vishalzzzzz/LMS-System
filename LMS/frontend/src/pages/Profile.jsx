import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">My Profile</h1>

      <div className="card max-w-2xl">
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b pb-4">
            <span className="text-gray-600 font-medium">Name:</span>
            <span className="text-gray-800 font-semibold">{user?.name}</span>
          </div>

          <div className="flex items-center justify-between border-b pb-4">
            <span className="text-gray-600 font-medium">Email:</span>
            <span className="text-gray-800">{user?.email}</span>
          </div>

          <div className="flex items-center justify-between border-b pb-4">
            <span className="text-gray-600 font-medium">Student ID:</span>
            <span className="text-gray-800 font-mono">{user?.studentId}</span>
          </div>

          <div className="flex items-center justify-between border-b pb-4">
            <span className="text-gray-600 font-medium">Balance:</span>
            <span className="text-green-600 font-bold">${user?.balance?.toFixed(2) || '0.00'}</span>
          </div>

          <div className="flex items-center justify-between border-b pb-4">
            <span className="text-gray-600 font-medium">Total Debt:</span>
            <span className="text-red-600 font-bold">${user?.totalDebt?.toFixed(2) || '0.00'}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-600 font-medium">Active Borrow:</span>
            <span className={`font-semibold ${user?.hasActiveBorrow ? 'text-orange-600' : 'text-green-600'}`}>
              {user?.hasActiveBorrow ? 'Yes' : 'No'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
