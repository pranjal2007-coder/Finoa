import { Router } from 'express';
import { z } from 'zod';
import OpenAI from 'openai';

const router = Router();
const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

const payloadSchema = z.object({
  userId: z.string().uuid().optional(),
  income: z.number().nonnegative(),
  expenses: z.number().nonnegative(),
  age: z.number().int().positive(),
  risk: z.enum(['conservative', 'moderate', 'aggressive']),
  goal: z.string().min(1),
});

router.post('/', async (req, res) => {
  try {
    const parse = payloadSchema.safeParse(req.body);
    if (!parse.success) {
      return res.status(400).json({ error: 'Invalid payload', details: parse.error.flatten() });
    }
    const { income, expenses, age, risk, goal } = parse.data;

    if (!openai) {
      const surplus = Math.max(0, income - expenses);
      const needs = Math.round(income * 0.5);
      const wants = Math.round(income * 0.3);
      const save = Math.round(income * 0.2);
      const text = [
        `Snapshot: Income ₹${income.toLocaleString('en-IN')}, Expenses ₹${expenses.toLocaleString('en-IN')}, Potential Savings ₹${surplus.toLocaleString('en-IN')}.`,
        `Monthly Budget Plan: 50/30/20 → Needs ₹${needs.toLocaleString('en-IN')}, Wants ₹${wants.toLocaleString('en-IN')}, Savings/Investing ₹${save.toLocaleString('en-IN')}.`,
        `Short‑term: Bank RD/FD (6–12m), Liquid fund for emergency, UPI/auto‑sweep for idle cash.`,
        `Long‑term (${risk}): Start SIP towards ${goal}. Consider index funds, gold (SGB) allocation 5–10%.`,
        `Start today: 1) Auto‑transfer ₹${Math.round(save/4).toLocaleString('en-IN')} weekly to savings, 2) Set category caps, 3) Unsubscribe one unused service.`,
        '"Small steps today become big wealth tomorrow."',
      ].join('\n- ')
      return res.json({ answer: `- ${text}` });
    }

    const system = [
      'You are HCTBot – Smart Savings & Investment Assistant for India.',
      'Always use INR with the ₹ symbol and short, clear bullet points.',
      'Deliver in this structure:',
      '- Snapshot: income, expenses, savings capacity.',
      '- Monthly Budget Plan: recommended percent and rupee split (needs, wants, savings/investing; plus per-category suggestions).',
      '- Short-term Saving Methods: safe places for 3-18 months (RDs/FDs/Liquid funds).',
      '- Long-term Investment Options: SIPs/mutual funds/stocks/gold based on risk tolerance.',
      '- 3-5 Immediate Tips: concrete actions starting today.',
      "- End with a one-line motivational savings quote in quotes.",
      'Keep it friendly and actionable. Do not ask follow-up questions.',
    ].join(' ');

    const user = `Inputs -> income: ₹${income}, expenses: ₹${expenses}, age: ${age}, risk: ${risk}, goal: ${goal}. Create personalized guidance as per the structure. Assume standard Indian context. If expenses exceed income, include a quick course-correction plan.`;

    const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';
    const completion = await openai.chat.completions.create({
      model,
      temperature: 0.3,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
    });

    const answer = completion.choices?.[0]?.message?.content || 'Sorry, I could not generate advice right now.';
    res.json({ answer });
  } catch (error) {
    console.error(error);
    const { income = 0, expenses = 0 } = req.body || {};
    const surplus = Math.max(0, income - expenses);
    return res.status(200).json({
      answer: `- Snapshot: Income ₹${income}, Expenses ₹${expenses}, Potential Savings ₹${surplus}.\n- Monthly Budget Plan: 50/30/20 split.\n- Short‑term: RD/FD, Liquid fund.\n- Long‑term: Start SIPs towards your goal.\n- Tips: Automate savings; track expenses weekly; avoid EMI on wants.\n"Every rupee saved is a rupee earned."`,
    });
  }
});

export default router;