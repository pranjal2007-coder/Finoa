import { Router } from 'express';
import { z } from 'zod';
import { pool } from '../lib/db.js';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

const createTransactionSchema = z.object({
  userId: z.string().uuid(),
  date: z.string(), // ISO date
  category: z.string().min(1),
  description: z.string().optional().nullable(),
  amount: z.number(), // in INR rupees
});

router.get('/', async (req, res) => {
  try {
    const { userId, from, to } = req.query;
    const params = [];
    let where = '';
    if (userId) {
      params.push(userId);
      where += ` WHERE user_id = $${params.length}`;
    }
    if (from) {
      params.push(from);
      where += params.length === 1 ? ` WHERE occurred_on >= $${params.length}` : ` AND occurred_on >= $${params.length}`;
    }
    if (to) {
      params.push(to);
      where += params.length === 1 ? ` WHERE occurred_on <= $${params.length}` : ` AND occurred_on <= $${params.length}`;
    }
    const { rows } = await pool.query(
      `SELECT id, user_id as "userId", occurred_on as date, category, description, amount_cents as "amountCents", currency, created_at as "createdAt" FROM transactions${where} ORDER BY occurred_on DESC LIMIT 500`,
      params
    );
    const data = rows.map(r => ({
      ...r,
      amount: r.amountCents / 100,
    }));
    res.json({ transactions: data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

router.post('/', async (req, res) => {
  try {
    const parse = createTransactionSchema.safeParse(req.body);
    if (!parse.success) {
      return res.status(400).json({ error: 'Invalid payload', details: parse.error.flatten() });
    }
    const { userId, date, category, description, amount } = parse.data;

    const id = uuidv4();
    const amountCents = Math.round(amount * 100);

    await pool.query(
      `INSERT INTO transactions (id, user_id, occurred_on, category, description, amount_cents) VALUES ($1, $2, $3, $4, $5, $6)`,
      [id, userId, date, category, description ?? null, amountCents]
    );

    res.status(201).json({ id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create transaction' });
  }
});

export default router;