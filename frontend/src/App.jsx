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
      <div className="brand"><FaPiggyBank /> Finoa</div>
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
        <div style={{fontSize:24, lineHeight:1}}><FaPiggyBank /></div>
        <div>
          <strong style={{display:'block', fontSize:18}}>Finoa</strong>
          <small>Finvolv simplifies how you manage, grow, and understand your money—with intelligent tools, real-time insights, and an all-in-one financial dashboard.</small>
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
        <a href="/features">Features</a>
        <a href="/pricing">Pricing</a>
        <a href="/career">Career</a>
        <a href="/integration">Integration</a>
        <a href="/faq">FAQ</a>
      </div>

      <div className="col">
        <h4>Resources</h4>
        <a href="/about">About</a>
        <a href="/contact">Contact</a>
        <a href="/blogs">Blogs</a>
      </div>

      <div className="col">
        <h4>Legal</h4>
        <a href="/privacy">Privacy Policy</a>
        <a href="/terms">Terms & Conditions</a>
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
        <Route path="/features" element={<motion.div initial="initial" animate="in" exit="out" variants={pageVariants}><div className="page"><div className="card"><h2>Features</h2><p>Explore Finoa features.</p></div></div></motion.div>} />
        <Route path="/pricing" element={<motion.div initial="initial" animate="in" exit="out" variants={pageVariants}><div className="page"><div className="card"><h2>Pricing</h2><p>Simple transparent plans.</p></div></div></motion.div>} />
        <Route path="/career" element={<motion.div initial="initial" animate="in" exit="out" variants={pageVariants}><div className="page"><div className="card"><h2>Career</h2><p>Join our team in India.</p></div></div></motion.div>} />
        <Route path="/integration" element={<motion.div initial="initial" animate="in" exit="out" variants={pageVariants}><div className="page"><div className="card"><h2>Integration</h2><p>Connect your tools and banks.</p></div></div></motion.div>} />
        <Route path="/faq" element={<motion.div initial="initial" animate="in" exit="out" variants={pageVariants}><div className="page"><div className="card"><h2>FAQ</h2><p>Frequently asked questions.</p></div></div></motion.div>} />
        <Route path="/blogs" element={<motion.div initial="initial" animate="in" exit="out" variants={pageVariants}><div className="page"><div className="card"><h2>Blogs</h2><p>Tips and stories on money.</p></div></div></motion.div>} />
        <Route path="/privacy" element={<motion.div initial="initial" animate="in" exit="out" variants={pageVariants}><div className="page"><div className="card"><h2>Privacy Policy</h2><p>Your data, protected.</p></div></div></motion.div>} />
        <Route path="/terms" element={<motion.div initial="initial" animate="in" exit="out" variants={pageVariants}><div className="page"><div className="card"><h2>Terms & Conditions</h2><p>Please read our terms.</p></div></div></motion.div>} />
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
