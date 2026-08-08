import React, { useState, useEffect } from 'react';
import { Filter, BarChart3, Users, Clock, RefreshCw, Cpu } from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  ScatterChart, 
  Scatter, 
  ZAxis 
} from 'recharts';

export default function DefectAnalytics() {
  const [machine, setMachine] = useState('ALL');
  const [line, setLine] = useState('ALL');
  const [product, setProduct] = useState('ALL');
  const [shift, setShift] = useState('ALL');
  const [defectType, setDefectType] = useState('ALL');

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams({ machine, line, product, shift, defectType }).toString();
      const res = await fetch(`/api/defects/analytics?${query}`);
      const json = await res.json();
      if (json.success) {
        setData(json.analytics);
      }
    } catch (err) {
      console.error('Failed to fetch defect analytics', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [machine, line, product, shift, defectType]);

  const analyticsData = data || {
    total: 5000,
    totalDefects: 411,
    defectRate: 8.22,
    machineData: [
      { machine: 'M-04', defectRate: 17.3, defects: 312, total: 1800 },
      { machine: 'M-07', defectRate: 11.3, defects: 198, total: 1750 },
      { machine: 'M-02', defectRate: 6.9, defects: 115, total: 1650 },
      { machine: 'M-01', defectRate: 5.4, defects: 85, total: 1550 }
    ],
    shiftData: [
      { shift: 'Night', defectRate: 11.4, defects: 210 },
      { shift: 'Afternoon', defectRate: 7.8, defects: 135 },
      { shift: 'Morning', defectRate: 5.2, defects: 96 }
    ],
    operatorData: [
      { operator: 'Op-Alice', defectRate: 12.8, defects: 145 },
      { operator: 'Op-Bob', defectRate: 8.4, defects: 92 },
      { operator: 'Op-Charlie', defectRate: 7.2, defects: 81 },
      { operator: 'Op-Elena', defectRate: 5.6, defects: 62 }
    ]
  };

  return (
    <div className="space-y-8 p-6 max-w-[1600px] mx-auto">
      {/* Header & Filter Controls Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-6 h-6 text-cyan-400" />
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Defect Analytics Studio</h1>
          </div>
          <p className="text-slate-400 text-sm mt-0.5">
            Multi-dimensional production quality filtering across machines, lines, shifts, and operators.
          </p>
        </div>

        <button
          onClick={fetchAnalytics}
          className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold flex items-center space-x-1.5 self-start md:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Interactive Filter Control Panel */}
      <div className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-4">
        <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-cyan-400">
          <Filter className="w-4 h-4" />
          <span>Analytics Filter Criteria</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-xs">
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Machine</label>
            <select
              value={machine}
              onChange={(e) => setMachine(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-medium focus:border-cyan-500"
            >
              <option value="ALL">All Machines</option>
              <option value="M-01">Machine M-01</option>
              <option value="M-02">Machine M-02</option>
              <option value="M-03">Machine M-03</option>
              <option value="M-04">Machine M-04 (High Risk)</option>
              <option value="M-05">Machine M-05</option>
              <option value="M-07">Machine M-07</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Production Line</label>
            <select
              value={line}
              onChange={(e) => setLine(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-medium focus:border-cyan-500"
            >
              <option value="ALL">All Lines</option>
              <option value="Line-1">Line-1</option>
              <option value="Line-2">Line-2</option>
              <option value="Line-3">Line-3</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Product</label>
            <select
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-medium focus:border-cyan-500"
            >
              <option value="ALL">All Products</option>
              <option value="PROD-A10">PROD-A10</option>
              <option value="PROD-B20">PROD-B20</option>
              <option value="PROD-C30">PROD-C30</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Shift</label>
            <select
              value={shift}
              onChange={(e) => setShift(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-medium focus:border-cyan-500"
            >
              <option value="ALL">All Shifts</option>
              <option value="Morning">Morning Shift</option>
              <option value="Afternoon">Afternoon Shift</option>
              <option value="Night">Night Shift (Highest Anomaly)</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Defect Type</label>
            <select
              value={defectType}
              onChange={(e) => setDefectType(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-medium focus:border-cyan-500"
            >
              <option value="ALL">All Defect Types</option>
              <option value="Surface Crack">Surface Crack</option>
              <option value="Dimensional Deviation">Dimensional Deviation</option>
              <option value="Color Variance">Color Variance</option>
              <option value="Porosity">Porosity</option>
            </select>
          </div>
        </div>
      </div>

      {/* Filtered Summary Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl glass-panel border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase">Batches Filtered</p>
            <p className="text-2xl font-extrabold text-white font-mono">{analyticsData.total.toLocaleString()}</p>
          </div>
          <span className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 font-mono text-xs">COUNT</span>
        </div>

        <div className="p-4 rounded-2xl glass-panel border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase">Total Defects Found</p>
            <p className="text-2xl font-extrabold text-red-400 font-mono">{analyticsData.totalDefects.toLocaleString()}</p>
          </div>
          <span className="p-2.5 rounded-xl bg-red-500/10 text-red-400 font-mono text-xs">DEFECTS</span>
        </div>

        <div className="p-4 rounded-2xl glass-panel border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase">Filter Defect Rate</p>
            <p className="text-2xl font-extrabold text-amber-400 font-mono">{analyticsData.defectRate}%</p>
          </div>
          <span className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 font-mono text-xs">RATE</span>
        </div>
      </div>

      {/* Breakdown Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Machine-wise Breakdown */}
        <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center space-x-2">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span>Machine-Wise Defect Rate Comparison (%)</span>
          </h3>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analyticsData.machineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="machine" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} unit="%" />
                <Tooltip />
                <Bar dataKey="defectRate" fill="#06B6D4" name="Defect Rate (%)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Shift-wise Breakdown */}
        <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center space-x-2">
            <Clock className="w-4 h-4 text-amber-400" />
            <span>Shift-Wise Defect Rate (%)</span>
          </h3>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analyticsData.shiftData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="shift" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} unit="%" />
                <Tooltip />
                <Bar dataKey="defectRate" fill="#F59E0B" name="Defect Rate (%)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
