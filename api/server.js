const serverless = require('serverless-http');
const express = require('express');
const app = express();

app.use(express.json());

app.get('/', (req, res) => res.json({ ok: true, message: 'serverless backend running' }));

module.exports = serverless(app);