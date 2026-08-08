import React from 'react';

export default function RiskBadge({ level, percentage }) {
  let badgeStyle = "bg-slate-800 text-slate-300 border-slate-700";
  let dotStyle = "bg-slate-400";
  let label = level || "UNKNOWN";

  if (level === 'HIGH' || (percentage && percentage >= 65)) {
    badgeStyle = "bg-red-500/10 text-red-400 border-red-500/30 glow-danger";
    dotStyle = "bg-red-500 pulse-dot";
    label = "HIGH RISK";
  } else if (level === 'MEDIUM' || (percentage && percentage >= 35)) {
    badgeStyle = "bg-amber-500/10 text-amber-400 border-amber-500/30";
    dotStyle = "bg-amber-500";
    label = "MEDIUM RISK";
  } else if (level === 'LOW' || (percentage && percentage < 35)) {
    badgeStyle = "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 glow-success";
    dotStyle = "bg-emerald-500";
    label = "LOW RISK";
  }

  return (
    <span className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full border text-xs font-semibold uppercase tracking-wider ${badgeStyle}`}>
      <span className={`w-2 h-2 rounded-full ${dotStyle}`}></span>
      <span>{label} {percentage !== undefined ? `(${percentage}%)` : ''}</span>
    </span>
  );
}
