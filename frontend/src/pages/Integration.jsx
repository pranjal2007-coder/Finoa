import { motion } from 'framer-motion'

export default function Integration() {
  return (
    <div className="page">
      <motion.div className="card" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}}>
        <h2>Integrations</h2>
        <p>Connect banks and tools you already use to automate your finance workflow.</p>
        <div className="card" style={{textAlign:'left'}}>
          <h3>Supported</h3>
          <ul>
            <li>Plaid (bank linking)</li>
            <li>PayPal</li>
            <li>UPI export (CSV)</li>
            <li>Google Sheets</li>
          </ul>
          <h3>Setup Guides</h3>
          <ol>
            <li>Plaid: open Settings → Integrations → Plaid → Connect → follow secure flow.</li>
            <li>PayPal: add your API keys in Settings → Integrations → PayPal → Save.</li>
            <li>Google Sheets: install our add‑on, then run Sync from the Sheet.</li>
          </ol>
        </div>
      </motion.div>
    </div>
  )
}