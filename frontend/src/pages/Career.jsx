import { motion } from 'framer-motion'

export default function Career() {
  return (
    <div className="page">
      <motion.div className="card" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}}>
        <h2>Career at Finoa</h2>
        <p>We are a remote‑first team building tools for financial freedom. We value ownership, kindness, and craftsmanship.</p>
        <div className="card" style={{marginTop:12}}>
          <h3>Open Roles</h3>
          <ul>
            <li><strong>Full‑stack Developer</strong> – React, Node.js, SQL. Build features end‑to‑end.</li>
            <li><strong>Data/AI Engineer</strong> – LLM apps, prompt design, vector search.</li>
            <li><strong>Product Designer</strong> – Design lovable, accessible experiences.</li>
          </ul>
          <p>Benefits: remote work, flexible hours, learning budget, and meaningful ownership.</p>
          <p>Apply: send your resume/portfolio to careers@finoa.app</p>
        </div>
      </motion.div>
    </div>
  )
}