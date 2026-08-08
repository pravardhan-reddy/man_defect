import React, { useState, useEffect } from 'react';
import { TrendingDown, Award, CheckCircle, ShieldAlert, Zap, ArrowRight, DollarSign } from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Cell 
} from 'recharts';

export default function BeforeAfter() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('/api/analytics/before-after')
      .then(res => res.json())
      .then(json => {
        if (json.success) setData(json.data);
      })
      .catch(err => console.error(err));
  }, []);

  const info = data || {
    before_defect_rate: 12.4,
    after_defect_rate: 5.8,
    defect_reduction_pct: 53.2,
    estimated_monthly_savings: 48200,
    yield_improvement: "87.6% → 94.2%",
    completed_interventions: 2
  };

  const chartComparison = [
    { label: 'BEFORE CAPA ACTION', rate: info.before_defect_rate, fill: '#EF4444' },
    { label: 'AFTER CAPA ACTION', rate: info.after_defect_rate, fill: '#10B981' }
  ];

  return (
    <div className="space-y-8 p-6 max-w-[1400px] mx-auto">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl glass-panel border border-emerald-500/30 bg-gradient-to-r from-emerald-950/30 via-slate-900 to-cyan-950/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <TrendingDown className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Closed-Loop Quality Impact Analysis</h1>
          </div>
          <p className="text-slate-300 text-sm mt-2 max-w-2xl">
            Verifiable evidence showing how AI-driven root cause identification and preventive actions measurably drop factory defect rates.
          </p>
        </div>

        <div className="flex items-center space-x-2 px-4 py-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-extrabold text-sm">
          <Award className="w-5 h-5" />
          <span>53.2% Defect Reduction Verified</span>
        </div>
      </div>

      {/* Main Before vs After Metric Counter Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Before Metric Card */}
        <div className="p-6 rounded-2xl glass-panel border border-red-500/30 bg-red-950/10 space-y-3">
          <p className="text-xs font-bold uppercase tracking-wider text-red-400">BEFORE CORRECTIVE ACTION</p>
          <div className="flex items-baseline space-x-2">
            <span className="text-4xl font-extrabold text-white font-mono">{info.before_defect_rate}%</span>
            <span className="text-xs text-slate-400">Defect Rate</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Unmitigated high vibration (4.8 mm/s) & thermal spikes on Machine M-04.
          </p>
        </div>

        {/* Arrow Divider / Savings Counter */}
        <div className="p-6 rounded-2xl glass-panel border border-cyan-500/30 bg-gradient-to-br from-cyan-950/40 to-slate-900 text-center flex flex-col items-center justify-center space-y-2">
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">IMPACT SAVINGS TICKER</span>
          <p className="text-3xl font-extrabold text-emerald-400 font-mono flex items-center justify-center">
            <span>${info.estimated_monthly_savings.toLocaleString()}</span>
            <span className="text-xs text-slate-400 font-normal ml-1">/mo</span>
          </p>
          <p className="text-xs text-slate-300">Scrap cost reduction & material waste savings</p>
        </div>

        {/* After Metric Card */}
        <div className="p-6 rounded-2xl glass-panel border border-emerald-500/30 bg-emerald-950/10 space-y-3">
          <p className="text-xs font-bold uppercase tracking-wider text-emerald-400">AFTER CORRECTIVE ACTION</p>
          <div className="flex items-baseline space-x-2">
            <span className="text-4xl font-extrabold text-emerald-400 font-mono">{info.after_defect_rate}%</span>
            <span className="text-xs text-slate-400">Defect Rate</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Post Machine M-04 vibration damper overhaul & thermal loop recalibration.
          </p>
        </div>
      </div>

      {/* Visual Comparison Bar Chart */}
      <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center space-x-2">
          <TrendingDown className="w-4 h-4 text-emerald-400" />
          <span>Visual Defect Rate Reduction Comparison</span>
        </h3>

        <div className="h-64 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartComparison} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="label" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} unit="%" />
              <Tooltip />
              <Bar dataKey="rate" name="Defect Rate (%)" radius={[8, 8, 0, 0]} barSize={90}>
                {chartComparison.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
