const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Example route — adapt to your existing backend logic and routes
app.post('/apply-outpass', async (req, res) => {
  try {
    const payload = req.body;
    // ...your processing (DB/email/etc)...
    return res.json({ success: true, data: payload });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

app.get('/health', (req, res) => res.json({ status: 'ok' }));

module.exports = serverless(app);