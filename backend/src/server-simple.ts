import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Simple server working!' });
});

app.post('/api/auth/register', (req, res) => {
  console.log('Register endpoint hit!', req.body);
  res.json({ message: 'Register endpoint', data: req.body });
});

const server = app.listen(PORT, () => {
  console.log(`✅ Simple server running on port ${PORT}`);
});

// IMPORTANTE: Não exportar app se estiver rodando como script principal
if (require.main === module) {
  console.log('Running as main module - server will stay alive');
}

export default app;

