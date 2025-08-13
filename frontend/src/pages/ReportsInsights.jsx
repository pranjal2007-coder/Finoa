import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Pie } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx'
import { api } from '../lib/api'

ChartJS.register(ArcElement, Tooltip, Legend)

export default function ReportsInsights() {
  const [rows, setRows] = useState([])

  useEffect(() => {
    const userId = '00000000-0000-0000-0000-000000000001'
    api(`/summary?userId=${userId}`)
      .then((s) => setRows(s.byCategory.map(c => ({ category: c.category, amount: c.amount }))))
      .catch(() => setRows([]))
  }, [])

  const pieData = {
    labels: rows.map(r=>r.category),
    datasets: [{ data: rows.map(r=>r.amount), backgroundColor: ['#22c55e','#3b82f6','#f59e0b','#ef4444'] }]
  }

  function exportPDF() {
    const doc = new jsPDF()
    doc.text('Finoa – Spending Report', 14, 16)
    autoTable(doc, { head: [['Category','Amount (₹)']], body: rows.map(r=>[r.category, r.amount]) })
    doc.save('finoa-report.pdf')
  }

  function exportExcel() {
    const ws = XLSX.utils.json_to_sheet(rows)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Report')
    XLSX.writeFile(wb, 'finoa-report.xlsx')
  }

  return (
    <div className="page">
      <motion.div className="card" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}}>
        <h2>Reports & Insights</h2>
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:12}}>
          <div className="card">
            <h3>Spending Distribution</h3>
            <Pie data={pieData} />
          </div>
          <div className="card">
            <h3>Export</h3>
            <button className="button" onClick={exportPDF}>Export PDF</button>
            <button className="button" style={{marginLeft:8}} onClick={exportExcel}>Export Excel</button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}