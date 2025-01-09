import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import HomePage from './pages/HomePage';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/*" element={<AdminDashboard />} />
            <Route path="/category/:category" element={<ProductList />} />
            <Route path="/product/:id" element={<ProductDetail />} />
          </Routes>
          <Toaster position="top-right" />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;