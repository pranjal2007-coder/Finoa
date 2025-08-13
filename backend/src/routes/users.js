import { Router } from 'express';
import { z } from 'zod';
import { pool } from '../lib/db.js';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

const createSchema = z.object({
  name: z.string().min(1),
  email: z.string().email().optional(),
  avatarUrl: z.string().url().optional(),
});

router.post('/', async (req, res) => {
  try {
    const parsed = createSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'Invalid payload', details: parsed.error.flatten() });

    const id = uuidv4();
    const { name, email, avatarUrl } = parsed.data;

    await pool.query(
      `INSERT INTO users (id, name, email, avatar_url) VALUES ($1, $2, $3, $4)`,
      [id, name, email ?? null, avatarUrl ?? null]
    );

    res.status(201).json({ id, name, email: email ?? null, avatarUrl: avatarUrl ?? null });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`SELECT id, name, email, avatar_url as "avatarUrl" FROM users WHERE id = $1`, [id]);
    if (result.rowCount === 0) return res.status(404).json({ error: 'User not found' });
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  avatarUrl: z.string().url().optional(),
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const parsed = updateSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'Invalid payload', details: parsed.error.flatten() });
    const { name, avatarUrl } = parsed.data;

    const result = await pool.query(
      `UPDATE users SET name = COALESCE($2, name), avatar_url = COALESCE($3, avatar_url) WHERE id = $1 RETURNING id, name, email, avatar_url as "avatarUrl"`,
      [id, name ?? null, avatarUrl ?? null]
    );
    if (result.rowCount === 0) return res.status(404).json({ error: 'User not found' });
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

export default router;