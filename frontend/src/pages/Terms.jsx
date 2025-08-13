import { motion } from 'framer-motion'

export default function Terms() {
  return (
    <div className="page">
      <motion.div className="card" initial={{opacity:0, y:10}} animate={{opacity:1, y:0}}>
        <h2>Terms & Conditions</h2>
        <h3>Use of Service</h3>
        <p>By using Finoa, you agree to follow applicable laws and not abuse the platform.</p>
        <h3>Subscriptions & Refunds</h3>
        <p>Premium renews monthly/annually. You may cancel anytime. 30‑day money‑back guarantee for first‑time purchases.</p>
        <h3>Responsibilities</h3>
        <p>Investing involves risk. Always research before investing. Finoa provides guidance, not financial advice.</p>
      </motion.div>
    </div>
  )
}