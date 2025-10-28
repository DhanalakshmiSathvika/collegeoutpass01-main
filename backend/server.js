const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const Excel = require('exceljs');
const shortid = require('shortid');
const excel = require('excel4node');

const app = express();

// CORS Configuration
const allowedOrigins = [
  'https://collegeoutpasse-git-main-sathvikas-projects-8142bcd4.vercel.app',
  'http://localhost:3000' // for local development
];

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());

// File paths
const DB_PATH = path.join(__dirname, 'data.json');
const EXCEL_PATH = path.join(__dirname, 'outpasses.xlsx');
const EXCEL_TMP = EXCEL_PATH + '.tmp';

// Database helper functions
function ensureDB() {
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify({ outpasses: [] }, null, 2), 'utf8');
  }
}

function readDB() {
  ensureDB();
  return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
}

function writeDB(db) {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf8');
}

/**
 * Write workbook with all outpasses to Excel
 */
function writeExcelFromDB() {
  try {
    const wb = new excel.Workbook();
    const ws = wb.addWorksheet('Outpasses');
    const db = readDB();
    const outpasses = db.outpasses || [];

    // Headers
    const headers = ['ID', 'Student Email', 'Reg No', 'Parent Phone', 'Reason', 'Return Time', 'Status', 'Created At'];
    headers.forEach((header, col) => {
      ws.cell(1, col + 1).string(header);
    });

    // Data rows
    outpasses.forEach((outpass, row) => {
      ws.cell(row + 2, 1).string(outpass.id || '');
      ws.cell(row + 2, 2).string(outpass.studentEmail || '');
      ws.cell(row + 2, 3).string(outpass.regNo || '');
      ws.cell(row + 2, 4).string(outpass.parentPhone || '');
      ws.cell(row + 2, 5).string(outpass.reason || '');
      ws.cell(row + 2, 6).string(outpass.returnTime || '');
      ws.cell(row + 2, 7).string(outpass.status || '');
      ws.cell(row + 2, 8).string(outpass.createdAt || '');
    });

    // Write using absolute path
    const filePath = path.join(__dirname, 'outpasses.xlsx');
    wb.write(filePath, (err) => {
      if (err) {
        console.error('Excel write error:', err);
      } else {
        console.log('Excel file updated successfully at:', filePath);
      }
    });
  } catch (error) {
    console.error('writeExcelFromDB error:', error);
  }
}

/**
 * Append exited outpass to Excel 'Exited' sheet
 */
async function appendExitedToXlsx(outpass) {
  const workbook = new Excel.Workbook();

  // If file exists, load; otherwise create new workbook
  if (fs.existsSync(EXCEL_PATH)) {
    await workbook.xlsx.readFile(EXCEL_PATH);
  }

  // Ensure 'Exited' sheet exists
  let sheet = workbook.getWorksheet('Exited');
  if (!sheet) {
    sheet = workbook.addWorksheet('Exited');
    sheet.addRow([
      'ID',
      'Student Email',
      'Reg No',
      'Parent Phone',
      'Reason',
      'Return Time',
      'Status',
      'Created At',
      'Approver',
      'Action Time'
    ]);
  }

  // Append the exited outpass
  sheet.addRow([
    outpass.id || '',
    outpass.studentEmail || '',
    outpass.regNo || '',
    outpass.parentPhone || '',
    outpass.reason || '',
    outpass.returnTime || '',
    outpass.status || '',
    outpass.createdAt || '',
    outpass.approver || '',
    outpass.actionTime || ''
  ]);

  // Write to temp file then atomically rename
  await workbook.xlsx.writeFile(EXCEL_TMP);
  if (fs.existsSync(EXCEL_PATH)) fs.unlinkSync(EXCEL_PATH);
  fs.renameSync(EXCEL_TMP, EXCEL_PATH);
}

// Request logger middleware
app.use((req, res, next) => {
  console.log(new Date().toISOString(), req.method, req.originalUrl);
  next();
});

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'College Outpass API is running',
    timestamp: new Date().toISOString()
  });
});

// Get all outpasses
app.get('/api/outpasses', (req, res) => {
  try {
    const db = readDB();
    res.json({ outpasses: db.outpasses || [] });
  } catch (err) {
    console.error('GET /api/outpasses error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new outpass
app.post('/api/outpasses', (req, res) => {
  try {
    const { studentEmail, parentPhone, reason, returnTime, regNo } = req.body;
    
    // Validation
    if (!studentEmail || !parentPhone || !reason || !returnTime) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const db = readDB();
    const newOutpass = {
      id: shortid.generate(),
      studentEmail,
      regNo: regNo || '',
      parentPhone,
      reason,
      returnTime,
      status: 'pending',
      createdAt: new Date().toISOString(),
      history: []
    };

    db.outpasses.push(newOutpass);
    writeDB(db);

    // Update Excel immediately when applied
    writeExcelFromDB();

    res.status(201).json({ outpass: newOutpass });
  } catch (err) {
    console.error('POST /api/outpasses error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update outpass status
app.put('/api/outpasses/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, approver } = req.body;

    // Validation
    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const db = readDB();
    const op = db.outpasses.find(o => o.id === id);
    
    if (!op) {
      return res.status(404).json({ error: 'Outpass not found' });
    }

    // Update outpass
    op.status = status;
    if (approver) op.approver = approver;
    op.actionTime = new Date().toISOString();
    op.history = op.history || [];
    op.history.push({ 
      action: status, 
      by: approver || 'system', 
      at: op.actionTime 
    });

    writeDB(db);

    // Append to Excel when security marks 'exited'
    if (status === 'exited') {
      try {
        await appendExitedToXlsx(op);
        console.log('Appended exited outpass to Excel:', op.id);
      } catch (excelErr) {
        console.error('Failed to append exited outpass to Excel:', excelErr);
        // Don't fail the API - DB was updated successfully
      }
    }

    res.json({ outpass: op });
  } catch (err) {
    console.error('PUT /api/outpasses/:id/status error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete outpass (optional - for admin)
app.delete('/api/outpasses/:id', (req, res) => {
  try {
    const { id } = req.params;
    const db = readDB();
    const index = db.outpasses.findIndex(o => o.id === id);
    
    if (index === -1) {
      return res.status(404).json({ error: 'Outpass not found' });
    }

    db.outpasses.splice(index, 1);
    writeDB(db);
    writeExcelFromDB();

    res.json({ message: 'Outpass deleted successfully' });
  } catch (err) {
    console.error('DELETE /api/outpasses/:id error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});