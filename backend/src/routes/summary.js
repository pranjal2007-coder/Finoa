import { Router } from 'express';
import { z } from 'zod';
import { pool } from '../lib/db.js';

const router = Router();

const summaryQuerySchema = z.object({
  userId: z.string().uuid(),
  from: z.string().optional(),
  to: z.string().optional(),
});

router.get('/', async (req, res) => {
  try {
    const parse = summaryQuerySchema.safeParse(req.query);
    if (!parse.success) {
      return res.status(400).json({ error: 'Invalid query', details: parse.error.flatten() });
    }
    const { userId, from, to } = parse.data;

    const params = [userId];
    let where = 'WHERE user_id = $1';
    if (from) {
      params.push(from);
      where += ` AND occurred_on >= $${params.length}`;
    }
    if (to) {
      params.push(to);
      where += ` AND occurred_on <= $${params.length}`;
    }

    const totalResult = await pool.query(
      `SELECT COALESCE(SUM(amount_cents),0) AS total_cents FROM transactions ${where}`,
      params
    );
    const byCategoryResult = await pool.query(
      `SELECT category, COALESCE(SUM(amount_cents),0) AS cents FROM transactions ${where} GROUP BY category ORDER BY cents DESC`,
      params
    );

    const total = Number(totalResult.rows[0].total_cents) / 100;
    const byCategory = byCategoryResult.rows.map(r => ({ category: r.category, amount: Number(r.cents) / 100 }));

    res.json({ total, byCategory });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to compute summary' });
  }
});

export default router;