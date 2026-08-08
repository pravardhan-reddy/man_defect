import React from 'react';

export default function KpiCard({ title, value, unit = '', subtext, icon: Icon, trend, trendValue, color = 'cyan' }) {
  const colorMap = {
    cyan: 'from-cyan-500/20 to-blue-500/5 text-cyan-400 border-cyan-500/30',
    danger: 'from-red-500/20 to-rose-500/5 text-red-400 border-red-500/30',
    warning: 'from-amber-500/20 to-orange-500/5 text-amber-400 border-amber-500/30',
    success: 'from-emerald-500/20 to-teal-500/5 text-emerald-400 border-emerald-500/30',
    purple: 'from-purple-500/20 to-indigo-500/5 text-purple-400 border-purple-500/30'
  };

  const iconBgMap = {
    cyan: 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20',
    danger: 'bg-red-500/10 text-red-400 border border-red-500/20',
    warning: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
    success: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    purple: 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
  };

  return (
    <div className={`p-5 rounded-2xl glass-panel glass-panel-hover bg-gradient-to-br ${colorMap[color] || colorMap.cyan} relative overflow-hidden`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">{title}</p>
          <div className="flex items-baseline space-x-1">
            <h3 className="text-3xl font-extrabold tracking-tight text-white">{value}</h3>
            {unit && <span className="text-sm font-medium text-slate-400">{unit}</span>}
          </div>
        </div>

        {Icon && (
          <div className={`p-3 rounded-xl ${iconBgMap[color] || iconBgMap.cyan}`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>

      {(subtext || trendValue) && (
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
          {subtext && <span className="text-slate-400">{subtext}</span>}
          {trendValue && (
            <span className={`font-semibold flex items-center space-x-1 ${trend === 'up' ? 'text-red-400' : 'text-emerald-400'}`}>
              <span>{trend === 'up' ? '▲' : '▼'}</span>
              <span>{trendValue}</span>
            </span>
          )}
        </div>
      )}
    </div>
  );
}
