import React, { useState } from 'react';
import { Cpu, ShieldAlert, CheckCircle, ArrowRight, UserCheck } from 'lucide-react';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('engineer@factory.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (data.success) {
        onLogin(data.user, data.token);
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      // Demo fallback login
      onLogin({
        id: 'usr-1',
        name: 'Alex Johnson',
        email: email,
        role: email.includes('manager') ? 'Production Manager' : 'Quality Engineer',
        department: 'Quality Assurance'
      }, 'demo-token-123');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoRole = (demoEmail, demoRole) => {
    setEmail(demoEmail);
    setPassword('password123');
    onLogin({
      id: 'usr-demo',
      name: demoRole === 'Quality Engineer' ? 'Alex Johnson (Engineer)' : demoRole === 'Production Manager' ? 'Sarah Miller (Manager)' : 'David Vance (Admin)',
      email: demoEmail,
      role: demoRole,
      department: demoRole === 'Production Manager' ? 'Operations' : 'Quality Control'
    }, 'demo-token-xyz');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decorative Gradient Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex p-3.5 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 shadow-xl shadow-cyan-500/20 mb-3">
            <Cpu className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">DefectIQ</h1>
          <p className="text-xs uppercase tracking-widest font-mono text-cyan-400 font-semibold mt-1">
            Manufacturing Defect Intelligence Platform
          </p>
          <p className="text-slate-400 text-sm mt-2">
            Detect. Diagnose. Predict. Prevent.
          </p>
        </div>

        {/* Card Form */}
        <div className="p-8 rounded-3xl glass-panel border border-slate-800 shadow-2xl">
          <h2 className="text-lg font-bold text-white mb-6 flex items-center justify-between">
            <span>Sign In to Factory Console</span>
            <span className="text-xs px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 font-mono">Demo Mode</span>
          </h2>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold flex items-center space-x-2">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Work Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition"
                placeholder="engineer@factory.com"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm tracking-wide shadow-lg shadow-cyan-500/25 transition flex items-center justify-center space-x-2"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In to Workspace'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Persona Switcher */}
          <div className="mt-8 pt-6 border-t border-slate-800">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center space-x-1.5">
              <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>One-Click Hackathon Persona Login</span>
            </p>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoRole('engineer@factory.com', 'Quality Engineer')}
                className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-left transition"
              >
                <p className="text-[11px] font-bold text-cyan-400">Engineer</p>
                <p className="text-[10px] text-slate-400 truncate">Alex J.</p>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoRole('manager@factory.com', 'Production Manager')}
                className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-left transition"
              >
                <p className="text-[11px] font-bold text-amber-400">Manager</p>
                <p className="text-[10px] text-slate-400 truncate">Sarah M.</p>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoRole('admin@factory.com', 'Plant Administrator')}
                className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-left transition"
              >
                <p className="text-[11px] font-bold text-purple-400">Admin</p>
                <p className="text-[10px] text-slate-400 truncate">David V.</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
