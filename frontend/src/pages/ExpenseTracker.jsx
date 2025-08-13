import { useMemo, useState } from 'react'
import { Bar } from 'react-chartjs-2'
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js'
import { motion } from 'framer-motion'
import { api } from '../lib/api'
import { useData } from '../lib/data'

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend)

const categories = ['Food','Transport','Bills','Shopping','Entertainment','Other']

export default function ExpenseTracker() {
  const { expenses, addExpense, editExpense, removeExpense } = useData()
  const [form, setForm] = useState({ date: new Date().toISOString().slice(0,10), category: 'Food', name: '', cost: '' })
  const [busy, setBusy] = useState(false)

  function addItem(e) {
    e.preventDefault()
    if (!form.name || !form.cost) return
    addExpense({ ...form })
    setForm({ date: new Date().toISOString().slice(0,10), category: 'Food', name: '', cost: '' })
  }

  async function saveToBackend() {
    try {
      setBusy(true)
      const userId = '00000000-0000-0000-0000-000000000001'
      for (const it of expenses) {
        await api('/transactions', { method: 'POST', body: JSON.stringify({ userId, date: it.date, category: it.category, description: it.name, amount: it.cost }) })
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
      // naive merge, add new items
      (res.transactions||[]).forEach(t => {
        addExpense({ date: t.date?.slice(0,10), category: t.category, name: t.description || 'Expense', cost: t.amount })
      })
    } catch (e) {
      alert('Failed to load from backend. Is the API running?')
    } finally { setBusy(false) }
  }

  const total = expenses.reduce((s,i)=>s+Number(i.cost||0),0)

  const chartData = useMemo(() => ({
    labels: Array.from(new Set(expenses.map(e=>e.category || 'Other'))),
    datasets: [
      { label: 'Amount (₹)', data: Array.from(new Set(expenses.map(e=>e.category || 'Other'))).map(c => expenses.filter(e=>e.category===c).reduce((s,e)=>s+Number(e.cost||0),0)), backgroundColor: '#3b82f6' }
    ]
  }), [expenses])

  const byCategory = useMemo(() => {
    const map = {}
    for (const c of categories) map[c] = 0
    expenses.forEach(i => { map[i.category] = (map[i.category]||0) + Number(i.cost||0) })
    return Object.entries(map)
  }, [expenses])

  return (
    <div className="page">
      <motion.div className="card" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} whileHover={{y:-2}}>
        <h2>Expense Tracker</h2>
        <form onSubmit={addItem} style={{display:'flex', gap:8, flexWrap:'wrap', alignItems:'end'}}>
          <div>
            <label>Date</label>
            <input type="date" value={form.date} onChange={e=>setForm({...form, date:e.target.value})} />
          </div>
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
          <div style={{display:'flex', gap:8}}>
            <button className="button" onClick={saveToBackend} disabled={busy} type="button">Save to backend (demo)</button>
            <button className="button" onClick={loadFromBackend} disabled={busy} type="button">Load from backend</button>
          </div>
        </form>

        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginTop:12}}>
          <motion.div className="card" whileHover={{y:-2}}>
            <h3>Spending by Category</h3>
            <Bar data={chartData} options={{ plugins:{legend:{display:false}} }} />
            <p style={{marginTop:8}}>Total: ₹{total.toLocaleString('en-IN')}</p>
          </motion.div>
          <motion.div className="card" whileHover={{y:-2}}>
            <h3>By Category (Table)</h3>
            <table>
              <thead><tr><th>Category</th><th>Amount (₹)</th></tr></thead>
              <tbody>
                {byCategory.map(([c,amt]) => (
                  <tr key={c}><td>{c}</td><td>₹{Number(amt||0).toLocaleString('en-IN')}</td></tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </div>

        <motion.div className="card" style={{marginTop:12}} whileHover={{y:-2}}>
          <h3>All Expenses</h3>
          <table>
            <thead><tr><th>Date</th><th>Category</th><th>Name</th><th>Cost (₹)</th><th>Actions</th></tr></thead>
            <tbody>
              {expenses.map((i) => (
                <tr key={i.id}>
                  <td><input type="date" value={i.date} onChange={e=>editExpense(i.id,{date:e.target.value})} /></td>
                  <td>
                    <select value={i.category} onChange={e=>editExpense(i.id,{category:e.target.value})}>
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </td>
                  <td><input value={i.name} onChange={e=>editExpense(i.id,{name:e.target.value})} /></td>
                  <td><input type="number" value={i.cost} onChange={e=>editExpense(i.id,{cost:Number(e.target.value||0)})} /></td>
                  <td><button className="button" onClick={()=>removeExpense(i.id)} type="button">Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </motion.div>
    </div>
  )
}