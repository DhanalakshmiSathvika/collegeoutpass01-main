const express = require('express');
const serverless = require('serverless-http');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());

// Add your existing Express routes here
app.get('/test', (req, res) => {
  res.json({ message: 'Backend is running' });
});

module.exports = serverless(app);

const API_URL = import.meta.env.VITE_API_URL || process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Update your fetch/axios calls to use API_URL
const response = await fetch(`${API_URL}/your-endpoint`);