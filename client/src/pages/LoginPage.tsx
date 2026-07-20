import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { loginApi } from '../services/api';
import { UserRole } from '../types';
import { Cpu, ArrowRight, ShieldCheck, UserCheck, Lock, Mail } from 'lucide-react';

const DEMO_ROLES: Array<{ role: UserRole; name: string; dept: string }> = [
  { role: 'Maintenance Engineer', name: 'Alex Vance', dept: 'Maintenance' },
  { role: 'Admin', name: 'Marcus Sterling', dept: 'Executive' },
  { role: 'Safety Officer', name: 'Sarah Connor', dept: 'EHS & Safety' },
  { role: 'Plant Operator', name: 'Elena Rostova', dept: 'Operations' },
  { role: 'Quality Engineer', name: 'David Chen', dept: 'Quality' },
  { role: 'Auditor', name: 'Robert Vance', dept: 'Audit' },
];

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('engineer@indusmind.ai');
  const [password, setPassword] = useState('Password123!');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login, switchRole } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await loginApi(email, password);
      login(res.token, res.user);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (demo: { role: UserRole; name: string; dept: string }) => {
    switchRole(demo.role);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#070A11] text-slate-100 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Glow Backdrops */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md glass-panel p-8 rounded-3xl border border-slate-800 shadow-2xl relative z-10">
        {/* Brand */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2.5 mb-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-emerald-400 flex items-center justify-center text-black font-extrabold shadow-glow-cyan">
              <Cpu className="w-5 h-5" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight text-white">
              INDUS<span className="text-cyan-400">MIND</span> AI
            </span>
          </Link>
          <p className="text-xs text-slate-400">Enterprise AI Industrial Knowledge Intelligence</p>
        </div>

        {/* Evaluation Quick Role Selectors */}
        <div className="mb-6 bg-[#0B0F17] p-3 rounded-2xl border border-cyan-500/30">
          <div className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider mb-2 flex items-center space-x-1">
            <UserCheck className="w-3 h-3" />
            <span>1-Click Hackathon Evaluation Login</span>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {DEMO_ROLES.map(d => (
              <button
                key={d.role}
                type="button"
                onClick={() => handleQuickLogin(d)}
                className="text-left px-2.5 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 hover:border-cyan-400/50 text-[11px] transition-all"
              >
                <div className="font-semibold text-slate-200 truncate">{d.role}</div>
                <div className="text-[9px] text-slate-400 truncate">{d.name}</div>
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Corporate Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full bg-[#070A11] border border-slate-700 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full bg-[#070A11] border border-slate-700 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-400 text-black font-bold text-xs hover:opacity-90 transition-all shadow-glow-cyan flex items-center justify-center space-x-2"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Sign In to Platform</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-400">
          Need an enterprise account?{' '}
          <Link to="/signup" className="text-cyan-400 font-semibold hover:underline">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
};
