import { motion } from 'framer-motion'

export default function About() {
  return (
    <div className="page">
      <motion.div className="card" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}}>
        <h2>About Us</h2>
        <p>Finova's mission is to empower everyone to make smarter money decisions with delightful tools and actionable insights.</p>
      </motion.div>
    </div>
  )
}