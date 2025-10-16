// Servidor mínimo para testar
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Test server working' });
});

const server = app.listen(3001, () => {
  console.log('✅ Test server running on port 3001');
});

// Manter processo vivo
setInterval(() => {
  console.log('Server is alive...');
}, 30000);

