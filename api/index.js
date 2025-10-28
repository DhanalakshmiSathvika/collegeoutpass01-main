const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// Add your outpass routes here
app.post('/api/apply-outpass', async (req, res) => {
  try {
    const { phoneNumber, reason, leavingDate } = req.body;
    // Add your logic here
    res.json({ success: true, message: 'Outpass application submitted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

module.exports = serverless(app);