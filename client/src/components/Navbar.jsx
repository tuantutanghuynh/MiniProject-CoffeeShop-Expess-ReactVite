import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useCartStore } from '../store/useCartStore';
import { 
  MapPin, Clock, Phone, 
  ShoppingBag, User, LogOut, ShieldCheck, ClipboardList, Menu, X, Coffee
} from 'lucide-react';
import axiosClient from '../api/axiosClient';

export default function Navbar() {
  const { user, isLoggedIn, refreshToken, logout } = useAuthStore();
  const { getTotalCount } = useCartStore();
  const totalCartCount = getTotalCount();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await axiosClient.post('/auth/logout', { refreshToken });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      logout();
      navigate('/login');
    }
  };

  const navLinks = [
    { name: 'HOME', path: '/' },
    { name: 'MENU', path: '/#menu' },
    { name: 'ABOUT US', path: '/#about' },
    { name: 'RESERVATION', path: '/#reservation' },
    { name: 'BLOG', path: '/#blog' },
    { name: 'CONTACT US', path: '/#contact' },
  ];

  return (
    <header className="w-full">
      {/* 1. TOP INFORMATION BAR */}
      <div className="bg-[#171311] text-[#b8aba0] text-xs py-2 px-4 border-b border-[#2d2521]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-6 flex-wrap justify-center md:justify-start">
            <div className="flex items-center gap-1.5 hover:text-[#e8dcd0] transition-colors">
              <MapPin className="w-3.5 h-3.5 text-[#c49871]" />
              <span>123 Coffee Street, Brooklyn, NY 11201</span>
            </div>
            <div className="flex items-center gap-1.5 hover:text-[#e8dcd0] transition-colors">
              <Clock className="w-3.5 h-3.5 text-[#c49871]" />
              <span>Mon - Sun: 7:00 AM - 10:00 PM</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1.5 hover:text-[#e8dcd0] transition-colors">
              <Phone className="w-3.5 h-3.5 text-[#c49871]" />
              <span>(123) 456-7890</span>
            </div>
            <div className="flex items-center gap-3 pl-3 border-l border-[#2d2521]">
              <a href="#" className="hover:text-white transition-colors" title="Facebook">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="#" className="hover:text-white transition-colors" title="Instagram">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              <a href="#" className="hover:text-white transition-colors" title="Twitter">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN NAVBAR */}
      <div className="bg-[#faf7f2] border-b border-[#e8dfd5] sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-full bg-[#1c1512] flex items-center justify-center text-[#d9a377] shadow-md group-hover:bg-[#8b5a2b] transition-colors">
              <Coffee className="w-6 h-6 stroke-[1.8]" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-2xl font-black tracking-tight text-[#1c1512] leading-none">
                Brewista
              </span>
              <span className="text-[9px] font-bold tracking-[0.25em] text-[#8b6e58] uppercase mt-0.5">
                COFFEE & EATERY
              </span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path || (link.path === '/' && location.pathname === '/');
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-xs font-bold tracking-wider transition-colors relative py-1 ${
                    isActive ? 'text-[#1c1512]' : 'text-[#6b584b] hover:text-[#1c1512]'
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#1c1512] rounded-full"></span>
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-4">
            <Link
              to="/cart"
              className="relative p-2.5 rounded-full bg-[#f0e9df] hover:bg-[#e4d7c8] text-[#1c1512] transition-all"
              title="Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalCartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#8b5a2b] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md">
                  {totalCartCount}
                </span>
              )}
            </Link>

            {isLoggedIn ? (
              <div className="flex items-center gap-2">
                {user?.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#3d271d] hover:bg-[#1c1512] text-white text-xs font-bold transition-all shadow-sm"
                  >
                    <ShieldCheck className="w-4 h-4 text-[#d9a377]" />
                    <span>Admin</span>
                  </Link>
                )}

                <Link
                  to="/orders"
                  className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#f0e9df] hover:bg-[#e4d7c8] text-[#1c1512] text-xs font-bold transition-all"
                >
                  <ClipboardList className="w-4 h-4 text-[#8b5a2b]" />
                  <span>My Orders</span>
                </Link>

                <div className="flex items-center gap-2 pl-2 border-l border-[#e0d3c5]">
                  <span className="text-xs font-bold text-[#1c1512] hidden md:inline">
                    {user?.fullname}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="p-2 text-[#8b6e58] hover:text-rose-600 transition-colors"
                    title="Logout"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="hidden sm:inline-block text-xs font-bold text-[#1c1512] hover:text-[#8b5a2b] px-3 py-2 transition-colors"
                >
                  Login
                </Link>

                <Link
                  to="/cart"
                  className="px-5 py-2.5 rounded-full bg-[#1c1512] hover:bg-[#3d2c25] text-white text-xs font-extrabold tracking-wider flex items-center gap-2 shadow-md transition-transform active:scale-95"
                >
                  <span>ORDER ONLINE</span>
                  <ShoppingBag className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-[#1c1512] hover:bg-[#f0e9df] rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#faf7f2] border-t border-[#e8dfd5] px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-xs font-bold text-[#1c1512] py-2 border-b border-[#f0e9df]"
              >
                {link.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
