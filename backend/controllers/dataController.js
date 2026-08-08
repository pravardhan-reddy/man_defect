const store = require('../config/store');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

exports.uploadCSV = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No CSV file uploaded' });
  }

  const results = [];
  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on('data', (data) => {
      if (data.Batch_ID) {
        results.push({
          Batch_ID: data.Batch_ID,
          Machine_ID: data.Machine_ID || 'M-01',
          Line_ID: data.Line_ID || 'Line-1',
          Product_ID: data.Product_ID || 'PROD-A10',
          Temperature: parseFloat(data.Temperature || 75),
          Pressure: parseFloat(data.Pressure || 8.5),
          Speed: parseInt(data.Speed || 1200, 10),
          Vibration: parseFloat(data.Vibration || 2.0),
          Humidity: parseFloat(data.Humidity || 50),
          Operator: data.Operator || 'Op-Alice',
          Shift: data.Shift || 'Morning',
          Production_Time: data.Production_Time || new Date().toISOString().substring(0, 16).replace('T', ' '),
          Has_Defect: parseInt(data.Has_Defect || 0, 10),
          Defect_Type: data.Defect_Type || 'None',
          Defect_Status: data.Defect_Status || 'PASS'
        });
      }
    })
    .on('end', () => {
      if (results.length > 0) {
        store.records = [...results, ...store.records];
      }
      // Remove temp upload file
      fs.unlinkSync(req.file.path);

      const totalDefects = results.filter(r => r.Has_Defect === 1).length;
      res.json({
        success: true,
        message: `Successfully processed and validated ${results.length} production records.`,
        stats: {
          total_records: results.length,
          total_defects: totalDefects,
          defect_rate: parseFloat(((totalDefects / results.length) * 100).toFixed(2)),
          machines_detected: [...new Set(results.map(r => r.Machine_ID))].length
        }
      });
    })
    .on('error', (err) => {
      res.status(500).json({ success: false, message: 'Error processing CSV file: ' + err.message });
    });
};

exports.getDatasetStats = (req, res) => {
  const total = store.records.length;
  const defects = store.records.filter(r => r.Has_Defect === 1).length;
  const machines = [...new Set(store.records.map(r => r.Machine_ID))];
  const products = [...new Set(store.records.map(r => r.Product_ID))];
  const operators = [...new Set(store.records.map(r => r.Operator))];

  res.json({
    success: true,
    data: {
      totalRecords: total,
      totalDefects: defects,
      defectRate: parseFloat(((defects / total) * 100).toFixed(2)),
      machinesCount: machines.length,
      machinesList: machines,
      productsCount: products.length,
      productsList: products,
      operatorsCount: operators.length,
      operatorsList: operators
    }
  });
};

exports.downloadSampleCSV = (req, res) => {
  const csvPath = path.join(__dirname, '../../data/manufacturing_sample_5000.csv');
  if (fs.existsSync(csvPath)) {
    res.download(csvPath, 'defectiq_manufacturing_sample_5000.csv');
  } else {
    res.status(404).json({ success: false, message: 'Sample CSV file not found' });
  }
};
