const store = require('../config/store');

exports.getCAPAs = (req, res) => {
  res.json({ success: true, capas: store.capas });
};

exports.createCAPA = (req, res) => {
  const { title, description, machine_id, defect_type, assigned_to, priority, due_date, before_defect_rate } = req.body;
  const newCapa = {
    id: `CAPA-${100 + store.capas.length + 1}`,
    title: title || `Corrective Action for ${machine_id || 'Machine'}`,
    description: description || 'Perform maintenance and parameter calibration.',
    machine_id: machine_id || 'M-04',
    defect_type: defect_type || 'Surface Crack',
    assigned_to: assigned_to || 'Maintenance Team',
    priority: priority || 'HIGH',
    due_date: due_date || new Date(Date.now() + 7 * 86400000).toISOString().substring(0, 10),
    status: 'OPEN',
    created_at: new Date().toISOString().substring(0, 10),
    before_defect_rate: parseFloat(before_defect_rate || 12.4),
    after_defect_rate: null
  };

  store.capas.unshift(newCapa);
  res.json({ success: true, message: 'Corrective Action Created Successfully', capa: newCapa });
};

exports.updateCAPAStatus = (req, res) => {
  const { id } = req.params;
  const { status, after_defect_rate } = req.body;

  const capa = store.capas.find(c => c.id === id);
  if (!capa) {
    return res.status(404).json({ success: false, message: 'CAPA task not found' });
  }

  if (status) capa.status = status;
  if (after_defect_rate !== undefined && after_defect_rate !== null) {
    capa.after_defect_rate = parseFloat(after_defect_rate);
  }

  res.json({ success: true, message: 'CAPA updated successfully', capa });
};
