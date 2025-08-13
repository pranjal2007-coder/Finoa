import { motion } from 'framer-motion'

const qa = [
  { q: 'How do I sign up?', a: 'Go to Sign Up, enter your details, and you’re ready. Optional: connect a bank.' },
  { q: 'Is my data secure?', a: 'Yes. We use encryption in transit and at rest. You control your data.' },
  { q: 'How accurate is the AI?', a: 'AI gives suggestions based on your inputs and trends. Always cross‑check before investing.' },
  { q: 'How do subscriptions work?', a: 'Premium is monthly/annual and can be cancelled anytime from Settings.' },
  { q: 'Trouble syncing?', a: 'Check your internet and integration keys. Contact support if issues persist.' },
]

export default function Faq() {
  return (
    <div className="page">
      <motion.div className="card" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}}>
        <h2>FAQ</h2>
        <div style={{display:'grid', gap:8}}>
          {qa.map((i,idx) => (
            <div className="card" key={idx} style={{textAlign:'left'}}>
              <strong>{i.q}</strong>
              <p style={{margin:0}}>{i.a} For complex queries, email support@finoa.app</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}