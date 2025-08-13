import { useState } from 'react'
import { motion } from 'framer-motion'
import { api } from '../lib/api'

export default function SavingsInvestments() {
  const [profile, setProfile] = useState({ goal: '', horizon: '2', risk: 'moderate' })
  const [advice, setAdvice] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(e) {
    e.preventDefault()
    setLoading(true)
    try {
      const userId = '00000000-0000-0000-0000-000000000001'
      const q = `Suggest investments in India for goal: ${profile.goal}, years: ${profile.horizon}, risk: ${profile.risk}`
      const res = await api('/ask', { method:'POST', body: JSON.stringify({ userId, question: q }) })
      setAdvice(res.answer)
    } catch (e) {
      setAdvice('Unable to fetch suggestions right now.')
    } finally { setLoading(false) }
  }

  return (
    <div className="page">
      <motion.div className="card" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}}>
        <h2>Savings & Investments</h2>
        <form onSubmit={submit} style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr auto', gap:8}}>
          <input placeholder="Your goal (e.g., car, house)" value={profile.goal} onChange={e=>setProfile({...profile, goal:e.target.value})} />
          <input type="number" placeholder="Horizon (years)" value={profile.horizon} onChange={e=>setProfile({...profile, horizon:e.target.value})} />
          <select value={profile.risk} onChange={e=>setProfile({...profile, risk:e.target.value})}>
            <option value="conservative">Conservative</option>
            <option value="moderate">Moderate</option>
            <option value="aggressive">Aggressive</option>
          </select>
          <button className="button" type="submit" disabled={loading}>{loading ? 'Getting tips...' : 'Get Tips'}</button>
        </form>
        {advice && <p style={{marginTop:8}}>{advice}</p>}
      </motion.div>
    </div>
  )
}