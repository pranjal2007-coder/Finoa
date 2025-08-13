import { useState } from 'react'
import { motion } from 'framer-motion'

export default function ProfileSettings() {
  const [name, setName] = useState('Demo User')
  const [currency, setCurrency] = useState('INR')

  return (
    <div className="page">
      <motion.div className="card" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}}>
        <h2>Profile & Settings</h2>
        <div style={{display:'grid', gap:8, maxWidth:420}}>
          <label>Name</label>
          <input value={name} onChange={e=>setName(e.target.value)} />
          <label>Currency</label>
          <select value={currency} onChange={e=>setCurrency(e.target.value)}>
            <option value="INR">INR</option>
            <option value="USD">USD</option>
          </select>
        </div>
      </motion.div>
    </div>
  )
}