import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { Coffee, Mail, Lock, User, UserPlus, AlertCircle } from 'lucide-react';

export default function RegisterPage() {
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      await axiosClient.post('/auth/register', { fullname, email, password });
      navigate('/login');
    } catch (err) {
      setErrorMsg(err.message || 'Registration failed. Please check your details.');
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
        <h2 className="font-serif text-2xl font-black text-[#1c1512]">Create Account</h2>
        <p className="text-xs text-[#78695d]">Join the Brewista Coffee family</p>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-[11px] font-bold text-[#1c1512] uppercase tracking-wider block mb-1">Full Name</label>
          <div className="relative">
            <User className="w-4 h-4 text-[#8b7a6d] absolute left-3.5 top-3.5" />
            <input
              type="text"
              required
              placeholder="John Doe"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-[#faf7f2] border border-[#e8dfd5] rounded-xl text-[#1c1512] text-xs focus:outline-none focus:border-[#1c1512]"
            />
          </div>
        </div>

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
              minLength={6}
              placeholder="Minimum 6 characters"
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
          {loading ? 'Creating...' : (
            <>
              <UserPlus className="w-4 h-4" /> Create Account
            </>
          )}
        </button>
      </form>

      <p className="text-center text-xs text-[#78695d] pt-2">
        Already have an account?{' '}
        <Link to="/login" className="text-[#8b5a2b] font-bold hover:underline">
          Sign In
        </Link>
      </p>
    </div>
  );
}
