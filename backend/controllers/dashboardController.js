const store = require('../config/store');

exports.getDashboardStats = (req, res) => {
  try {
    const data = store.getDashboardData();
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
