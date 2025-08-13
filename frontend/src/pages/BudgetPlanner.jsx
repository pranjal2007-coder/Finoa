import { useMemo, useState } from 'react'
import { Bar } from 'react-chartjs-2'
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js'
import { motion } from 'framer-motion'
import { useData } from '../lib/data'

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend)

export default function BudgetPlanner() {
  const { categories, monthlyBudget, setMonthlyBudget, categoryBudgets, setCategoryBudget, totalExpenseThisMonth } = useData()
  const [period, setPeriod] = useState('monthly')

  const chartData = useMemo(() => ({
    labels: ['Budget','Expenses'],
    datasets: [
      { label: 'Budget (₹)', data: [Number(monthlyBudget||0)], backgroundColor: '#3b82f6' },
      { label: 'Expenses (₹)', data: [Number(totalExpenseThisMonth||0)], backgroundColor: '#ef4444' },
    ]
  }), [monthlyBudget, totalExpenseThisMonth])

  const underBudget = monthlyBudget > 0 && totalExpenseThisMonth <= monthlyBudget

  return (
    <div className="page">
      <motion.div className="card" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}}>
        <h2>Budget Planner</h2>
        <div style={{display:'flex', gap:12, alignItems:'end', flexWrap:'wrap'}}>
          <div>
            <label>Period</label>
            <select value={period} onChange={e=>setPeriod(e.target.value)}>
              <option value="monthly">Monthly</option>
              <option value="weekly">Weekly</option>
            </select>
          </div>
          <div>
            <label>Total Budget (₹)</label>
            <input type="number" value={monthlyBudget} onChange={e=>setMonthlyBudget(e.target.value)} placeholder="Enter amount" />
          </div>
        </div>

        {underBudget && (
          <div className="card" style={{marginTop:12, borderColor:'#14532d'}}>
            🎉 Congratulations! Your spending (₹{totalExpenseThisMonth.toLocaleString('en-IN')}) is within the budget (₹{Number(monthlyBudget||0).toLocaleString('en-IN')}). Keep it up!
          </div>
        )}

        <div style={{marginTop:16}}>
          <Bar data={chartData} options={{ plugins:{legend:{display:false}} }} />
        </div>

        <div className="card" style={{marginTop:12}}>
          <h3>Per-Category Budgets</h3>
          <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(220px, 1fr))', gap:8}}>
            {categories.map(c => (
              <div key={c} className="card" style={{padding:10}}>
                <label>{c} (₹)</label>
                <input type="number" value={categoryBudgets[c] || 0} onChange={e=>setCategoryBudget(c, e.target.value)} />
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  )
}