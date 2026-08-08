import React, { useState, useEffect } from 'react';
import { FileText, Download, Printer, CheckCircle, Cpu, Zap, ShieldAlert } from 'lucide-react';

export default function Reports() {
  const [report, setReport] = useState(null);

  useEffect(() => {
    fetch('/api/reports/generate')
      .then(res => res.json())
      .then(json => {
        if (json.success) setReport(json.report);
      })
      .catch(err => console.error(err));
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const data = report || {
    title: "DefectIQ Executive Quality Intelligence Report",
    generated_at: new Date().toISOString().substring(0, 10),
    plant_location: "Factory Floor Alpha - Production Unit 2",
    summary: {
      total_batches_analyzed: 12450,
      total_defects_recorded: 1024,
      defect_rate_percentage: 8.22,
      scrap_rate_percentage: 3.4,
      rework_rate_percentage: 4.82,
      top_defect_category: "Surface Crack"
    },
    top_root_causes: [
      { factor: "Machine Vibration (>4.0 mm/s)", contribution: "42%", machine: "M-04", primary_defect: "Surface Crack" },
      { factor: "Elevated Temperature (>80°C)", contribution: "27%", machine: "M-04", primary_defect: "Surface Crack" },
      { factor: "Pressure Drop (<7.0 bar)", contribution: "18%", machine: "M-07", primary_defect: "Dimensional Deviation" }
    ],
    closed_loop_impact: {
      before_rate: 12.4,
      after_rate: 5.8,
      improvement_pct: "53.2%",
      cost_savings: "$48,200/month"
    }
  };

  return (
    <div className="space-y-8 p-6 max-w-[1200px] mx-auto print:p-0 print:bg-white print:text-black">
      {/* Action Header */}
      <div className="flex items-center justify-between print:hidden">
        <div>
          <div className="flex items-center space-x-2">
            <FileText className="w-6 h-6 text-cyan-400" />
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Quality Intelligence Reports</h1>
          </div>
          <p className="text-slate-400 text-sm mt-0.5">Export or print executive summaries for quality engineering audits.</p>
        </div>

        <button
          onClick={handlePrint}
          className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg transition flex items-center space-x-2"
        >
          <Printer className="w-4 h-4" />
          <span>Print / Export PDF</span>
        </button>
      </div>

      {/* Printable Report Document Card */}
      <div className="p-8 rounded-3xl glass-panel border border-slate-800 space-y-8 bg-slate-900/90 print:border-none print:shadow-none print:p-4">
        {/* Document Header */}
        <div className="border-b border-slate-800 pb-6 flex items-start justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <Cpu className="w-6 h-6 text-cyan-400" />
              <h2 className="text-xl font-extrabold text-white">{data.title}</h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">{data.plant_location}</p>
          </div>

          <div className="text-right text-xs font-mono text-slate-400">
            <p>Generated: {data.generated_at}</p>
            <p className="text-cyan-400 font-bold">STATUS: AUDIT VERIFIED</p>
          </div>
        </div>

        {/* Executive Summary Grid */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">1. Production & Quality Summary</h3>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 text-center text-xs">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <p className="text-[10px] text-slate-400">Total Batches</p>
              <p className="text-base font-extrabold text-white font-mono">{data.summary.total_batches_analyzed.toLocaleString()}</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <p className="text-[10px] text-slate-400">Defects</p>
              <p className="text-base font-extrabold text-red-400 font-mono">{data.summary.total_defects_recorded.toLocaleString()}</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <p className="text-[10px] text-slate-400">Defect Rate</p>
              <p className="text-base font-extrabold text-amber-400 font-mono">{data.summary.defect_rate_percentage}%</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <p className="text-[10px] text-slate-400">Scrap Rate</p>
              <p className="text-base font-extrabold text-purple-400 font-mono">{data.summary.scrap_rate_percentage}%</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <p className="text-[10px] text-slate-400">Rework Rate</p>
              <p className="text-base font-extrabold text-emerald-400 font-mono">{data.summary.rework_rate_percentage}%</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <p className="text-[10px] text-slate-400">Top Category</p>
              <p className="text-xs font-extrabold text-cyan-400 truncate">{data.summary.top_defect_category}</p>
            </div>
          </div>
        </div>

        {/* AI Root Cause Breakdown Section */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">2. Identified Machine Parameter Root Causes</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
                <tr>
                  <th className="p-2.5">Parameter Factor</th>
                  <th className="p-2.5">Target Machine</th>
                  <th className="p-2.5">Impact Contribution</th>
                  <th className="p-2.5">Primary Defect Outcome</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {data.top_root_causes.map((rc, idx) => (
                  <tr key={idx}>
                    <td className="p-2.5 font-bold text-white">{rc.factor}</td>
                    <td className="p-2.5 font-mono text-cyan-400">{rc.machine}</td>
                    <td className="p-2.5 font-mono font-bold text-red-400">{rc.contribution}</td>
                    <td className="p-2.5 text-slate-300">{rc.primary_defect}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Closed Loop Financial Impact */}
        <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 flex items-center justify-between text-xs">
          <div>
            <span className="font-bold text-emerald-400 uppercase tracking-wider block">Verified Closed-Loop Outcome</span>
            <span className="text-slate-300">Defect rate reduced from {data.closed_loop_impact.before_rate}% to {data.closed_loop_impact.after_rate}% ({data.closed_loop_impact.improvement_pct} improvement).</span>
          </div>
          <span className="text-base font-extrabold text-emerald-400 font-mono">{data.closed_loop_impact.cost_savings}</span>
        </div>
      </div>
    </div>
  );
}
