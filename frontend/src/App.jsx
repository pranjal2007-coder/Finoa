import { Routes, Route, NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import { FaPiggyBank, FaChartPie, FaUserCircle, FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from 'react-icons/fa'
import Home from './pages/Home'
import BudgetPlanner from './pages/BudgetPlanner'
import ExpenseTracker from './pages/ExpenseTracker'
import SavingsInvestments from './pages/SavingsInvestments'
import EmergencyFund from './pages/EmergencyFund'
import ReportsInsights from './pages/ReportsInsights'
import Login from './pages/Login'
import Signup from './pages/Signup'
import ProfileSettings from './pages/ProfileSettings'
import About from './pages/About'
import Contact from './pages/Contact'
import Features from './pages/Features'
import Pricing from './pages/Pricing'
import Career from './pages/Career'
import Integration from './pages/Integration'
import Faq from './pages/Faq'
import Blogs from './pages/Blogs'
import Privacy from './pages/Privacy'
import Terms from './pages/Terms'
import './App.css'
import { DataProvider } from './lib/data'
import ChatWidget from './components/ChatWidget'

function NavBar() {
  const links = [
    { to: '/', label: 'Home' },
    { to: '/budget', label: 'Budget Planner' },
    { to: '/expenses', label: 'Expense Tracker' },
    { to: '/savings', label: 'Savings & Investments' },
    { to: '/emergency', label: 'Emergency Fund' },
    { to: '/reports', label: 'Reports & Insights' },
    { to: '/login', label: 'Sign In' },
    { to: '/signup', label: 'Sign Up' },
    { to: '/profile', label: 'Profile & Settings' },
    { to: '/about', label: 'About Us' },
    { to: '/contact', label: 'Contact Us' },
  ]
  return (
    <nav className="navbar">
      <div className="brand"><img src="/finoa-logo.svg" alt="Finoa" width="24" height="24" style={{borderRadius:6}}/> Finoa</div>
      <div className="nav-links">
        {links.map(l => (
          <NavLink key={l.to} to={l.to} className={({isActive}) => isActive ? 'active' : ''}>{l.label}</NavLink>
        ))}
      </div>
      <div className="nav-right"><FaChartPie /><FaUserCircle /></div>
    </nav>
  )
}

function Footer() {
  return (
    <footer className="footer">
             <div className="brand">
         <img src="/finoa-logo.svg" alt="Finoa" width={32} height={32} style={{borderRadius:8}}/>
         <div>
           <strong style={{display:'block', fontSize:18}}>Finoa</strong>
           <small>Finoa simplifies how you manage, grow, and understand your money—with intelligent tools, real-time insights, and an all-in-one financial dashboard.</small>
           <div style={{display:'flex', gap:10, marginTop:8}}>
<a href="#" aria-label="Facebook"><FaFacebook /></a>
            <a href="#" aria-label="Twitter"><FaTwitter /></a>
            <a href="#" aria-label="LinkedIn"><FaLinkedin /></a>
            <a href="#" aria-label="Instagram"><FaInstagram /></a>
          </div>
          <div style={{marginTop:8, fontSize:14}}>
            <div>India</div>
            <div>Phone: 9999999999</div>
          </div>
        </div>
      </div>

      <div className="col">
        <h4>Product</h4>
        <NavLink to="/features">Features</NavLink>
        <NavLink to="/pricing">Pricing</NavLink>
        <NavLink to="/career">Career</NavLink>
        <NavLink to="/integration">Integration</NavLink>
        <NavLink to="/faq">FAQ</NavLink>
      </div>

      <div className="col">
        <h4>Resources</h4>
        <NavLink to="/about">About</NavLink>
        <NavLink to="/contact">Contact</NavLink>
        <NavLink to="/blogs">Blogs</NavLink>
      </div>

      <div className="col">
        <h4>Legal</h4>
        <NavLink to="/privacy">Privacy Policy</NavLink>
        <NavLink to="/terms">Terms & Conditions</NavLink>
      </div>

      <div className="col">
        <h4>User Account</h4>
        <a href="/login">Login</a>
        <a href="/signup">Sign Up</a>
      </div>
    </footer>
  )
}

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -12 },
}

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
             <Routes location={location} key={location.pathname}>
         <Route path="/" element={<motion.div initial="initial" animate="in" exit="out" variants={pageVariants}><Home /></motion.div>} />
         <Route path="/budget" element={<motion.div initial="initial" animate="in" exit="out" variants={pageVariants}><BudgetPlanner /></motion.div>} />
         <Route path="/expenses" element={<motion.div initial="initial" animate="in" exit="out" variants={pageVariants}><ExpenseTracker /></motion.div>} />
         <Route path="/savings" element={<motion.div initial="initial" animate="in" exit="out" variants={pageVariants}><SavingsInvestments /></motion.div>} />
         <Route path="/emergency" element={<motion.div initial="initial" animate="in" exit="out" variants={pageVariants}><EmergencyFund /></motion.div>} />
         <Route path="/reports" element={<motion.div initial="initial" animate="in" exit="out" variants={pageVariants}><ReportsInsights /></motion.div>} />
         <Route path="/login" element={<motion.div initial="initial" animate="in" exit="out" variants={pageVariants}><Login /></motion.div>} />
         <Route path="/signup" element={<motion.div initial="initial" animate="in" exit="out" variants={pageVariants}><Signup /></motion.div>} />
         <Route path="/profile" element={<motion.div initial="initial" animate="in" exit="out" variants={pageVariants}><ProfileSettings /></motion.div>} />
         <Route path="/about" element={<motion.div initial="initial" animate="in" exit="out" variants={pageVariants}><About /></motion.div>} />
         <Route path="/contact" element={<motion.div initial="initial" animate="in" exit="out" variants={pageVariants}><Contact /></motion.div>} />
         <Route path="/features" element={<motion.div initial="initial" animate="in" exit="out" variants={pageVariants}><Features /></motion.div>} />
         <Route path="/pricing" element={<motion.div initial="initial" animate="in" exit="out" variants={pageVariants}><Pricing /></motion.div>} />
         <Route path="/career" element={<motion.div initial="initial" animate="in" exit="out" variants={pageVariants}><Career /></motion.div>} />
         <Route path="/integration" element={<motion.div initial="initial" animate="in" exit="out" variants={pageVariants}><Integration /></motion.div>} />
         <Route path="/faq" element={<motion.div initial="initial" animate="in" exit="out" variants={pageVariants}><Faq /></motion.div>} />
         <Route path="/blogs" element={<motion.div initial="initial" animate="in" exit="out" variants={pageVariants}><Blogs /></motion.div>} />
         <Route path="/privacy" element={<motion.div initial="initial" animate="in" exit="out" variants={pageVariants}><Privacy /></motion.div>} />
         <Route path="/terms" element={<motion.div initial="initial" animate="in" exit="out" variants={pageVariants}><Terms /></motion.div>} />
       </Routes>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <DataProvider>
      <div className="app">
        <NavBar />
        <AnimatedRoutes />
        <Footer />
        <ChatWidget />
      </div>
    </DataProvider>
  )
}
