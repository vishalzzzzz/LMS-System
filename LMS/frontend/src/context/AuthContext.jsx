import { createContext, useState, useContext, useEffect } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      
      if (data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        toast.success('Login successful!');
        return true;
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      return false;
    }
  };

  const signup = async (name, email, password, studentId) => {
    try {
      const { data } = await api.post('/auth/signup', { 
        name, 
        email, 
        password, 
        studentId 
      });
      
      if (data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        toast.success('Account created successfully!');
        return true;
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Signup failed';
      toast.error(message);
      return false;
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      toast.success('Logged out successfully');
    }
  };

  const updateUser = async () => {
    try {
      const { data } = await api.get('/auth/profile');
      if (data.success) {
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
      }
    } catch (error) {
      console.error('Update user error:', error);
    }
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
