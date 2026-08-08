import React from 'react';
import { Cpu, ShieldAlert, User, LogOut, Bell, Zap, Activity } from 'lucide-react';

export default function Navbar({ user, onLogout, activeTab, alertCount = 3 }) {
  return (
    <header className="h-16 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40 px-6 flex items-center justify-between">
      {/* Brand & Active Page Title */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/20">
            <Cpu className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-extrabold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-cyan-400">DefectIQ</span>
              <span className="text-[10px] uppercase tracking-widest font-mono px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">AI v1.0</span>
            </div>
            <p className="text-[10px] text-slate-400 -mt-0.5 hidden sm:block">Detect. Diagnose. Predict. Prevent.</p>
          </div>
        </div>

        <div className="h-6 w-px bg-slate-800 hidden md:block"></div>

        <span className="text-sm font-semibold text-slate-300 capitalize hidden md:inline-block">
          {activeTab.replace('-', ' ')}
        </span>
      </div>

      {/* Action Controls & User Persona Info */}
      <div className="flex items-center space-x-4">
        {/* Real-time Indicator Pill */}
        <div className="hidden lg:flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-400 pulse-dot"></span>
          <span>Factory Line Active (5,000 Records)</span>
        </div>

        {/* Notifications Alert Dropdown Button */}
        <button className="relative p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition">
          <Bell className="w-4 h-4" />
          {alertCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
              {alertCount}
            </span>
          )}
        </button>

        {/* User Persona Profile Pill */}
        {user && (
          <div className="flex items-center space-x-3 pl-3 border-l border-slate-800">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-slate-200">{user.name}</p>
              <p className="text-[10px] font-medium text-cyan-400">{user.role}</p>
            </div>

            <button
              onClick={onLogout}
              title="Logout"
              className="p-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 transition flex items-center space-x-1"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
