import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link to="/dashboard" className="text-2xl font-bold text-primary">
              📚 Smart Library
            </Link>
            
            <div className="hidden md:flex space-x-4">
              <Link to="/dashboard" className="text-gray-700 hover:text-primary transition-colors">
                Dashboard
              </Link>
              <Link to="/books" className="text-gray-700 hover:text-primary transition-colors">
                Books
              </Link>
              <Link to="/active-borrows" className="text-gray-700 hover:text-primary transition-colors">
                Active Borrows
              </Link>
              <Link to="/history" className="text-gray-700 hover:text-primary transition-colors">
                History
              </Link>
              <Link to="/payments" className="text-gray-700 hover:text-primary transition-colors">
                Payments
              </Link>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link to="/profile" className="text-gray-700 hover:text-primary transition-colors">
              <span className="font-medium">{user?.name}</span>
            </Link>
            <button
              onClick={handleLogout}
              className="bg-danger text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
