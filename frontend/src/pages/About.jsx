import { motion } from 'framer-motion'

export default function About() {
  return (
    <div className="page">
      <motion.div className="card" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}}>
        <h2>About Us</h2>
        <p><strong>Mission:</strong> Help everyone save money effectively and invest wisely with delightful, secure tools.</p>
        <p><strong>Vision:</strong> Financial freedom for every household in India.</p>
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginTop:12}}>
          <div className="card">
            <h3>Our Story</h3>
            <p>We noticed people struggle with scattered tools and confusing advice. Finoa brings AI guidance, budgeting, and investments into one simple app.</p>
          </div>
          <div className="card">
            <h3>Team</h3>
            <p>Pranjal Kwatra – Team Lead & Developer</p>
            <p>Sheetal Sharma – UI/UX Designer</p>
            <p>Prachi – Frontend Developer</p>
            <p>Ravleen Kaur – Backend Developer</p>
            <p>Raman Kaur – Quality Assurance & Testing</p>
          </div>
          <div className="card">
            <h3>What We Believe</h3>
            <p>Transparency, privacy, and simplicity. Your money should be easy to understand and manage.</p>
          </div>
          <div className="card">
            <h3>Contact</h3>
            <p>Email: hello@finoa.app • Phone: +91-99999-99999</p>
            <p>Support hours: Mon–Fri, 9am–6pm IST</p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}