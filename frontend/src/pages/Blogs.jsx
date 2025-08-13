import { motion } from 'framer-motion'

const categories = ['Beginner Finance Tips','Investment Insights','AI & Technology in Money Management','Case Studies / Success Stories']

export default function Blogs() {
  return (
    <div className="page">
      <motion.div className="card" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}}>
        <h2>Blogs</h2>
        <div className="feature-grid">
          {categories.map((c,i) => (
            <div className="card" key={i} style={{textAlign:'left', padding:12}}>
              <img src={`https://picsum.photos/seed/${i}/600/300`} alt="cover" style={{width:'100%', borderRadius:8, marginBottom:8}}/>
              <h4 style={{marginBottom:6}}>{c}</h4>
              <p>Explore articles like “Save your first ₹1L fast”, “SIP vs FD”, and more.</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}