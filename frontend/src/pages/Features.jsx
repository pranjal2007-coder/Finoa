import { motion } from 'framer-motion'
import { FaRobot, FaWallet, FaChartPie, FaBell, FaLock, FaBullseye } from 'react-icons/fa'

const features = [
  { icon: <FaRobot />, title: 'AI Financial Insights', text: 'Personalized advice based on your spending patterns and goals.' },
  { icon: <FaBullseye />, title: 'Automated Budget Planner', text: 'Smart monthly budget suggestions tailored to your income.' },
  { icon: <FaWallet />, title: 'Expense Categorization', text: 'Auto-tag transactions for clear visibility.' },
  { icon: <FaChartPie />, title: 'Savings Forecast', text: 'See how today’s choices impact your future savings.' },
  { icon: <FaBell />, title: 'Goal Reminders', text: 'Stay on track with alerts for items you plan to buy.' },
  { icon: <FaLock />, title: 'Security', text: 'End-to-end encryption and secure data storage.' },
]

export default function Features() {
  return (
    <div className="page">
      <motion.div className="card" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}}>
        <h2>Product Features</h2>
        <div className="feature-grid">
          {features.map((f,i) => (
            <div className="card" key={i} style={{padding:14, textAlign:'left'}}>
              <div style={{fontSize:28}}>{f.icon}</div>
              <h4 style={{marginBottom:6}}>{f.title}</h4>
              <p style={{margin:0}}>{f.text}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}