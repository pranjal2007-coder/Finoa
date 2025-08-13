import { useMemo, useState } from 'react'
import { Bar } from 'react-chartjs-2'
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js'
import { motion } from 'framer-motion'

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend)

export default function BudgetPlanner() {
  const [period, setPeriod] = useState('monthly')
  const [budget, setBudget] = useState('')

  const chartData = useMemo(() => ({
    labels: ['Budget'],
    datasets: [
      { label: 'Budget (₹)', data: [Number(budget||0)], backgroundColor: '#3b82f6' },
      { label: 'Target Savings (₹)', data: [Number(budget||0)*0.2], backgroundColor: '#22c55e' },
    ]
  }), [budget])

  return (
    <div className="page">
      <motion.div className="card" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}}>
        <h2>Budget Planner</h2>
        <div style={{display:'flex', gap:12, alignItems:'end'}}>
          <div>
            <label>Period</label>
            <select value={period} onChange={e=>setPeriod(e.target.value)}>
              <option value="monthly">Monthly</option>
              <option value="weekly">Weekly</option>
            </select>
          </div>
          <div>
            <label>Total Budget (₹)</label>
            <input type="number" value={budget} onChange={e=>setBudget(e.target.value)} placeholder="Enter amount" />
          </div>
        </div>
        <div style={{marginTop:16}}>
          <Bar data={chartData} />
        </div>
      </motion.div>
    </div>
  )
}