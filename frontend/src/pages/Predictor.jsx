import React, { useState } from 'react';
import RiskBadge from '../components/RiskBadge';
import { Cpu, Zap, AlertTriangle, CheckCircle, ArrowRight, Plus, RefreshCw, ShieldAlert } from 'lucide-react';

export default function Predictor({ setActiveTab, onCreateCapaFromPrediction }) {
  const [machine, setMachine] = useState('M-04');
  const [line, setLine] = useState('Line-2');
  const [temp, setTemp] = useState('84.0');
  const [pressure, setPressure] = useState('10.1');
  const [speed, setSpeed] = useState('1450');
  const [vibration, setVibration] = useState('4.8');
  const [humidity, setHumidity] = useState('72.0');
  const [shift, setShift] = useState('Night');
  const [operator, setOperator] = useState('Op-Alice');

  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState(null);

  const handlePredict = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      Machine_ID: machine,
      Line_ID: line,
      Temperature: parseFloat(temp),
      Pressure: parseFloat(pressure),
      Speed: parseInt(speed, 10),
      Vibration: parseFloat(vibration),
      Humidity: parseFloat(humidity),
      Shift: shift,
      Operator: operator
    };

    try {
      const res = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const json = await res.json();
      if (json.success) {
        setPrediction(json.data);
      }
    } catch (err) {
      console.error('Prediction failed', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCapa = () => {
    if (onCreateCapaFromPrediction && prediction) {
      onCreateCapaFromPrediction({
        machine_id: machine,
        defect_type: prediction.likely_defect_type || 'Surface Crack',
        before_defect_rate: prediction.defect_probability,
        description: `Corrective action triggered from Predictor: ${prediction.explanation}`
      });
    }
    setActiveTab('capa');
  };

  const loadPresetHighRisk = () => {
    setMachine('M-04');
    setLine('Line-2');
    setTemp('84.0');
    setPressure('10.1');
    setSpeed('1480');
    setVibration('4.8');
    setHumidity('73.0');
    setShift('Night');
    setOperator('Op-Alice');
  };

  const loadPresetNormal = () => {
    setMachine('M-01');
    setLine('Line-1');
    setTemp('74.0');
    setPressure('8.6');
    setSpeed('1210');
    setVibration('1.8');
    setHumidity('48.0');
    setShift('Morning');
    setOperator('Op-Bob');
  };

  return (
    <div className="space-y-8 p-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Cpu className="w-6 h-6 text-cyan-400" />
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Defect Risk Predictor & What-If Simulator</h1>
          </div>
          <p className="text-slate-400 text-sm mt-0.5">
            Enter real-time production parameters to simulate and predict batch defect likelihood before manufacturing runs.
          </p>
        </div>

        {/* Preset Quick Buttons */}
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={loadPresetHighRisk}
            className="px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-semibold transition"
          >
            Load High-Risk Anomaly Preset (82%)
          </button>
          <button
            type="button"
            onClick={loadPresetNormal}
            className="px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold transition"
          >
            Load Normal Preset (8%)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Parameter Simulator Form */}
        <form onSubmit={handlePredict} className="p-8 rounded-3xl glass-panel border border-slate-800 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h2 className="text-base font-bold text-white flex items-center space-x-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              <span>Production Parameter Form</span>
            </h2>
            <span className="text-xs text-slate-400 font-mono">Live Model Inference</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Machine Unit</label>
              <select
                value={machine}
                onChange={(e) => setMachine(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white font-medium focus:border-cyan-500"
              >
                <option value="M-04">Machine M-04 (High Anomaly)</option>
                <option value="M-07">Machine M-07 (Pressure Drop)</option>
                <option value="M-01">Machine M-01</option>
                <option value="M-02">Machine M-02</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Production Line</label>
              <select
                value={line}
                onChange={(e) => setLine(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white font-medium focus:border-cyan-500"
              >
                <option value="Line-1">Line-1</option>
                <option value="Line-2">Line-2</option>
                <option value="Line-3">Line-3</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Temperature (°C)</label>
              <input
                type="number"
                step="0.1"
                value={temp}
                onChange={(e) => setTemp(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono text-sm focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Pressure (bar)</label>
              <input
                type="number"
                step="0.1"
                value={pressure}
                onChange={(e) => setPressure(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono text-sm focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Speed (RPM)</label>
              <input
                type="number"
                value={speed}
                onChange={(e) => setSpeed(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono text-sm focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Mechanical Vibration (mm/s)</label>
              <input
                type="number"
                step="0.1"
                value={vibration}
                onChange={(e) => setVibration(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono text-sm focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Relative Humidity (%)</label>
              <input
                type="number"
                step="0.1"
                value={humidity}
                onChange={(e) => setHumidity(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono text-sm focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Shift</label>
              <select
                value={shift}
                onChange={(e) => setShift(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white font-medium focus:border-cyan-500"
              >
                <option value="Morning">Morning</option>
                <option value="Afternoon">Afternoon</option>
                <option value="Night">Night</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm shadow-xl shadow-cyan-500/25 transition flex items-center justify-center space-x-2"
          >
            <Cpu className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Running ML Inference...' : 'PREDICT DEFECT RISK'}</span>
          </button>
        </form>

        {/* Prediction Results Display Card */}
        <div className="space-y-6">
          {prediction ? (
            <div className={`p-8 rounded-3xl glass-panel border ${
              prediction.risk_level === 'HIGH' ? 'border-red-500/40 bg-gradient-to-br from-red-950/30 via-slate-900 to-slate-950' : 'border-emerald-500/40 bg-gradient-to-br from-emerald-950/30 via-slate-900 to-slate-950'
            } space-y-6`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Model Prediction Outcome</p>
                  <h2 className="text-2xl font-extrabold text-white mt-1">Batch Defect Risk</h2>
                </div>
                <RiskBadge level={prediction.risk_level} percentage={prediction.defect_probability} />
              </div>

              {/* Gauge Score Counter */}
              <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400 font-semibold">Defect Probability Score</p>
                  <p className={`text-4xl font-extrabold font-mono mt-1 ${
                    prediction.risk_level === 'HIGH' ? 'text-red-400' : 'text-emerald-400'
                  }`}>
                    {prediction.defect_probability}%
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-xs text-slate-400 font-semibold">Likely Defect Category</p>
                  <p className="text-lg font-bold text-white mt-1">{prediction.likely_defect_type}</p>
                </div>
              </div>

              {/* Natural Language Explanation */}
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                <p className="text-xs font-bold text-cyan-400 uppercase tracking-wider">AI Model Explanation</p>
                <p className="text-xs text-slate-200 leading-relaxed">{prediction.explanation}</p>
              </div>

              {/* Top Risk Factor Breakdown */}
              <div className="space-y-3">
                <p className="text-xs font-bold text-slate-300 uppercase tracking-wider">Primary Risk Factors (SHAP Contributions)</p>
                <div className="space-y-2">
                  {prediction.contributing_factors.map((f, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-white">{f.factor}</span>
                        <span className="text-slate-400 font-mono ml-2">({f.val})</span>
                      </div>
                      <span className="font-bold text-red-400 font-mono">+{f.impact_pct}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Trigger CAPA Button */}
              <div className="pt-2">
                <button
                  onClick={handleCreateCapa}
                  className="w-full py-3.5 rounded-xl bg-red-500 hover:bg-red-400 text-white font-bold text-xs shadow-lg shadow-red-500/25 transition flex items-center justify-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Corrective Action Task (CAPA)</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-12 rounded-3xl glass-panel border border-slate-800 text-center flex flex-col items-center justify-center space-y-3 min-h-[400px]">
              <Cpu className="w-12 h-12 text-slate-600 animate-pulse" />
              <h3 className="text-base font-bold text-slate-300">Ready for Risk Simulation</h3>
              <p className="text-xs text-slate-500 max-w-sm">
                Enter current machine metrics on the left or click "Load High-Risk Anomaly Preset" above to run the AI model.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
