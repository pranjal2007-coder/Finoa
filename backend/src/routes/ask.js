import { Router } from 'express';
import { z } from 'zod';
import { pool } from '../lib/db.js';
import OpenAI from 'openai';

const router = Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const askSchema = z.object({
  userId: z.string().uuid().optional(),
  question: z.string().min(1),
});

async function fetchSpendingStats(userId) {
  if (!userId) return null;
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().slice(0, 10);

  const totalThisMonth = await pool.query(
    `SELECT COALESCE(SUM(amount_cents),0) AS cents FROM transactions WHERE user_id = $1 AND occurred_on BETWEEN $2 AND $3`,
    [userId, startOfMonth, endOfMonth]
  );
  const byCategory = await pool.query(
    `SELECT category, COALESCE(SUM(amount_cents),0) AS cents FROM transactions WHERE user_id = $1 AND occurred_on BETWEEN $2 AND $3 GROUP BY category ORDER BY cents DESC`,
    [userId, startOfMonth, endOfMonth]
  );
  return {
    monthRange: { start: startOfMonth, end: endOfMonth },
    total: Number(totalThisMonth.rows[0].cents) / 100,
    byCategory: byCategory.rows.map(r => ({ category: r.category, amount: Number(r.cents) / 100 })),
  };
}

function parseQuestionForQuery(question) {
  const q = question.toLowerCase();
  const categories = ['food','transport','bills','shopping','entertainment','other'];
  const monthMatch = q.match(/last month|this month|previous month/);
  const category = categories.find(c => q.includes(c));
  if ((q.includes('how much') || q.includes('spend') || q.includes('spent')) && (q.includes('total') || category)) {
    return { type: 'spend', period: monthMatch ? 'last-month' : 'this-month', category };
  }
  return null;
}

async function runStructuredQuery(userId, parsed) {
  const now = new Date();
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
  const start = parsed.period === 'last-month' ? lastMonthStart : thisMonthStart;
  const end = parsed.period === 'last-month' ? lastMonthEnd : new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const startStr = start.toISOString().slice(0,10);
  const endStr = end.toISOString().slice(0,10);

  if (parsed.category) {
    const r = await pool.query(
      `SELECT COALESCE(SUM(amount_cents),0) AS cents FROM transactions WHERE user_id=$1 AND occurred_on BETWEEN $2 AND $3 AND LOWER(category)=LOWER($4)`,
      [userId, startStr, endStr, parsed.category]
    );
    return { total: Number(r.rows[0].cents)/100, start: startStr, end: endStr, category: parsed.category };
  } else {
    const r = await pool.query(
      `SELECT COALESCE(SUM(amount_cents),0) AS cents FROM transactions WHERE user_id=$1 AND occurred_on BETWEEN $2 AND $3`,
      [userId, startStr, endStr]
    );
    return { total: Number(r.rows[0].cents)/100, start: startStr, end: endStr };
  }
}

router.post('/', async (req, res) => {
  try {
    const parsed = askSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Invalid payload', details: parsed.error.flatten() });
    }
    const { userId, question } = parsed.data;

    const maybe = userId ? parseQuestionForQuery(question) : null;
    if (userId && maybe) {
      const result = await runStructuredQuery(userId, maybe);
      let text = '';
      if (result.category) {
        text = `You spent ₹${result.total.toLocaleString('en-IN')} on ${result.category} between ${result.start} and ${result.end}.`;
      } else {
        text = `You spent a total of ₹${result.total.toLocaleString('en-IN')} between ${result.start} and ${result.end}.`;
      }
      const tip = result.total > 0 ? 'Consider setting a category-wise cap to control overspending.' : 'Add some transactions to get insights.';
      return res.json({ answer: `${text} ${tip}` });
    }

    let context = '';
    if (userId) {
      const stats = await fetchSpendingStats(userId);
      context = `User spending this month (INR): total=${stats.total}, byCategory=${stats.byCategory.map(c=>`${c.category}:${c.amount}`).join(', ')}`;
    }

    const system = `You are Finova, a helpful personal finance AI. Be concise, show INR with ₹, and give one actionable tip.`;

    const messages = [
      { role: 'system', content: system },
      { role: 'user', content: `Question: ${question}\nContext: ${context}` },
    ];

    const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';

    const completion = await openai.chat.completions.create({
      model,
      messages,
      temperature: 0.3,
    });

    const answer = completion.choices?.[0]?.message?.content ?? 'Sorry, I could not generate an answer.';

    res.json({ answer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to process request' });
  }
});

export default router;