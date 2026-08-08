import React, { useState, useEffect } from 'react';
import { Zap, Cpu, AlertTriangle, ArrowRight, CheckCircle, RefreshCw, Layers } from 'lucide-react';
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

export default function RootCauseAnalysis({ setActiveTab }) {
  const [selectedMachine, setSelectedMachine] = useState('M-04');
  const [selectedDefect, setSelectedDefect] = useState('Surface Crack');

  const [rcaData, setRcaData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchRCA = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/root-causes/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ machine_id: selectedMachine, defect_type: selectedDefect })
      });
      const json = await res.json();
      if (json.success) {
        setRcaData(json.data);
      }
    } catch (err) {
      console.error('RCA Fetch failed', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRCA();
  }, [selectedMachine, selectedDefect]);

  const data = rcaData || {
    machine_id: 'M-04',
    total_records: 625,
    defective_records: 108,
    defect_rate: 17.3,
    factors: [
      { factor: 'Machine Vibration', contribution: 42.0, unit: 'mm/s', defective_avg: 4.8, safe_avg: 2.1, deviation_pct: 128.5 },
      { factor: 'Operating Temperature', contribution: 27.0, unit: '°C', defective_avg: 84.2, safe_avg: 74.0, deviation_pct: 13.8 },
      { factor: 'Pressure Deviation', contribution: 18.0, unit: 'bar', defective_avg: 9.8, safe_avg: 8.6, deviation_pct: 13.95 },
      { factor: 'Relative Humidity', contribution: 8.0, unit: '%', defective_avg: 68.0, safe_avg: 48.0, deviation_pct: 41.6 },
      { factor: 'Production Speed', contribution: 5.0, unit: 'RPM', defective_avg: 1420, safe_avg: 1210, deviation_pct: 17.35 }
    ],
    ai_insight: "High machine vibration (4.8 mm/s vs safe avg 2.1 mm/s) combined with elevated operating temperature (84.2°C) is strongly associated with 42% of surface crack defects on Machine M-04."
  };

  const chartColors = ['#EF4444', '#F59E0B', '#3B82F6', '#10B981', '#64748B'];

  return (
    <div className="space-y-8 p-6 max-w-[1400px] mx-auto">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl glass-panel border border-cyan-500/30 bg-gradient-to-r from-cyan-950/40 via-slate-900 to-blue-950/40 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Zap className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">AI Root Cause Analysis Engine</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
              Core Differentiator
            </span>
          </div>
          <p className="text-slate-300 text-sm mt-2 max-w-2xl leading-relaxed">
            Machine Learning feature importance identifies exact physical parameter anomalies driving defect spikes instead of simple generic alarms.
          </p>
        </div>

        {/* Machine & Defect Selector */}
        <div className="flex flex-wrap items-center gap-3 bg-slate-900/90 p-3 rounded-2xl border border-slate-800 shrink-0">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Target Machine</label>
            <select
              value={selectedMachine}
              onChange={(e) => setSelectedMachine(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-cyan-400 focus:border-cyan-500"
            >
              <option value="M-04">Machine M-04 (High Anomaly)</option>
              <option value="M-07">Machine M-07 (Pressure Drop)</option>
              <option value="M-02">Machine M-02</option>
              <option value="M-01">Machine M-01</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Defect Pattern</label>
            <select
              value={selectedDefect}
              onChange={(e) => setSelectedDefect(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-red-400 focus:border-cyan-500"
            >
              <option value="Surface Crack">Surface Crack</option>
              <option value="Dimensional Deviation">Dimensional Deviation</option>
              <option value="Color Variance">Color Variance</option>
              <option value="Porosity">Porosity</option>
            </select>
          </div>

          <button
            onClick={fetchRCA}
            className="mt-4 px-3.5 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition flex items-center space-x-1"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Diagnose</span>
          </button>
        </div>
      </div>

      {/* Natural Language AI Insight Banner Box */}
      <div className="p-6 rounded-2xl glass-panel border border-red-500/30 bg-gradient-to-br from-red-950/20 via-slate-900 to-slate-950 space-y-3">
        <div className="flex items-center space-x-2 text-red-400 text-xs font-bold uppercase tracking-wider">
          <AlertTriangle className="w-4 h-4" />
          <span>AI Diagnostic Insight & Root Cause Statement</span>
        </div>
        <p className="text-base text-slate-100 font-medium leading-relaxed">
          "{data.ai_insight}"
        </p>
        <div className="pt-2 flex items-center justify-between text-xs text-slate-400">
          <span>Machine: <strong className="text-white font-mono">{data.machine_id}</strong></span>
          <span>Defect Frequency: <strong className="text-red-400 font-mono">{data.defective_records} / {data.total_records} ({data.defect_rate}%)</strong></span>
        </div>
      </div>

      {/* Feature Contribution Breakdown Chart & Parameter Table Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ML Parameter Contribution Bar Chart */}
        <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              <span>Root Cause Contribution Percentage (%)</span>
            </h3>
            <p className="text-xs text-slate-400">Random Forest feature importance score for defective runs</p>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.factors} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                <XAxis type="number" stroke="#64748b" fontSize={11} unit="%" />
                <YAxis dataKey="factor" type="category" stroke="#94a3b8" fontSize={11} width={130} />
                <Tooltip />
                <Bar dataKey="contribution" name="Contribution (%)" radius={[0, 6, 6, 0]}>
                  {data.factors.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Parameter Deviation Matrix Table */}
        <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
          <div>
            <h3 className="text-base font-bold text-white">Parameter Anomaly Matrix</h3>
            <p className="text-xs text-slate-400">Comparison of average values in Defective vs Safe production batches</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                <tr>
                  <th className="p-3">Parameter</th>
                  <th className="p-3">Contribution</th>
                  <th className="p-3">Defective Avg</th>
                  <th className="p-3">Safe Avg</th>
                  <th className="p-3 text-right">Deviation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 font-medium">
                {data.factors.map((f, idx) => (
                  <tr key={idx} className="hover:bg-slate-900/40">
                    <td className="p-3 font-bold text-white">{f.factor}</td>
                    <td className="p-3 font-mono font-bold text-cyan-400">{f.contribution}%</td>
                    <td className="p-3 font-mono text-red-400 font-bold">{f.defective_avg} {f.unit}</td>
                    <td className="p-3 font-mono text-emerald-400">{f.safe_avg} {f.unit}</td>
                    <td className="p-3 font-mono text-right text-amber-400">+{f.deviation_pct}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Action Next Step Banner */}
      <div className="p-6 rounded-2xl glass-panel border border-cyan-500/20 bg-gradient-to-r from-slate-900 via-cyan-950/20 to-slate-900 flex items-center justify-between">
        <div>
          <h4 className="text-sm font-bold text-white">Ready to test current parameters for upcoming batches?</h4>
          <p className="text-xs text-slate-400">Pass parameter values to the ML What-If simulator to predict risk probability prior to run.</p>
        </div>

        <button
          onClick={() => setActiveTab('predict')}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/25 transition flex items-center space-x-2 shrink-0"
        >
          <span>Launch What-If Risk Predictor</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
