// Quick server test script
const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.get('/health', (req, res) => {
  console.log('✅ Health check received');
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.post('/get-hint', (req, res) => {
  console.log('📨 Request received:', req.body);
  res.json({ hint: 'Test response from server - connection working!' });
});

app.listen(port, () => {
  console.log(`🚀 Test server running on http://localhost:${port}`);
  console.log('✅ Server is ready for CodeHint extension');
});
