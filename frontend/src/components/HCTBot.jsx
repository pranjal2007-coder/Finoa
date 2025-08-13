import { useState } from 'react'
import { motion } from 'framer-motion'
import { api } from '../lib/api'

export default function HCTBot() {
  const [form, setForm] = useState({ income: '', expenses: '', age: '', risk: 'moderate', goal: '' })
  const [advice, setAdvice] = useState('')
  const [loading, setLoading] = useState(false)

  function setField(key, value) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  async function onSubmit(e) {
    e.preventDefault()
    setLoading(true)
    try {
      const payload = {
        userId: '00000000-0000-0000-0000-000000000001',
        income: Number(form.income || 0),
        expenses: Number(form.expenses || 0),
        age: Number(form.age || 0),
        risk: form.risk,
        goal: form.goal.trim(),
      }
      const res = await api('/hctbot', { method: 'POST', body: JSON.stringify(payload) })
      setAdvice(res.answer)
    } catch (e) {
      setAdvice('Unable to fetch advice right now.')
    } finally { setLoading(false) }
  }

  return (
    <motion.div className="card hctbot" initial={{opacity:0, y:8}} animate={{opacity:1, y:0}}>
      <h3>HCTBot – Your Smart Savings & Investment Assistant</h3>
      <form onSubmit={onSubmit} style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(180px,1fr))', gap:8, alignItems:'end'}}>
        <div>
          <label>Monthly Income (₹)</label>
          <input type="number" value={form.income} onChange={e=>setField('income', e.target.value)} placeholder="50000" required />
        </div>
        <div>
          <label>Monthly Expenses (₹)</label>
          <input type="number" value={form.expenses} onChange={e=>setField('expenses', e.target.value)} placeholder="30000" required />
        </div>
        <div>
          <label>Age</label>
          <input type="number" value={form.age} onChange={e=>setField('age', e.target.value)} placeholder="25" required />
        </div>
        <div>
          <label>Risk Tolerance</label>
          <select value={form.risk} onChange={e=>setField('risk', e.target.value)}>
            <option value="conservative">Conservative</option>
            <option value="moderate">Moderate</option>
            <option value="aggressive">Aggressive</option>
          </select>
        </div>
        <div style={{gridColumn:'1 / -1'}}>
          <label>Savings Goal</label>
          <input value={form.goal} onChange={e=>setField('goal', e.target.value)} placeholder="e.g., ₹2L emergency fund in 12 months" required />
        </div>
        <button className="button" type="submit" disabled={loading}>{loading ? 'Generating...' : 'Get Personalized Plan'}</button>
      </form>
      {advice && <div className="chat-answer" style={{marginTop:8, textAlign:'left', whiteSpace:'pre-wrap'}}>{advice}</div>}
    </motion.div>
  )
}