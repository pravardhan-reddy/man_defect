const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

class DataStore {
  constructor() {
    this.records = [];
    this.capas = [
      {
        id: 'CAPA-101',
        title: 'Machine M-04 Bearing & Vibration Damper Overhaul',
        description: 'Perform dynamic rebalancing and inspect roller bearings on Machine M-04 to mitigate 4.8 mm/s vibration spike.',
        machine_id: 'M-04',
        defect_type: 'Surface Crack',
        assigned_to: 'Maintenance Engineering',
        priority: 'HIGH',
        due_date: '2026-08-15',
        status: 'IN_PROGRESS',
        created_at: '2026-08-01',
        before_defect_rate: 12.4,
        after_defect_rate: 5.8
      },
      {
        id: 'CAPA-102',
        title: 'Line 2 Thermal Loop Cooling Recalibration',
        description: 'Adjust thermal heat exchanger valve settings to cap peak operating temperature under 78°C.',
        machine_id: 'M-04',
        defect_type: 'Surface Crack',
        assigned_to: 'Thermal Systems Team',
        priority: 'CRITICAL',
        due_date: '2026-08-12',
        status: 'OPEN',
        created_at: '2026-08-03',
        before_defect_rate: 14.2,
        after_defect_rate: null
      },
      {
        id: 'CAPA-103',
        title: 'Machine M-07 Pneumatic Regulator Valve Replacement',
        description: 'Replace faulty pressure control regulator on M-07 to eliminate random pressure drops below 6.2 bar.',
        machine_id: 'M-07',
        defect_type: 'Dimensional Deviation',
        assigned_to: 'Pneumatics Team',
        priority: 'HIGH',
        due_date: '2026-08-18',
        status: 'OPEN',
        created_at: '2026-08-05',
        before_defect_rate: 11.8,
        after_defect_rate: null
      }
    ];
    this.alerts = [
      { id: 'ALT-1', type: 'CRITICAL', title: 'High Vibration Spike on M-04', desc: 'Vibration reached 5.2 mm/s on Night Shift (Batch BAT-14820)', time: '10 mins ago', read: false },
      { id: 'ALT-2', type: 'WARNING', title: 'Surface Crack Cluster Detected', desc: 'Surface crack rate reached 17.3% on Line-2 during last 24h', time: '1 hour ago', read: false },
      { id: 'ALT-3', type: 'INFO', title: 'Model Re-trained Successfully', desc: 'ML Engine updated with 5,000 production records (Accuracy: 94.2%)', time: '3 hours ago', read: true }
    ];
  }

  async init() {
    const csvPath = path.join(__dirname, '../../data/manufacturing_sample_5000.csv');
    if (!fs.existsSync(csvPath)) {
      console.log('Sample CSV not found at', csvPath);
      return;
    }

    return new Promise((resolve, reject) => {
      const results = [];
      fs.createReadStream(csvPath)
        .pipe(csv())
        .on('data', (data) => {
          results.push({
            Batch_ID: data.Batch_ID,
            Machine_ID: data.Machine_ID,
            Line_ID: data.Line_ID,
            Product_ID: data.Product_ID,
            Temperature: parseFloat(data.Temperature),
            Pressure: parseFloat(data.Pressure),
            Speed: parseInt(data.Speed, 10),
            Vibration: parseFloat(data.Vibration),
            Humidity: parseFloat(data.Humidity),
            Operator: data.Operator,
            Shift: data.Shift,
            Production_Time: data.Production_Time,
            Has_Defect: parseInt(data.Has_Defect, 10),
            Defect_Type: data.Defect_Type,
            Defect_Status: data.Defect_Status
          });
        })
        .on('end', () => {
          this.records = results;
          console.log(`Loaded ${this.records.length} production records into store.`);
          resolve();
        })
        .on('error', (err) => reject(err));
    });
  }

