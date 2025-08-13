import { Routes, Route, NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import { FaPiggyBank, FaChartPie, FaUserCircle } from 'react-icons/fa'
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
import './App.css'

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
      <div className="brand"><FaPiggyBank /> Finova</div>
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
      <div>
        <strong>Finova</strong>
        <p>123 Finance Street, Mumbai, MH 400001</p>
        <p>Email: support@finova.example • Phone: +91 90000 00000</p>
      </div>
      <div className="footer-links">
        <a href="#">Privacy</a>
        <a href="#">Terms</a>
        <a href="#">Careers</a>
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
      </Routes>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <div className="app">
      <NavBar />
      <AnimatedRoutes />
      <Footer />
    </div>
  )
}
