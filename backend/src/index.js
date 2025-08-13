import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { pool, migrate } from './lib/db.js';
import askRouter from './routes/ask.js';
import transactionsRouter from './routes/transactions.js';
import summaryRouter from './routes/summary.js';
import usersRouter from './routes/users.js';
import hctbotRouter from './routes/hctbot.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok' });
  } catch (error) {
    res.status(500).json({ status: 'error', error: error.message });
  }
});

app.use('/ask', askRouter);
app.use('/transactions', transactionsRouter);
app.use('/summary', summaryRouter);
app.use('/users', usersRouter);
app.use('/hctbot', hctbotRouter);

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

const port = process.env.PORT || 4000;

migrate()
  .then(() => {
    app.listen(port, () => {
      console.log(`Finova backend running on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error('Migration failed. Exiting.', err);
    process.exit(1);
  });