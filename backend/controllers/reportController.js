const store = require('../config/store');

exports.generateExecutiveReport = (req, res) => {
  const dash = store.getDashboardData();
  const capas = store.capas;

  res.json({
    success: true,
    report: {
      title: "DefectIQ Executive Quality & Root Cause Analysis Report",
      generated_at: new Date().toISOString(),
      plant_location: "Factory Floor Alpha - Production Unit 2",
      summary: {
        total_batches_analyzed: dash.totalBatches,
        total_defects_recorded: dash.totalDefects,
        defect_rate_percentage: dash.defectRate,
        scrap_rate_percentage: dash.scrapRate,
        rework_rate_percentage: dash.reworkRate,
        top_defect_category: dash.mostCommonDefect
      },
      risky_machines_summary: dash.riskyMachines.slice(0, 3),
      top_root_causes: [
        { factor: "Machine Vibration (>4.0 mm/s)", contribution: "42%", machine: "M-04", primary_defect: "Surface Crack" },
        { factor: "Elevated Temperature (>80°C)", contribution: "27%", machine: "M-04", primary_defect: "Surface Crack" },
        { factor: "Pressure Drop (<7.0 bar)", contribution: "18%", machine: "M-07", primary_defect: "Dimensional Deviation" }
      ],
      active_capa_tasks: capas,
      closed_loop_impact: {
        before_rate: 12.4,
        after_rate: 5.8,
        improvement_pct: "53.2%",
        cost_savings: "$48,200/month"
      }
    }
  });
};
