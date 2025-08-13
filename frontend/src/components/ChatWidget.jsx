import { useMemo, useState } from 'react'
import { useData } from '../context/DataContext'

export default function ChatWidget() {
  const { selectors } = useData()
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('Give me a saving tip')
  const [messages, setMessages] = useState([{ role: 'bot', text: 'Hi! Ask for saving tips.' }])

  const quickTip = useMemo(() => {
    const top = [...selectors.byCategoryThisMonth()].sort((a,b)=>b.amount-a.amount)[0]
    if (!top) return 'Log expenses to unlock personalized tips.'
    return `Try cutting 10% in ${top.category} to save ₹${Math.ceil(top.amount*0.1)} this month.`
  }, [selectors])

  function send() {
    const txt = input.trim()
    if (!txt) return
    setMessages(m => [...m, { role: 'user', text: txt }])
    const reply = quickTip
    setMessages(m => [...m, { role: 'bot', text: reply }])
    setInput('')
  }

  return (
    <div>
      <button aria-label="chat" onClick={()=>setOpen(o=>!o)} style={{position:'fixed', right:16, bottom:16, background:'#2563eb', color:'#fff', padding:'10px 14px', borderRadius:999, border:'none', cursor:'pointer', boxShadow:'0 6px 20px rgba(37,99,235,0.5)'}}>Chat</button>
      {open && (
        <div style={{position:'fixed', right:16, bottom:72, width:320, background:'#0b1220', border:'1px solid #1f2a44', borderRadius:12, padding:12}}>
          <div style={{maxHeight:260, overflow:'auto', display:'grid', gap:6}}>
            {messages.map((m, idx) => (
              <div key={idx} style={{justifySelf: m.role==='user'?'end':'start', background:m.role==='user'?'#1e293b':'#0f172a', color:'#e2e8f0', padding:'8px 10px', borderRadius:8}}>{m.text}</div>
            ))}
          </div>
          <div style={{display:'flex', gap:6, marginTop:8}}>
            <input value={input} onChange={e=>setInput(e.target.value)} placeholder="Ask..." style={{flex:1}} />
            <button className="button" onClick={send}>Send</button>
          </div>
        </div>
      )}
    </div>
  )
}