import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Line, Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, LineElement, ArcElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend } from 'chart.js'
import { useData } from '../context/DataContext'

ChartJS.register(LineElement, ArcElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend)

export default function Home() {
  const { state, selectors } = useData()
  const [aiQuestion, setAiQuestion] = useState('Suggest a way to save ₹1000 this month')
  const [aiAnswer, setAiAnswer] = useState('')
  const [loading, setLoading] = useState(false)
  const recognitionRef = useRef(null)

  async function askAI() {
    setLoading(true)
    try {
      const top = [...selectors.byCategoryThisMonth()].sort((a,b)=>b.amount-a.amount)[0]
      const available = selectors.availableForSavings()
      const answer = top
        ? `You can save ₹${Math.min(available, 1000).toLocaleString('en-IN')} by trimming ₹${Math.ceil(top.amount*0.1)} from ${top.category}. Try reducing optional spends and track weekly.`
        : `Start logging expenses. Aim to save ₹${Math.min(selectors.availableForSavings(), 1000).toLocaleString('en-IN')} this month by cutting small recurring costs.`
      setAiAnswer(answer)
    } finally { setLoading(false) }
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
    rec.onerror = () => {}
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
    labels: selectors.byCategoryThisMonth().map(c => c.category),
    datasets: [{
      data: selectors.byCategoryThisMonth().map(c => c.amount),
      backgroundColor: ['#22c55e','#3b82f6','#f59e0b','#ef4444','#a78bfa','#06b6d4'],
      borderWidth: 0,
    }]
  }), [state.expenses])

  const lineData = useMemo(() => ({
    labels: ['Income','Expenses','Available'],
    datasets: [{
      label: 'Overview (₹)',
      data: [state.monthlyIncome, selectors.monthlyExpenseTotal(), selectors.availableForSavings()],
      borderColor: '#22c55e',
      backgroundColor: 'rgba(34,197,94,0.2)',
    }]
  }), [state.monthlyIncome, state.emergencyFund, state.expenses])

  return (
    <div className="page">
      <div className="hero">
        <motion.div className="card" initial={{opacity:0, y:10}} animate={{opacity:1, y:0}}>
          <h2>Welcome to Finova</h2>
          <p>Overview & quick finance summary. Track expenses, plan budgets, and get smart savings tips.</p>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:12}}>
            <div className="card">
              <h3>Spending by Category (This Month)</h3>
              <Doughnut data={doughnutData} />
            </div>
            <div className="card">
              <h3>Budget Overview</h3>
              <Line data={lineData} options={{ plugins:{legend:{display:false}} }} />
            </div>
          </div>
        </motion.div>
        <motion.div className="card" initial={{opacity:0, x:10}} animate={{opacity:1, x:0}}>
          <h3>AI Saving Tips</h3>
          <div style={{display:'flex', gap:8, flexWrap:'wrap'}}>
            <input value={aiQuestion} onChange={e=>setAiQuestion(e.target.value)} style={{flex:1, minWidth:240}} placeholder="Ask Finova..." />
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
    </div>
  )
}