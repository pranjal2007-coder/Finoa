import { useMemo, useState } from 'react'
import { Bar } from 'react-chartjs-2'
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js'
import { motion } from 'framer-motion'
import { api } from '../lib/api'

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend)

const categories = ['Food','Transport','Bills','Shopping','Entertainment','Other']

export default function ExpenseTracker() {
  const [budget, setBudget] = useState('')
  const [form, setForm] = useState({ category: 'Food', name: '', cost: '' })
  const [items, setItems] = useState([])
  const [busy, setBusy] = useState(false)

  function addItem(e) {
    e.preventDefault()
    if (!form.name || !form.cost) return
    setItems(prev => [...prev, { ...form, cost: Number(form.cost) }])
    setForm({ category: 'Food', name: '', cost: '' })
  }

  async function saveToBackend() {
    try {
      setBusy(true)
      const userId = '00000000-0000-0000-0000-000000000001'
      const today = new Date().toISOString().slice(0,10)
      for (const it of items) {
        await api('/transactions', { method: 'POST', body: JSON.stringify({ userId, date: today, category: it.category, description: it.name, amount: it.cost }) })
      }
      alert('Saved to backend for demo user.')
    } catch (e) {
      alert('Failed to save to backend. Is the API running?')
    } finally { setBusy(false) }
  }

  async function loadFromBackend() {
    try {
      setBusy(true)
      const userId = '00000000-0000-0000-0000-000000000001'
      const res = await api(`/transactions?userId=${userId}`)
      const mapped = res.transactions.map(t => ({ category: t.category, name: t.description || 'Expense', cost: t.amount }))
      setItems(mapped)
    } catch (e) {
      alert('Failed to load from backend. Is the API running?')
    } finally { setBusy(false) }
  }

  const total = items.reduce((s,i)=>s+i.cost,0)

  const chartData = useMemo(() => ({
    labels: ['Budget','Expenses'],
    datasets: [
      { label: 'Amount (₹)', data: [Number(budget||0), total], backgroundColor: ['#3b82f6','#ef4444'] }
    ]
  }), [budget, total])

  const byCategory = useMemo(() => {
    const map = {}
    for (const c of categories) map[c] = 0
    items.forEach(i => { map[i.category] += i.cost })
    return Object.entries(map)
  }, [items])

  return (
    <div className="page">
      <motion.div className="card" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} whileHover={{y:-2}}>
        <h2>Expense Tracker</h2>
        <div style={{display:'flex', gap:12, alignItems:'end', flexWrap:'wrap'}}>
          <div>
            <label>Budget (₹)</label>
            <input type="number" value={budget} onChange={e=>setBudget(e.target.value)} placeholder="Enter budget" />
          </div>
          <form onSubmit={addItem} style={{display:'flex', gap:8, flexWrap:'wrap'}}>
            <div>
              <label>Category</label>
              <select value={form.category} onChange={e=>setForm({...form, category:e.target.value})}>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label>Name</label>
              <input value={form.name} onChange={e=>setForm({...form, name:e.target.value})} placeholder="Expense name" />
            </div>
            <div>
              <label>Cost (₹)</label>
              <input type="number" value={form.cost} onChange={e=>setForm({...form, cost:e.target.value})} placeholder="0" />
            </div>
            <button className="button" type="submit">Add</button>
          </form>
          <div style={{display:'flex', gap:8}}>
            <button className="button" onClick={saveToBackend} disabled={busy}>Save to backend (demo)</button>
            <button className="button" onClick={loadFromBackend} disabled={busy}>Load from backend</button>
          </div>
        </div>

        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginTop:12}}>
          <motion.div className="card" whileHover={{y:-2}}>
            <h3>Expenses vs Budget</h3>
            <Bar data={chartData} options={{ plugins:{legend:{display:false}} }} />
            <p style={{marginTop:8}}>Total: ₹{total.toLocaleString('en-IN')}</p>
          </motion.div>
          <motion.div className="card" whileHover={{y:-2}}>
            <h3>Spending by Category</h3>
            <table>
              <thead><tr><th>Category</th><th>Amount (₹)</th></tr></thead>
              <tbody>
                {byCategory.map(([c,amt]) => (
                  <tr key={c}><td>{c}</td><td>₹{amt.toLocaleString('en-IN')}</td></tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </div>

        <motion.div className="card" style={{marginTop:12}} whileHover={{y:-2}}>
          <h3>All Expenses</h3>
          <table>
            <thead><tr><th>Category</th><th>Name</th><th>Cost (₹)</th></tr></thead>
            <tbody>
              {items.map((i,idx) => (
                <tr key={idx}><td>{i.category}</td><td>{i.name}</td><td>₹{i.cost.toLocaleString('en-IN')}</td></tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </motion.div>
    </div>
  )
}