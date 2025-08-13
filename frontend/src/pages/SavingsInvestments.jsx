import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useData } from '../context/DataContext'

export default function SavingsInvestments() {
  const { state, selectors } = useData()
  const [goalItem, setGoalItem] = useState('a new phone')
  const [horizon, setHorizon] = useState(4) // weeks

  const available = selectors.availableForSavings()

  const weeklyPlan = useMemo(() => {
    const perWeek = Math.floor(Math.max(0, available) / 4)
    return Array.from({ length: horizon }, (_, i) => ({ week: i + 1, amount: perWeek }))
  }, [available, horizon])

  const tip = useMemo(() => {
    const top = [...selectors.byCategoryThisMonth()].sort((a,b)=>b.amount-a.amount)[0]
    if (!top) return 'Log some expenses to get personalized tips.'
    return `Consider trimming ₹${Math.ceil(top.amount*0.1)} from ${top.category} to boost savings.`
  }, [selectors])

  return (
    <div className="page">
      <motion.div className="card" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}}>
        <h2>Savings & Investments</h2>
        <p>Available this month after expenses and emergency fund: <strong>₹{available.toLocaleString('en-IN')}</strong></p>
        <div style={{display:'flex', gap:8, flexWrap:'wrap'}}>
          <input value={goalItem} onChange={e=>setGoalItem(e.target.value)} placeholder="Goal item (e.g., phone)" />
          <input type="number" value={horizon} onChange={e=>setHorizon(Number(e.target.value||0))} />
        </div>
        <h3 style={{marginTop:8}}>Weekly Savings Plan</h3>
        <ul>
          {weeklyPlan.map(w => (
            <li key={w.week}>Week {w.week}: Save ₹{w.amount.toLocaleString('en-IN')}</li>
          ))}
        </ul>
        <p><em>Tip:</em> {tip}</p>
      </motion.div>
    </div>
  )
}