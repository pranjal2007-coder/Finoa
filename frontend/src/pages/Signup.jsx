import { useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'

export default function Signup() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  function submit(e) {
    e.preventDefault()
    toast.success('Demo: Sign Up submitted (no backend call).')
  }

  return (
    <div className="page">
      <motion.div className="card" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}}>
        <h2>Sign Up</h2>
        <form onSubmit={submit} style={{display:'grid', gap:8, maxWidth:420}}>
          <input placeholder="Full name" value={name} onChange={e=>setName(e.target.value)} />
          <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
          <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
          <button className="button" type="submit">Create Account</button>
        </form>
      </motion.div>
    </div>
  )
}