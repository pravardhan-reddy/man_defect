const express = require('express');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const store = require('./config/store');

const authController = require('./controllers/authController');
const dashboardController = require('./controllers/dashboardController');
const dataController = require('./controllers/dataController');
const defectController = require('./controllers/defectController');
const mlController = require('./controllers/mlController');
const capaController = require('./controllers/capaController');
const beforeAfterController = require('./controllers/beforeAfterController');
const reportController = require('./controllers/reportController');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Setup Multer for CSV uploads
const uploadDir = path.join(__dirname, 'uploads');
if (!require('fs').existsSync(uploadDir)) {
  require('fs').mkdirSync(uploadDir, { recursive: true });
}
const upload = multer({ dest: uploadDir });

// Auth Routes
app.post('/api/auth/login', authController.login);
app.get('/api/auth/me', authController.getMe);

// Dashboard
app.get('/api/dashboard', dashboardController.getDashboardStats);

// Data Ingestion & Sample
app.post('/api/data/upload', upload.single('file'), dataController.uploadCSV);
app.get('/api/data/stats', dataController.getDatasetStats);
app.get('/api/data/sample', dataController.downloadSampleCSV);

// Defect Analytics
app.get('/api/defects/analytics', defectController.getAnalytics);

// AI ML Integration Proxy
app.post('/api/predict', mlController.predictRisk);
app.post('/api/root-causes/analyze', mlController.getRootCause);

// CAPA Actions
app.get('/api/corrective-actions', capaController.getCAPAs);
app.post('/api/corrective-actions', capaController.createCAPA);
app.put('/api/corrective-actions/:id', capaController.updateCAPAStatus);

// Before vs After Impact
app.get('/api/analytics/before-after', beforeAfterController.getBeforeAfterAnalysis);

// Reports
app.get('/api/reports/generate', reportController.generateExecutiveReport);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', recordsLoaded: store.records.length });
});

// Initialize Data Store and Start Server
store.init().then(() => {
  app.listen(PORT, () => {
    console.log(`DefectIQ Node.js Backend Server running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Failed to initialize data store:', err);
});
