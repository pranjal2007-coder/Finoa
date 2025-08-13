import { Router } from 'express';
import { z } from 'zod';
import { pool } from '../lib/db.js';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

const signupSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
});

router.post('/signup', async (req, res) => {
  try {
    const parsed = signupSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'Invalid payload', details: parsed.error.flatten() });
    const { name, email, password } = parsed.data;

    const existing = await pool.query(`SELECT id FROM users WHERE email = $1`, [email]);
    if (existing.rowCount > 0) return res.status(409).json({ error: 'Email already registered' });

    const id = uuidv4();
    const hash = await bcrypt.hash(password, 10);
    await pool.query(`INSERT INTO users (id, name, email, password_hash) VALUES ($1, $2, $3, $4)`, [id, name, email, hash]);

    res.status(201).json({ user: { id, name, email } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to sign up' });
  }
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

router.post('/login', async (req, res) => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'Invalid payload', details: parsed.error.flatten() });
    const { email, password } = parsed.data;

    const result = await pool.query(`SELECT id, name, email, password_hash FROM users WHERE email = $1`, [email]);
    if (result.rowCount === 0) return res.status(401).json({ error: 'Invalid email or password' });

    const user = result.rows[0];
    const ok = await bcrypt.compare(password, user.password_hash || '');
    if (!ok) return res.status(401).json({ error: 'Invalid email or password' });

    res.json({ user: { id: user.id, name: user.name, email: user.email } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to login' });
  }
});

export default router;