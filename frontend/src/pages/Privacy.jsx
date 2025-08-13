import { motion } from 'framer-motion'

export default function Privacy() {
  return (
    <div className="page">
      <motion.div className="card" initial={{opacity:0, y:10}} animate={{opacity:1, y:0}}>
        <h2>Privacy Policy</h2>
        <p>We collect minimal data to provide the service. We do not sell your data.</p>
        <h3>Data Collection</h3>
        <p>Profile info, app usage, and optional bank/transaction data if you connect integrations.</p>
        <h3>Storage & Security</h3>
        <p>Data encrypted in transit and at rest. Role‑based access. Regular audits.</p>
        <h3>Third‑party & Cookies</h3>
        <p>We use trusted providers (e.g., Plaid) strictly to deliver features. Cookies help keep you signed in.</p>
        <h3>GDPR/CCPA</h3>
        <p>You can export or delete your data anytime. Contact privacy@finoa.app.</p>
      </motion.div>
    </div>
  )
}