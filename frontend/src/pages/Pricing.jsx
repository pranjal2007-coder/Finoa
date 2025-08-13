import { motion } from 'framer-motion'

export default function Pricing() {
  return (
    <div className="page">
      <motion.div className="card" initial={{opacity:0, y:10}} animate={{opacity:1, y:0}}>
        <h2>Pricing</h2>
        <div className="pricing-grid">
          <div className="card" style={{padding:16}}>
            <h3>Free</h3>
            <p style={{fontSize:28, margin:'6px 0'}}>₹0</p>
            <ul>
              <li>Expense tracking</li>
              <li>Basic budget planner</li>
              <li>Goal reminders</li>
            </ul>
            <button className="button">Get Started</button>
          </div>
          <div className="card" style={{padding:16, borderColor:'#2563eb'}}>
            <h3>Premium</h3>
            <p style={{fontSize:28, margin:'6px 0'}}>₹299/month</p>
            <ul>
              <li>AI insights & forecasts</li>
              <li>Advanced reports</li>
              <li>Priority support</li>
            </ul>
            <button className="button">Upgrade</button>
          </div>
        </div>
        <p style={{marginTop:8, fontSize:14}}>30‑day money‑back guarantee. Cancel anytime.</p>
      </motion.div>
    </div>
  )
}