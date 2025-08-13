import { useMemo, useState } from 'react'
import { Bar } from 'react-chartjs-2'
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js'
import { motion } from 'framer-motion'
import { useData } from '../context/DataContext'

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend)

export default function BudgetPlanner() {
  const { state, actions, selectors } = useData()
  const [period, setPeriod] = useState('monthly')
  const [budget, setBudget] = useState(state.monthlyIncome || '')

  const chartData = useMemo(() => ({
    labels: ['Budget','Emergency Reserve','Expenses (This Month)','Available'],
    datasets: [
      { label: 'Amount (₹)', data: [Number(budget||0), state.emergencyFund, selectors.monthlyExpenseTotal(), Math.max(0, Number(budget||0) - state.emergencyFund - selectors.monthlyExpenseTotal())], backgroundColor: ['#3b82f6','#a78bfa','#ef4444','#22c55e'] },
    ]
  }), [budget, state.emergencyFund, selectors])

  function saveBudget() {
    actions.setMonthlyIncome(budget)
  }

  function saveEmergency(amount) {
    actions.setEmergencyFund(amount)
  }

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
            <label>Total Monthly Income (₹)</label>
            <input type="number" value={budget} onChange={e=>setBudget(e.target.value)} placeholder="Enter amount" />
          </div>
          <button className="button" onClick={saveBudget}>Save Budget</button>
          <div>
            <label>Emergency Fund (₹)</label>
            <input type="number" value={state.emergencyFund} onChange={e=>saveEmergency(e.target.value)} placeholder="0" />
          </div>
        </div>
        <div style={{marginTop:16}}>
          <Bar data={chartData} options={{ plugins:{legend:{display:false}} }} />
        </div>
      </motion.div>
    </div>
  )
}