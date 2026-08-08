const store = require('../config/store');

exports.getAnalytics = (req, res) => {
  try {
    const filters = {
      machine: req.query.machine || 'ALL',
      line: req.query.line || 'ALL',
      product: req.query.product || 'ALL',
      shift: req.query.shift || 'ALL',
      defectType: req.query.defectType || 'ALL'
    };

    const analytics = store.filterAnalytics(filters);
    res.json({ success: true, analytics });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
