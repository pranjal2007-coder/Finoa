import { Routes, Route, NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import { FaPiggyBank, FaChartPie, FaUserCircle, FaBell, FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from 'react-icons/fa'
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
import Goals from './pages/Goals'
import ChatWidget from './components/ChatWidget'
import { useData } from './context/DataContext'
import './App.css'

function NavBar() {
  const links = [
    { to: '/', label: 'Home' },
    { to: '/budget', label: 'Budget Planner' },
    { to: '/expenses', label: 'Expense Tracker' },
    { to: '/savings', label: 'Savings & Investments' },
    { to: '/emergency', label: 'Emergency Fund' },
    { to: '/goals', label: 'Goals' },
    { to: '/reports', label: 'Reports & Insights' },
    { to: '/login', label: 'Sign In' },
    { to: '/signup', label: 'Sign Up' },
    { to: '/profile', label: 'Profile & Settings' },
    { to: '/about', label: 'About Us' },
    { to: '/contact', label: 'Contact Us' },
  ]
  const { selectors } = useData()
  const notes = selectors.notifications()
  return (
    <nav className="navbar">
      <div className="brand"><FaPiggyBank /> Finova</div>
      <div className="nav-links">
        {links.map(l => (
          <NavLink key={l.to} to={l.to} className={({isActive}) => isActive ? 'active' : ''}>{l.label}</NavLink>
        ))}
      </div>
      <div className="nav-right">
        <div className="bell"><FaBell />{notes.length>0 && <span className="badge">{notes.length}</span>}</div>
        <FaChartPie />
        <FaUserCircle />
      </div>
    </nav>
  )
}

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div>
          <h4>Finvolv</h4>
          <p>Finvolv simplifies how you manage, grow, and understand your money—with intelligent tools, real-time insights, and an all-in-one financial dashboard.</p>
          <p>Address: India • Phone: 9999999999</p>
          <div style={{display:'flex', gap:8, fontSize:20, marginTop:6}}>
            <a href="#"><FaFacebook /></a>
            <a href="#"><FaTwitter /></a>
            <a href="#"><FaLinkedin /></a>
            <a href="#"><FaInstagram /></a>
          </div>
        </div>
        <div>
          <h4>Product</h4>
          <a href="#">Features</a>
          <a href="#">Pricing</a>
          <a href="#">Career</a>
          <a href="#">Integration</a>
          <a href="#">FAQ</a>
        </div>
        <div>
          <h4>Resources</h4>
          <a href="#">About</a>
          <a href="#">Contact</a>
          <a href="#">Blogs</a>
        </div>
        <div>
          <h4>Legal</h4>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms & Conditions</a>
        </div>
        <div>
          <h4>User Account</h4>
          <a href="/login">Login</a>
          <a href="/signup">Sign Up</a>
        </div>
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
        <Route path="/goals" element={<motion.div initial="initial" animate="in" exit="out" variants={pageVariants}><Goals /></motion.div>} />
        <Route path="/reports" element={<motion.div initial="initial" animate="in" exit="out" variants={pageVariants}><ReportsInsights /></motion.div>} />
        <Route path="/login" element={<motion.div initial="initial" animate="in" exit="out" variants={pageVariants}><Login /></motion.div>} />
        <Route path="/signup" element={<motion.div initial="initial" animate="in" exit="out" variants={pageVariants}><Signup /></motion.div>} />
        <Route path="/profile" element={<motion.div initial="initial" animate="in" exit="out" variants={pageVariants}><ProfileSettings /></motion.div>} />
        <Route path="/about" element={<motion.div initial="initial" animate="in" exit="out" variants={pageVariants}><About /></motion.div>} />
        <Route path="/contact" element={<motion.div initial="initial" animate="in" exit="out" variants={pageVariants}><Contact /></motion.div>} />
      </Routes>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <div className="app">
      <NavBar />
      <AnimatedRoutes />
      <ChatWidget />
      <Footer />
    </div>
  )
}
