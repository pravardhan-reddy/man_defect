import React, { useState, useEffect } from 'react';
import KpiCard from '../components/KpiCard';
import RiskBadge from '../components/RiskBadge';
import { 
  Activity, 
  AlertTriangle, 
  Layers, 
  TrendingDown, 
  TrendingUp, 
  Cpu, 
  Zap, 
  ArrowRight, 
  RefreshCw, 
  ShieldAlert 
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Cell 
} from 'recharts';

export default function Dashboard({ setActiveTab }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/dashboard');
      const json = await res.json();
      if (json.success) {
        setData(json.data);
      }
    } catch (err) {
      console.error('Failed to fetch dashboard stats', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center space-y-3">
          <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin" />
          <p className="text-sm text-slate-400 font-mono">Loading DefectIQ Industrial Engine...</p>
        </div>
      </div>
    );
  }

  const kpis = data || {
    totalBatches: 12450,
    totalDefects: 1024,
    defectRate: 8.22,
    scrapRate: 3.4,
    reworkRate: 4.82,
    mostCommonDefect: 'Surface Crack',
    topDefects: [
      { type: 'Surface Crack', percentage: 32, count: 327 },
      { type: 'Dimensional Deviation', percentage: 24, count: 245 },
      { type: 'Color Variance', percentage: 18, count: 184 },
      { type: 'Porosity', percentage: 14, count: 143 },
      { type: 'Contamination', percentage: 12, count: 125 }
    ],
    riskyMachines: [
      { machine: 'Machine M-04', defects: 312, total: 1800, defect_rate: 17.3, riskLevel: 'HIGH' },
      { machine: 'Machine M-07', defects: 198, total: 1750, defect_rate: 11.3, riskLevel: 'MEDIUM' },
      { machine: 'Machine M-02', defects: 115, total: 1650, defect_rate: 6.9, riskLevel: 'LOW' },
      { machine: 'Machine M-05', defects: 92, total: 1600, defect_rate: 5.75, riskLevel: 'LOW' }
    ],
    defectTrend: [
      { month: 'Mar', defect_rate: 6.4 },
      { month: 'Apr', defect_rate: 7.1 },
      { month: 'May', defect_rate: 7.8 },
      { month: 'Jun', defect_rate: 9.4 },
      { month: 'Jul', defect_rate: 11.2 },
      { month: 'Aug', defect_rate: 12.4 }
    ],
    alerts: [
      { id: 'ALT-1', type: 'CRITICAL', title: 'Vibration Anomaly Spike (5.2 mm/s)', desc: 'Machine M-04 Surface crack risk exceeded 82% threshold', time: '10m ago' },
      { id: 'ALT-2', type: 'WARNING', title: 'Pressure Drop on Line 2 (6.2 bar)', desc: 'Machine M-07 dimensional variance increased by 28%', time: '1h ago' }
    ]
  };

  const barColors = ['#EF4444', '#F59E0B', '#3B82F6', '#8B5CF6', '#64748B'];

  return (
    <div className="space-y-8 p-6 max-w-[1600px] mx-auto">
      {/* Top Banner Alert / Demo Story Callout */}
      <div className="p-4 rounded-2xl glass-panel border border-cyan-500/30 bg-gradient-to-r from-cyan-950/40 via-slate-900 to-blue-950/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white flex items-center space-x-2">
              <span>DefectIQ Manufacturing Executive Summary</span>
              <span className="px-2 py-0.5 rounded text-[10px] bg-red-500/20 text-red-400 font-mono">Attention Required</span>
            </h2>
            <p className="text-xs text-slate-300">
              Overall defect rate increased to <strong className="text-red-400 font-mono">8.22%</strong>. Machine <strong className="text-cyan-400">M-04</strong> exhibits critical vibration anomalies driving 32% of total surface cracks.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setActiveTab('root-cause')}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 transition flex items-center space-x-1.5 shrink-0"
          >
            <span>Investigate AI Root Cause</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <KpiCard
          title="Total Batches"
          value={kpis.totalBatches.toLocaleString()}
          subtext="Last 180 Days"
          icon={Layers}
          color="cyan"
        />

        <KpiCard
          title="Total Defects"
          value={kpis.totalDefects.toLocaleString()}
          subtext="All Production Lines"
          icon={AlertTriangle}
          color="danger"
          trend="up"
          trendValue="+12.4%"
        />

        <KpiCard
          title="Defect Rate"
          value={`${kpis.defectRate}%`}
          subtext="Target: < 4.0%"
          icon={Activity}
          color="warning"
          trend="up"
          trendValue="+1.8%"
        />

        <KpiCard
          title="Scrap Rate"
          value={`${kpis.scrapRate}%`}
          subtext="Financial Material Loss"
          icon={TrendingUp}
          color="purple"
        />

        <KpiCard
          title="Rework Rate"
          value={`${kpis.reworkRate}%`}
          subtext="Recoverable Batches"
          icon={TrendingDown}
          color="success"
        />
      </div>

      {/* Main Grid: Charts & Machine Risk Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Defect Trend Area Chart (2 cols) */}
        <div className="lg:col-span-2 p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                <span>6-Month Manufacturing Defect Rate Trend (%)</span>
              </h3>
              <p className="text-xs text-slate-400">Monthly aggregate defect percentage across all 4 production lines</p>
            </div>
            <span className="text-xs font-mono px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-cyan-400">
              Live Feed
            </span>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={kpis.defectTrend}>
                <defs>
                  <linearGradient id="defectGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} unit="%" />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="defect_rate" 
                  stroke="#EF4444" 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#defectGlow)" 
                  name="Defect Rate (%)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Defects Pareto Breakdown (1 col) */}
        <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Top Defect Categories</h3>
              <p className="text-xs text-slate-400">Defect distribution by frequency</p>
            </div>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={kpis.topDefects} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                <XAxis type="number" stroke="#64748b" fontSize={10} unit="%" />
                <YAxis dataKey="type" type="category" stroke="#94a3b8" fontSize={11} width={110} />
                <Tooltip />
                <Bar dataKey="percentage" name="Percentage (%)" radius={[0, 6, 6, 0]}>
                  {kpis.topDefects.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={barColors[index % barColors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Machine Risk Matrix & Active Alert Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* High Risk Machines (2 cols) */}
        <div className="lg:col-span-2 p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <Cpu className="w-4 h-4 text-cyan-400" />
                <span>High-Risk Machines & Equipment Matrix</span>
              </h3>
              <p className="text-xs text-slate-400">Machine-level defect rate monitoring and risk classification</p>
            </div>
            <button 
              onClick={() => setActiveTab('analytics')}
              className="text-xs font-semibold text-cyan-400 hover:underline flex items-center space-x-1"
            >
              <span>View Full Analytics</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                <tr>
                  <th className="p-3">Machine ID</th>
                  <th className="p-3">Total Batches</th>
                  <th className="p-3">Defective Batches</th>
                  <th className="p-3">Defect Rate</th>
                  <th className="p-3">Risk Level</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {kpis.riskyMachines.map((m, idx) => (
                  <tr key={idx} className="hover:bg-slate-900/40 transition">
                    <td className="p-3 font-bold text-white flex items-center space-x-2">
                      <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                      <span>{m.machine}</span>
                    </td>
                    <td className="p-3 text-slate-300 font-mono">{m.total}</td>
                    <td className="p-3 text-red-400 font-mono font-semibold">{m.defects}</td>
                    <td className="p-3 text-white font-mono font-bold">{m.defect_rate}%</td>
                    <td className="p-3">
                      <RiskBadge level={m.riskLevel} percentage={m.defect_rate} />
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => setActiveTab('root-cause')}
                        className="px-3 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 font-semibold text-[11px] transition"
                      >
                        Diagnose
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Real-time Alert Feed (1 col) */}
        <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <ShieldAlert className="w-4 h-4 text-red-400" />
              <span>Real-Time Anomaly Alerts</span>
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-500/20 text-red-400">Live</span>
          </div>

          <div className="space-y-3">
            {kpis.alerts.map((alt, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition space-y-1">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    alt.type === 'CRITICAL' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-amber-500/20 text-amber-400'
                  }`}>
                    {alt.type}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">{alt.time}</span>
                </div>
                <h4 className="text-xs font-bold text-slate-200">{alt.title}</h4>
                <p className="text-[11px] text-slate-400 leading-snug">{alt.desc}</p>
              </div>
            ))}
          </div>

          <button
            onClick={() => setActiveTab('predict')}
            className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white font-semibold text-xs border border-slate-800 transition flex items-center justify-center space-x-2"
          >
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span>Launch What-If Risk Predictor</span>
          </button>
        </div>
      </div>
    </div>
  );
}
