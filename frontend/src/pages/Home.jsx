import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Line, Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, LineElement, ArcElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend } from 'chart.js'
import { api } from '../lib/api'
import { useData } from '../lib/data'

ChartJS.register(LineElement, ArcElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend)

export default function Home() {
  const { monthlyBudget, totalExpenseThisMonth, totalByCategoryThisMonth, addWant } = useData()
  const [aiQuestion, setAiQuestion] = useState('Suggest a way to save ₹1000 this month')
  const [aiAnswer, setAiAnswer] = useState('')
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState({ total: 0, byCategory: [] })
  const recognitionRef = useRef(null)
  const [want, setWant] = useState({ title: '', dueDate: '' })

  useEffect(() => {
    // anonymous demo user id (frontend only demo)
    const demoUserId = '00000000-0000-0000-0000-000000000001'
    api(`/summary?userId=${demoUserId}`).then(setPreview).catch(() => {})
  }, [])

  async function askAI() {
    try {
      setLoading(true)
      const demoUserId = '00000000-0000-0000-0000-000000000001'
      const res = await api('/ask', { method: 'POST', body: JSON.stringify({ userId: demoUserId, question: aiQuestion }) })
      setAiAnswer(res.answer)
    } catch (e) {
      setAiAnswer('AI is currently unavailable. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  function startVoice() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) return alert('Speech recognition not supported in this browser.')
    const rec = new SpeechRecognition()
    rec.lang = 'en-IN'
    rec.onresult = (e) => {
      const text = Array.from(e.results).map(r => r[0].transcript).join(' ')
      setAiQuestion(text)
    }
    rec.onerror = () => { /* ignore */ }
    rec.onend = () => { recognitionRef.current = null }
    recognitionRef.current = rec
    rec.start()
  }

  function speakAnswer() {
    if (!aiAnswer) return
    const utter = new SpeechSynthesisUtterance(aiAnswer)
    utter.lang = 'en-IN'
    window.speechSynthesis.speak(utter)
  }

  const doughnutData = useMemo(() => ({
    labels: preview.byCategory.map(c => c.category),
    datasets: [{
      data: preview.byCategory.map(c => c.amount),
      backgroundColor: ['#22c55e','#3b82f6','#f59e0b','#ef4444','#a78bfa','#06b6d4'],
      borderWidth: 0,
    }]
  }), [preview])

  const lineData = useMemo(() => ({
    labels: ['Week 1','Week 2','Week 3','Week 4'],
    datasets: [{
      label: 'Savings (₹)',
      data: [2000, 3500, 4200, 5000],
      borderColor: '#22c55e',
      backgroundColor: 'rgba(34,197,94,0.2)',
    }]
  }), [])

  const spentVsBudget = useMemo(() => ({
    labels: ['Budget','Spent'],
    datasets: [{ data: [Number(monthlyBudget||0), Number(totalExpenseThisMonth||0)], backgroundColor:['#3b82f6','#ef4444'] }]
  }), [monthlyBudget, totalExpenseThisMonth])

  function addQuickReminder(e) {
    e.preventDefault()
    if (!want.title || !want.dueDate) return
    addWant(want)
    setWant({ title: '', dueDate: '' })
  }

  return (
    <div className="page">
      <div className="hero">
        <motion.div className="card" initial={{opacity:0, y:10}} animate={{opacity:1, y:0}}>
          <h2>Welcome to Finoa</h2>
          <p>Overview & quick finance summary. Track expenses, plan budgets, and get smart savings tips.</p>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:12}}>
            <div className="card">
              <h3>Spending by Category</h3>
              <Doughnut data={doughnutData} />
            </div>
            <div className="card">
              <h3>Savings Trend</h3>
              <Line data={lineData} options={{ plugins:{legend:{display:false}} }} />
            </div>
          </div>
        </motion.div>
        <motion.div className="card" initial={{opacity:0, x:10}} animate={{opacity:1, x:0}}>
          <h3>AI Saving Tips</h3>
          <div style={{display:'flex', gap:8, flexWrap:'wrap'}}>
            <input value={aiQuestion} onChange={e=>setAiQuestion(e.target.value)} style={{flex:1, minWidth:240}} placeholder="Ask Finoa..." />
            <button className="button" onClick={askAI} disabled={loading}>{loading? 'Thinking...' : 'Ask'}</button>
            <button className="button" onClick={startVoice} type="button">🎤 Voice</button>
            <button className="button" onClick={speakAnswer} type="button">🔊 Speak</button>
          </div>
          {aiAnswer && <p style={{marginTop:8}}>{aiAnswer}</p>}
          <div className="carousel" style={{marginTop:12}}>
            <img src="https://images.unsplash.com/photo-1553729459-efe14ef6055d?q=80&w=600&auto=format&fit=crop"/>
            <img src="https://images.unsplash.com/photo-1554224155-1696413565d3?q=80&w=600&auto=format&fit=crop"/>
            <img src="https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?q=80&w=600&auto=format&fit=crop"/>
          </div>
        </motion.div>
      </div>

      <motion.div className="card" initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} style={{marginTop:12}}>
        <h3>Budget Overview</h3>
        <p>Monthly Budget: ₹{Number(monthlyBudget||0).toLocaleString('en-IN')} • Spent this month: ₹{Number(totalExpenseThisMonth||0).toLocaleString('en-IN')}</p>
        <div style={{display:'flex', gap:8, flexWrap:'wrap', marginTop:8}}>
          {Object.entries(totalByCategoryThisMonth).map(([c,amt]) => (
            <div key={c} className="card" style={{padding:8}}>
              <strong>{c}</strong>
              <div>₹{Number(amt||0).toLocaleString('en-IN')}</div>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div className="card" initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} style={{marginTop:12}}>
        <h3>Quick Reminder</h3>
        <form onSubmit={addQuickReminder} style={{display:'flex', gap:8, flexWrap:'wrap'}}>
          <input placeholder="Thing to buy" value={want.title} onChange={e=>setWant({...want, title:e.target.value})} />
          <input type="date" value={want.dueDate} onChange={e=>setWant({...want, dueDate:e.target.value})} />
          <button className="button" type="submit">Add Reminder</button>
        </form>
      </motion.div>
    </div>
  )
}