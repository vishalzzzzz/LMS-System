import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './context/AuthContext';

// Pages
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Books from './pages/Books';
import ActiveBorrows from './pages/ActiveBorrows';
import History from './pages/History';
import Profile from './pages/Profile';
import PaymentHistory from './pages/PaymentHistory';

// Components
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';

function App() {
  const { user } = useAuth();

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Toaster position="top-right" />
        
        {user && <Navbar />}
        
        <Routes>
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
          <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/dashboard" />} />
          
          <Route path="/dashboard" element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } />
          
          <Route path="/books" element={
            <PrivateRoute>
              <Books />
            </PrivateRoute>
          } />
          
          <Route path="/active-borrows" element={
            <PrivateRoute>
              <ActiveBorrows />
            </PrivateRoute>
          } />
          
          <Route path="/history" element={
            <PrivateRoute>
              <History />
            </PrivateRoute>
          } />
          
          <Route path="/payments" element={
            <PrivateRoute>
              <PaymentHistory />
            </PrivateRoute>
          } />
          
          <Route path="/profile" element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          } />
          
          <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
