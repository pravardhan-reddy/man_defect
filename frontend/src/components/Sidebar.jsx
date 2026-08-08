import React from 'react';
import { 
  LayoutDashboard, 
  BarChart3, 
  Zap, 
  Cpu, 
  CheckSquare, 
  TrendingDown, 
  Upload, 
  FileText 
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'analytics', label: 'Defect Analytics', icon: BarChart3, badge: null },
    { id: 'root-cause', label: 'AI Root Cause', icon: Zap, badge: 'AI', highlight: true },
    { id: 'predict', label: 'Defect Predictor', icon: Cpu, badge: 'ML', highlight: true },
    { id: 'capa', label: 'Corrective Actions', icon: CheckSquare, badge: 'CAPA' },
    { id: 'before-after', label: 'Before vs After', icon: TrendingDown, badge: '53%' },
    { id: 'upload', label: 'Dataset Upload', icon: Upload, badge: 'CSV' },
    { id: 'reports', label: 'Quality Reports', icon: FileText, badge: null }
  ];

  return (
    <aside className="w-64 border-r border-slate-800/80 bg-slate-950/60 p-4 flex flex-col justify-between shrink-0 min-h-[calc(100vh-4rem)]">
      <div className="space-y-1">
        <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-500">
          Core Modules
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/10 text-cyan-400 border border-cyan-500/30 shadow-md shadow-cyan-500/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>

              {item.badge && (
                <span className={`px-1.5 py-0.5 text-[10px] font-bold rounded ${
                  item.highlight
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    : 'bg-slate-800 text-slate-400'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Demo Quick Guide Box */}
      <div className="p-3.5 rounded-xl glass-panel border border-cyan-500/20 bg-gradient-to-br from-cyan-950/30 to-slate-900">
        <div className="flex items-center space-x-2 text-cyan-400 text-xs font-bold mb-1">
          <Zap className="w-3.5 h-3.5" />
          <span>Hackathon Demo Flow</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          Dashboard → AI Root Cause → What-If Predictor → Create CAPA → Before vs After.
        </p>
      </div>
    </aside>
  );
}
