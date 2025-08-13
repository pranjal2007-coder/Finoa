import { useState } from 'react'
import { motion } from 'framer-motion'

export default function Contact() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  function submit(e) {
    e.preventDefault()
    alert('Thanks! We will get back to you.')
  }

  return (
    <div className="page">
      <motion.div className="card" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}}>
        <h2>Contact Us</h2>
        <form onSubmit={submit} style={{display:'grid', gap:8, maxWidth:520}}>
          <input placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
          <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
          <textarea placeholder="Message" value={message} onChange={e=>setMessage(e.target.value)} rows={5} />
          <button className="button" type="submit">Send</button>
        </form>
      </motion.div>
    </div>
  )
}