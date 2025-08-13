import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useData } from '../context/DataContext'

export default function EmergencyFund() {
  const { state, actions } = useData()
  const [income, setIncome] = useState(state.monthlyIncome || '')
  const [monthlyExpenses, setMonthlyExpenses] = useState('')
  const months = 6
  const required = useMemo(() => Number(monthlyExpenses||0) * months, [monthlyExpenses])
  const monthlySavingNeeded = useMemo(() => Math.max(0, required - Number(income||0)*0.2), [required, income])

  return (
    <div className="page">
      <motion.div className="card" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}}>
        <h2>Emergency Fund Planner</h2>
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:12}}>
          <div>
            <label>Monthly Income (₹)</label>
            <input type="number" value={income} onChange={e=>{ setIncome(e.target.value); actions.setMonthlyIncome(e.target.value) }} />
          </div>
          <div>
            <label>Monthly Expenses (₹)</label>
            <input type="number" value={monthlyExpenses} onChange={e=>setMonthlyExpenses(e.target.value)} />
          </div>
          <div>
            <label>Reserve Emergency Fund (₹)</label>
            <input type="number" value={state.emergencyFund} onChange={e=>actions.setEmergencyFund(e.target.value)} />
          </div>
        </div>
        <p style={{marginTop:8}}>Recommended emergency fund for {months} months: <strong>₹{required.toLocaleString('en-IN')}</strong></p>
        <p>Save around <strong>₹{monthlySavingNeeded.toLocaleString('en-IN')}</strong> this month to reach this faster.</p>
      </motion.div>
    </div>
  )
}