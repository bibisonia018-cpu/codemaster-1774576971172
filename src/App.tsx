import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import MerchantStore from './pages/MerchantStore';
import ProductDetail from './pages/ProductDetail';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <nav className="bg-white shadow-md p-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-primary">🛍️ متجري</Link>
        <div className="space-x-4 space-x-reverse">
          <Link to="/login" className="text-gray-600 hover:text-primary">لوحة التاجر</Link>
        </div>
      </nav>

      <main className="container mx-auto p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/store/:merchantId" element={<MerchantStore />} />
          <Route path="/product/:productId" element={<ProductDetail />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;