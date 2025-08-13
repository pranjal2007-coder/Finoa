import { motion } from 'framer-motion'

export default function About() {
  return (
    <div className="page">
      <motion.div className="card" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}}>
        <h2>About Finova</h2>
        <p>Finova is created by a passionate team of CSE 2nd-year students from India. Our mission is to simplify money management with delightful design and actionable insights.</p>
        <h3>What we believe</h3>
        <ul>
          <li>Clarity and control over your finances</li>
          <li>Privacy-first, user-owned data</li>
          <li>Insights that turn into real savings</li>
        </ul>
        <h3>What Finova offers</h3>
        <ul>
          <li>Unified dashboard for budget, expenses, goals, and reports</li>
          <li>AI-based saving tips tailored to your spending</li>
          <li>Beautiful, responsive UI with charts and animations</li>
        </ul>
        <p>Thank you for trusting Finova to guide your financial journey.</p>
      </motion.div>
    </div>
  )
}