  getDashboardData() {
    const totalBatches = this.records.length;
    const defects = this.records.filter(r => r.Has_Defect === 1);
    const totalDefects = defects.length;
    const defectRate = totalBatches ? ((totalDefects / totalBatches) * 100).toFixed(2) : 0;

    const scrapCount = this.records.filter(r => r.Defect_Status === 'SCRAP').length;
    const reworkCount = this.records.filter(r => r.Defect_Status === 'REWORK').length;
    const scrapRate = totalBatches ? ((scrapCount / totalBatches) * 100).toFixed(2) : 0;
    const reworkRate = totalBatches ? ((reworkCount / totalBatches) * 100).toFixed(2) : 0;

    // Top Defect Breakdown
    const defectCounts = {};
    defects.forEach(d => {
      if (d.Defect_Type && d.Defect_Type !== 'None') {
        defectCounts[d.Defect_Type] = (defectCounts[d.Defect_Type] || 0) + 1;
      }
    });

    const topDefects = Object.keys(defectCounts).map(type => ({
      type,
      count: defectCounts[type],
      percentage: parseFloat(((defectCounts[type] / totalDefects) * 100).toFixed(1))
    })).sort((a, b) => b.count - a.count);

    // Risky Machines Matrix
    const machineStats = {};
    this.records.forEach(r => {
      if (!machineStats[r.Machine_ID]) {
        machineStats[r.Machine_ID] = { total: 0, defects: 0 };
      }
      machineStats[r.Machine_ID].total += 1;
      if (r.Has_Defect === 1) machineStats[r.Machine_ID].defects += 1;
    });

    const riskyMachines = Object.keys(machineStats).map(m => {
      const tot = machineStats[m].total;
      const def = machineStats[m].defects;
      const rate = parseFloat(((def / tot) * 100).toFixed(1));
      let riskLevel = 'LOW';
      if (rate >= 14) riskLevel = 'HIGH';
      else if (rate >= 8) riskLevel = 'MEDIUM';
      return { machine: m, total: tot, defects: def, defect_rate: rate, riskLevel };
    }).sort((a, b) => b.defect_rate - a.defect_rate);

    // Monthly / Time Trend
    const monthlyMap = {};
    this.records.forEach(r => {
      const month = r.Production_Time.substring(0, 7); // e.g. 2026-03
      if (!monthlyMap[month]) {
        monthlyMap[month] = { month, total: 0, defects: 0 };
      }
      monthlyMap[month].total += 1;
      if (r.Has_Defect === 1) monthlyMap[month].defects += 1;
    });

    const defectTrend = Object.values(monthlyMap).map(m => ({
      month: m.month,
      batches: m.total,
      defects: m.defects,
      defect_rate: parseFloat(((m.defects / m.total) * 100).toFixed(2))
    })).sort((a, b) => a.month.localeCompare(b.month)).slice(-6);

    return {
      totalBatches,
      totalDefects,
      defectRate: parseFloat(defectRate),
      scrapRate: parseFloat(scrapRate),
      reworkRate: parseFloat(reworkRate),
      mostCommonDefect: topDefects[0] ? topDefects[0].type : 'N/A',
      topDefects,
      riskyMachines,
      defectTrend,
      alerts: this.alerts
    };
  }

  filterAnalytics(filters = {}) {
    let result = [...this.records];
    if (filters.machine && filters.machine !== 'ALL') {
      result = result.filter(r => r.Machine_ID === filters.machine);
    }
    if (filters.line && filters.line !== 'ALL') {
      result = result.filter(r => r.Line_ID === filters.line);
    }
    if (filters.product && filters.product !== 'ALL') {
      result = result.filter(r => r.Product_ID === filters.product);
    }
    if (filters.shift && filters.shift !== 'ALL') {
      result = result.filter(r => r.Shift === filters.shift);
    }
    if (filters.defectType && filters.defectType !== 'ALL') {
      result = result.filter(r => r.Defect_Type === filters.defectType);
    }

    const total = result.length;
    const defects = result.filter(r => r.Has_Defect === 1);
    const totalDefects = defects.length;
    const defectRate = total ? parseFloat(((totalDefects / total) * 100).toFixed(2)) : 0;

    // Breakdown by Machine
    const machineBreakdown = {};
    result.forEach(r => {
      if (!machineBreakdown[r.Machine_ID]) machineBreakdown[r.Machine_ID] = { total: 0, defects: 0 };
      machineBreakdown[r.Machine_ID].total += 1;
      if (r.Has_Defect === 1) machineBreakdown[r.Machine_ID].defects += 1;
    });

    const machineData = Object.keys(machineBreakdown).map(m => ({
      machine: m,
      defectRate: parseFloat(((machineBreakdown[m].defects / machineBreakdown[m].total) * 100).toFixed(1)),
      defects: machineBreakdown[m].defects,
      total: machineBreakdown[m].total
    }));

    // Breakdown by Shift
    const shiftBreakdown = {};
    result.forEach(r => {
      if (!shiftBreakdown[r.Shift]) shiftBreakdown[r.Shift] = { total: 0, defects: 0 };
      shiftBreakdown[r.Shift].total += 1;
      if (r.Has_Defect === 1) shiftBreakdown[r.Shift].defects += 1;
    });

    const shiftData = Object.keys(shiftBreakdown).map(s => ({
      shift: s,
      defectRate: parseFloat(((shiftBreakdown[s].defects / shiftBreakdown[s].total) * 100).toFixed(1)),
      defects: shiftBreakdown[s].defects
    }));

    // Breakdown by Operator
    const opBreakdown = {};
    result.forEach(r => {
      if (!opBreakdown[r.Operator]) opBreakdown[r.Operator] = { total: 0, defects: 0 };
      opBreakdown[r.Operator].total += 1;
      if (r.Has_Defect === 1) opBreakdown[r.Operator].defects += 1;
    });

    const operatorData = Object.keys(opBreakdown).map(op => ({
      operator: op,
      defectRate: parseFloat(((opBreakdown[op].defects / opBreakdown[op].total) * 100).toFixed(1)),
      defects: opBreakdown[op].defects
    }));

    return {
      total,
      totalDefects,
      defectRate,
      machineData,
      shiftData,
      operatorData,
      records: result.slice(0, 100) // Return first 100 for table preview
    };
  }
}

const store = new DataStore();
module.exports = store;
