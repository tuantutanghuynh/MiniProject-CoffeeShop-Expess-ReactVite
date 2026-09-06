import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Import Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CartPage from './pages/CartPage';
import OrdersPage from './pages/OrdersPage';
import AdminDashboardPage from './pages/AdminDashboardPage';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col justify-between bg-[#faf7f2] text-[#2c221e] font-sans antialiased selection:bg-[#8b5a2b] selection:text-white">
        <div>
          {/* TOPBAR + NAVBAR CONTAINER */}
          <Navbar />

          {/* MAIN CONTENT CONTAINER */}
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-16">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/cart" element={<CartPage />} />

              {/* Protected User Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/orders" element={<OrdersPage />} />
              </Route>

              {/* Protected Admin Routes */}
              <Route element={<ProtectedRoute requireRole="admin" />}>
                <Route path="/admin" element={<AdminDashboardPage />} />
              </Route>
            </Routes>
          </main>
        </div>

        {/* FOOTER CONTAINER */}
        <Footer />
      </div>
    </Router>
  );
}
