import { useState } from 'react'

export default function Signup() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [saved, setSaved] = useState(false)

  function submit(e) {
    e.preventDefault()
    const payload = { name, email, password, savedAt: new Date().toISOString() }
    localStorage.setItem('finova_user', JSON.stringify(payload))
    setSaved(true)
  }

  return (
    <div className="page">
      <div className="card auth-card fade-in">
        <h2>Sign Up</h2>
        <form onSubmit={submit} className="auth-form">
          <input placeholder="Full name" value={name} onChange={e=>setName(e.target.value)} required />
          <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required />
          <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
          <button className="button" type="submit">Save</button>
        </form>
        {saved && <p style={{marginTop:8}}>Saved to your browser (localStorage).</p>}
      </div>
    </div>
  )
}