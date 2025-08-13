import { useMemo, useState } from 'react'
import { Bar } from 'react-chartjs-2'
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js'
import { motion } from 'framer-motion'
import { useData } from '../context/DataContext'

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend)

const categories = ['Food','Transport','Bills','Shopping','Entertainment','Other']

export default function ExpenseTracker() {
  const { state, actions, selectors } = useData()
  const [form, setForm] = useState({ date: new Date().toISOString().slice(0,10), category: 'Food', name: '', cost: '' })
  const [editingId, setEditingId] = useState(null)

  function addOrUpdate(e) {
    e.preventDefault()
    if (!form.name || !form.cost) return
    if (editingId) {
      actions.updateExpense(editingId, form)
      setEditingId(null)
    } else {
      actions.addExpense(form)
    }
    setForm({ date: new Date().toISOString().slice(0,10), category: 'Food', name: '', cost: '' })
  }

  function onEdit(item) {
    setEditingId(item.id)
    setForm({ date: item.date, category: item.category, name: item.name, cost: String(item.cost) })
  }

  const total = state.expenses.reduce((s,i)=>s+i.cost,0)

  const chartData = useMemo(() => ({
    labels: ['Income','Emergency','Expenses','Available'],
    datasets: [
      { label: 'Amount (₹)', data: [state.monthlyIncome, state.emergencyFund, selectors.monthlyExpenseTotal(), selectors.availableForSavings()], backgroundColor: ['#3b82f6','#a78bfa','#ef4444','#22c55e'] }
    ]
  }), [state.monthlyIncome, state.emergencyFund, selectors])

  const byCategory = useMemo(() => {
    const map = {}
    for (const c of categories) map[c] = 0
    state.expenses.forEach(i => { map[i.category] += i.cost })
    return Object.entries(map)
  }, [state.expenses])

  return (
    <div className="page">
      <motion.div className="card" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} whileHover={{y:-2}}>
        <h2>Expense Tracker</h2>
        <form onSubmit={addOrUpdate} style={{display:'flex', gap:8, flexWrap:'wrap', alignItems:'end'}}>
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
          <button className="button" type="submit">{editingId ? 'Update' : 'Add'}</button>
        </form>

        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginTop:12}}>
          <motion.div className="card" whileHover={{y:-2}}>
            <h3>Overview</h3>
            <Bar data={chartData} options={{ plugins:{legend:{display:false}} }} />
            <p style={{marginTop:8}}>Total Expenses (all time): ₹{total.toLocaleString('en-IN')}</p>
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
            <thead><tr><th>Date</th><th>Category</th><th>Name</th><th>Cost (₹)</th><th>Actions</th></tr></thead>
            <tbody>
              {state.expenses.map((i) => (
                <tr key={i.id}>
                  <td>{i.date}</td><td>{i.category}</td><td>{i.name}</td><td>₹{i.cost.toLocaleString('en-IN')}</td>
                  <td>
                    <button className="button" onClick={()=>onEdit(i)}>Edit</button>
                    <button className="button" style={{marginLeft:6, background:'#ef4444', color:'#fff'}} onClick={()=>actions.deleteExpense(i.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </motion.div>
    </div>
  )
}