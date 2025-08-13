import { Router } from 'express';
import { z } from 'zod';
import { pool } from '../lib/db.js';

const router = Router();

const getSchema = z.object({ userId: z.string().uuid() });

router.get('/', async (req, res) => {
  const parse = getSchema.safeParse(req.query);
  if (!parse.success) return res.status(400).json({ error: 'Invalid query', details: parse.error.flatten() });
  const { userId } = parse.data;
  const r = await pool.query(`SELECT monthly_income_cents as "monthlyIncomeCents", emergency_fund_cents as "emergencyFundCents" FROM settings WHERE user_id = $1`, [userId]);
  const row = r.rows[0] || { monthlyIncomeCents: 0, emergencyFundCents: 0 };
  res.json({ monthlyIncome: row.monthlyIncomeCents / 100, emergencyFund: row.emergencyFundCents / 100 });
});

const putSchema = z.object({
  userId: z.string().uuid(),
  monthlyIncome: z.number().nonnegative(),
  emergencyFund: z.number().nonnegative(),
});

router.put('/', async (req, res) => {
  const parse = putSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: 'Invalid payload', details: parse.error.flatten() });
  const { userId, monthlyIncome, emergencyFund } = parse.data;
  const mi = Math.round(monthlyIncome * 100);
  const ef = Math.round(emergencyFund * 100);
  await pool.query(`INSERT INTO settings (user_id, monthly_income_cents, emergency_fund_cents) VALUES ($1,$2,$3)
    ON CONFLICT (user_id) DO UPDATE SET monthly_income_cents=EXCLUDED.monthly_income_cents, emergency_fund_cents=EXCLUDED.emergency_fund_cents, updated_at=NOW()`,
    [userId, mi, ef]
  );
  res.json({ ok: true });
});

export default router;