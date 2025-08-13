import { motion } from 'framer-motion'

export default function About() {
  return (
    <div className="page">
      <motion.div className="card" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}}>
        <h2>About Us</h2>
        <p>Finoa's mission is to empower everyone to make smarter money decisions with delightful tools and actionable insights.</p>
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginTop:12}}>
          <div className="card">
            <h3>Our Story</h3>
            <p>Founded in India, we are building an all-in-one financial dashboard for budgeting, tracking, and saving.</p>
          </div>
          <div className="card">
            <h3>What We Believe</h3>
            <p>Transparency, privacy, and simplicity. Your money should be easy to understand and manage.</p>
          </div>
          <div className="card">
            <h3>Our Approach</h3>
            <p>Real-time insights, AI guidance, and practical tools that meet you where you are in your financial journey.</p>
          </div>
          <div className="card">
            <h3>Contact</h3>
            <p>India • 9999999999</p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}