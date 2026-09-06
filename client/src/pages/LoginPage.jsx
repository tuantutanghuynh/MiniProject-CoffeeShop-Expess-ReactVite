import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { useAuthStore } from '../store/useAuthStore';
import { Coffee, Mail, Lock, LogIn, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      // axiosClient response interceptor returns response.data directly
      const res = await axiosClient.post('/auth/login', { email, password });
      const { accessToken, refreshToken, user } = res;

      if (accessToken && refreshToken && user) {
        setAuth({ user, accessToken, refreshToken });
        
        // Navigate Admin directly to /admin dashboard
        if (user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      } else {
        setErrorMsg('Invalid login response from server.');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 p-8 bg-white border border-[#e8dfd5] rounded-3xl shadow-xl space-y-6">
      <div className="text-center space-y-2">
        <div className="w-14 h-14 bg-[#f4efe6] border border-[#e8dfd5] rounded-full flex items-center justify-center mx-auto text-[#1c1512]">
          <Coffee className="w-8 h-8 stroke-[1.8]" />
        </div>
        <h2 className="font-serif text-2xl font-black text-[#1c1512]">Welcome Back</h2>
        <p className="text-xs text-[#78695d]">Log in to your Brewista account</p>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-[11px] font-bold text-[#1c1512] uppercase tracking-wider block mb-1">Email Address</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-[#8b7a6d] absolute left-3.5 top-3.5" />
            <input
              type="email"
              required
              placeholder="user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-[#faf7f2] border border-[#e8dfd5] rounded-xl text-[#1c1512] text-xs focus:outline-none focus:border-[#1c1512]"
            />
          </div>
        </div>

        <div>
          <label className="text-[11px] font-bold text-[#1c1512] uppercase tracking-wider block mb-1">Password</label>
          <div className="relative">
            <Lock className="w-4 h-4 text-[#8b7a6d] absolute left-3.5 top-3.5" />
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-[#faf7f2] border border-[#e8dfd5] rounded-xl text-[#1c1512] text-xs focus:outline-none focus:border-[#1c1512]"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 rounded-full bg-[#1c1512] hover:bg-[#3d2c25] text-white font-extrabold text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? 'Logging in...' : (
            <>
              <LogIn className="w-4 h-4" /> Sign In
            </>
          )}
        </button>
      </form>

      <p className="text-center text-xs text-[#78695d] pt-2">
        Don't have an account?{' '}
        <Link to="/register" className="text-[#8b5a2b] font-bold hover:underline">
          Register now
        </Link>
      </p>
    </div>
  );
}
