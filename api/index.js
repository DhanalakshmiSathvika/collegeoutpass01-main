const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');

const app = express();

app.use(cors({
  origin: ['http://localhost:3000', 'https://collegeoutpass01-main.vercel.app']
}));
app.use(express.json());

// Add your API routes here
app.get('/api/status', (req, res) => {
  res.json({ status: 'Backend is running' });
});

// Export the serverless handler
module.exports = serverless(app);