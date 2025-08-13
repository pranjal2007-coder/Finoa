import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { api } from '../lib/api'

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [question, setQuestion] = useState('Give me a quick savings tip for India')
  const [answer, setAnswer] = useState('')
  const [loading, setLoading] = useState(false)

  async function ask(e) {
    e?.preventDefault()
    setLoading(true)
    try {
      const userId = '00000000-0000-0000-0000-000000000001'
      const res = await api('/ask', { method: 'POST', body: JSON.stringify({ userId, question }) })
      setAnswer(res.answer)
    } catch (e) {
      setAnswer('AI is currently unavailable. Please try again later.')
    } finally { setLoading(false) }
  }

  return (
    <div className="chat-widget">
      <button className="chat-fab" onClick={()=>setOpen(v=>!v)}>{open ? '×' : 'Chat'}</button>
      <AnimatePresence>
        {open && (
          <motion.div className="chat-panel" initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} exit={{opacity:0, y:10}}>
            <h4>Finoa Assistant</h4>
            <form onSubmit={ask} style={{display:'grid', gap:8}}>
              <textarea rows={3} value={question} onChange={e=>setQuestion(e.target.value)} placeholder="Ask Finoa..." />
              <button className="button" type="submit" disabled={loading}>{loading ? 'Thinking...' : 'Ask'}</button>
            </form>
            {answer && <div className="chat-answer">{answer}</div>}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}