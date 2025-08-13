import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useData } from '../context/DataContext'

function computePlan(goal, availablePerMonth) {
  if (!goal) return []
  const now = new Date()
  const end = new Date(goal.deadline)
  const daysLeft = Math.max(1, Math.ceil((end - now) / (1000*60*60*24)))
  const remaining = Math.max(0, (goal.cost || 0) - (goal.savedSoFar || 0))
  const perDay = Math.ceil(remaining / daysLeft)
  const weeks = Math.ceil(daysLeft / 7)
  const perWeek = Math.ceil(remaining / weeks)
  return { daysLeft, remaining, perDay, weeks, perWeek, feasible: availablePerMonth >= perWeek * 4 }
}

export default function Goals() {
  const { state, actions, selectors } = useData()
  const [form, setForm] = useState({ name: '', cost: '', deadline: '', savedSoFar: '' })
  const [editingId, setEditingId] = useState(null)

  const available = selectors.availableForSavings()

  function addOrUpdate(e) {
    e.preventDefault()
    if (editingId) {
      actions.updateGoal(editingId, { ...form, cost: Number(form.cost||0), savedSoFar: Number(form.savedSoFar||0) })
      setEditingId(null)
    } else {
      actions.addGoal({ ...form })
    }
    setForm({ name: '', cost: '', deadline: '', savedSoFar: '' })
  }

  function onEdit(goal) {
    setEditingId(goal.id)
    setForm({ name: goal.name, cost: String(goal.cost), deadline: goal.deadline, savedSoFar: String(goal.savedSoFar) })
  }

  const plans = useMemo(() => state.goals.map(g => ({ goal: g, plan: computePlan(g, selectors.availableForSavings()) })), [state.goals, selectors])

  return (
    <div className="page">
      <motion.div className="card" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}}>
        <h2>Goals</h2>
        <p>Available this month after expenses and emergency fund: <strong>₹{available.toLocaleString('en-IN')}</strong></p>
        <form onSubmit={addOrUpdate} style={{display:'grid', gridTemplateColumns:'1.5fr 1fr 1fr 1fr auto', gap:8}}>
          <input placeholder="Goal name (e.g., Phone)" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} required />
          <input type="number" placeholder="Total cost (₹)" value={form.cost} onChange={e=>setForm({...form, cost:e.target.value})} required />
          <input type="date" placeholder="Deadline" value={form.deadline} onChange={e=>setForm({...form, deadline:e.target.value})} required />
          <input type="number" placeholder="Saved so far (₹)" value={form.savedSoFar} onChange={e=>setForm({...form, savedSoFar:e.target.value})} />
          <button className="button" type="submit">{editingId ? 'Update' : 'Add'}</button>
        </form>
      </motion.div>

      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginTop:12}}>
        {plans.map(({goal, plan}) => (
          <motion.div key={goal.id} className="card" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} whileHover={{y:-2}}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
              <h3>{goal.name}</h3>
              <div>
                <button className="button" onClick={()=>onEdit(goal)}>Edit</button>
                <button className="button" style={{marginLeft:6, background:'#ef4444', color:'#fff'}} onClick={()=>actions.deleteGoal(goal.id)}>Delete</button>
              </div>
            </div>
            <p>Cost: ₹{goal.cost.toLocaleString('en-IN')} • Saved: ₹{goal.savedSoFar.toLocaleString('en-IN')} • Deadline: {goal.deadline}</p>
            <p>Remaining: <strong>₹{plan.remaining.toLocaleString('en-IN')}</strong> • Days left: {plan.daysLeft}</p>
            <p>Plan: Save <strong>₹{plan.perDay.toLocaleString('en-IN')}/day</strong> or <strong>₹{plan.perWeek.toLocaleString('en-IN')}/week</strong></p>
            <p style={{color: plan.feasible ? '#22c55e' : '#ef4444'}}>{plan.feasible ? 'Feasible with current budget.' : 'Tight budget — consider cutting some expenses.'}</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}