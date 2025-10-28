const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Put your API endpoints here (example)
app.post('/apply-outpass', async (req, res) => {
  try {
    const { phoneNumber, reason, leavingDate } = req.body;
    // Add your logic here
    res.json({ success: true, message: 'Outpass application submitted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/health', (req, res) => res.json({ status: 'ok' }));

module.exports = serverless(app);