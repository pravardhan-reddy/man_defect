import React, { useState, useEffect } from 'react';
import { CheckSquare, Plus, Clock, UserCheck, ShieldAlert, CheckCircle, ArrowRight, Filter } from 'lucide-react';

export default function CapaManager({ prefilledData, setActiveTab }) {
  const [capas, setCapas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modal State
  const [showModal, setShowModal] = useState(!!prefilledData);
  const [title, setTitle] = useState(prefilledData ? `CAPA: ${prefilledData.machine_id} Vibration & Thermal Calibration` : '');
  const [description, setDescription] = useState(prefilledData ? prefilledData.description : '');
  const [machineId, setMachineId] = useState(prefilledData ? prefilledData.machine_id : 'M-04');
  const [defectType, setDefectType] = useState(prefilledData ? prefilledData.defect_type : 'Surface Crack');
  const [assignedTo, setAssignedTo] = useState('Maintenance Engineering');
  const [priority, setPriority] = useState('HIGH');
  const [dueDate, setDueDate] = useState('2026-08-18');

  const fetchCapas = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/corrective-actions');
      const json = await res.json();
      if (json.success) {
        setCapas(json.capas);
      }
    } catch (err) {
      console.error('Fetch CAPAs failed', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCapas();
  }, []);

  const handleCreateCapa = async (e) => {
    e.preventDefault();
    const payload = {
      title,
      description,
      machine_id: machineId,
      defect_type: defectType,
      assigned_to: assignedTo,
      priority,
      due_date: dueDate,
      before_defect_rate: 12.4
    };

    try {
      const res = await fetch('/api/corrective-actions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const json = await res.json();
      if (json.success) {
        fetchCapas();
        setShowModal(false);
      }
    } catch (err) {
      console.error('Create CAPA error', err);
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`/api/corrective-actions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          after_defect_rate: newStatus === 'RESOLVED' ? 5.8 : null
        })
      });
      const json = await res.json();
      if (json.success) {
        fetchCapas();
      }
    } catch (err) {
      console.error('Update status failed', err);
    }
  };

  const filteredCapas = capas.filter(c => statusFilter === 'ALL' || c.status === statusFilter);

  return (
    <div className="space-y-8 p-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <CheckSquare className="w-6 h-6 text-cyan-400" />
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Corrective & Preventive Action (CAPA) Board</h1>
          </div>
          <p className="text-slate-400 text-sm mt-0.5">
            Assign maintenance actions, track resolution statuses, and log closed-loop quality improvements.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 transition flex items-center space-x-1.5 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Create Corrective Action</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
        {['ALL', 'OPEN', 'IN_PROGRESS', 'RESOLVED'].map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
              statusFilter === st
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200 bg-slate-900/60'
            }`}
          >
            {st.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Task Board Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCapas.map((capa) => (
          <div key={capa.id} className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4 relative flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-cyan-400">{capa.id}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  capa.priority === 'CRITICAL' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                  capa.priority === 'HIGH' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-slate-800 text-slate-300'
                }`}>
                  {capa.priority}
                </span>
              </div>

              <h3 className="text-base font-bold text-white leading-snug">{capa.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{capa.description}</p>

              <div className="pt-2 grid grid-cols-2 gap-2 text-[11px] font-medium text-slate-300">
                <div className="p-2 rounded-lg bg-slate-900/80">
                  <span className="text-slate-500 block text-[10px] uppercase">Target Machine</span>
                  <span className="font-bold text-white font-mono">{capa.machine_id}</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-900/80">
                  <span className="text-slate-500 block text-[10px] uppercase">Assigned To</span>
                  <span className="font-bold text-cyan-400">{capa.assigned_to}</span>
                </div>
              </div>
            </div>

            {/* Action Status Controls */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                capa.status === 'RESOLVED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                capa.status === 'IN_PROGRESS' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30' : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
              }`}>
                {capa.status.replace('_', ' ')}
              </span>

              <div className="flex items-center space-x-1">
                {capa.status === 'OPEN' && (
                  <button
                    onClick={() => handleUpdateStatus(capa.id, 'IN_PROGRESS')}
                    className="px-2.5 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 text-[11px] font-semibold transition"
                  >
                    Start Task
                  </button>
                )}
                {capa.status === 'IN_PROGRESS' && (
                  <button
                    onClick={() => handleUpdateStatus(capa.id, 'RESOLVED')}
                    className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-[11px] font-semibold transition"
                  >
                    Mark Resolved
                  </button>
                )}
                {capa.status === 'RESOLVED' && (
                  <button
                    onClick={() => setActiveTab('before-after')}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold transition"
                  >
                    View Impact →
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Dialog */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg p-6 rounded-3xl glass-panel border border-slate-800 space-y-6">
            <h3 className="text-lg font-bold text-white">Create New Corrective Action (CAPA)</h3>

            <form onSubmit={handleCreateCapa} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Action Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Machine M-04 Bearing & Thermal Overhaul"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Detailed Description</label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe recommended engineering steps..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Target Machine</label>
                  <input
                    type="text"
                    value={machineId}
                    onChange={(e) => setMachineId(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Assigned Team</label>
                  <select
                    value={assignedTo}
                    onChange={(e) => setAssignedTo(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs"
                  >
                    <option value="Maintenance Engineering">Maintenance Engineering</option>
                    <option value="Thermal Systems Team">Thermal Systems Team</option>
                    <option value="Quality Assurance">Quality Assurance</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold"
                >
                  Save CAPA Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
