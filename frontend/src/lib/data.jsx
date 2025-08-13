import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'

const categories = ['Food','Transport','Bills','Shopping','Entertainment','Other']

const DataContext = createContext(null)

function loadState() {
  try {
    const raw = localStorage.getItem('finoa_state')
    if (!raw) return null
    const parsed = JSON.parse(raw)
    // Defensive defaults for older structures
    return {
      monthlyBudget: parsed.monthlyBudget || 0,
      categoryBudgets: { ...Object.fromEntries(categories.map(c=>[c,0])), ...(parsed.categoryBudgets || {}) },
      expenses: Array.isArray(parsed.expenses) ? parsed.expenses : [],
      wants: Array.isArray(parsed.wants) ? parsed.wants : [],
      congratsShownForMonth: parsed.congratsShownForMonth || '',
    }
  } catch { return null }
}

function saveState(state) {
  const toSave = {
    monthlyBudget: state.monthlyBudget,
    categoryBudgets: state.categoryBudgets,
    expenses: state.expenses,
    wants: state.wants,
    congratsShownForMonth: state.congratsShownForMonth,
  }
  localStorage.setItem('finoa_state', JSON.stringify(toSave))
}

export function DataProvider({ children }) {
  const [monthlyBudget, setMonthlyBudget] = useState(0)
  const [categoryBudgets, setCategoryBudgets] = useState(Object.fromEntries(categories.map(c=>[c,0])))
  const [expenses, setExpenses] = useState([])
  const [wants, setWants] = useState([])
  const [congratsShownForMonth, setCongratsShownForMonth] = useState('')

  // load from storage once
  const loadedRef = useRef(false)
  useEffect(() => {
    if (loadedRef.current) return
    const s = loadState()
    if (s) {
      setMonthlyBudget(s.monthlyBudget)
      setCategoryBudgets(s.categoryBudgets)
      setExpenses(s.expenses)
      setWants(s.wants)
      setCongratsShownForMonth(s.congratsShownForMonth || '')
    }
    loadedRef.current = true
  }, [])

  // persist on change
  useEffect(() => {
    saveState({ monthlyBudget, categoryBudgets, expenses, wants, congratsShownForMonth })
  }, [monthlyBudget, categoryBudgets, expenses, wants, congratsShownForMonth])

  function setCategoryBudget(category, amount) {
    setCategoryBudgets(prev => ({ ...prev, [category]: Number(amount || 0) }))
  }

  function addExpense({ date, category, name, cost }) {
    const id = crypto.randomUUID()
    setExpenses(prev => [...prev, { id, date: date || new Date().toISOString().slice(0,10), category, name, cost: Number(cost || 0) }])
  }
  function removeExpense(id) { setExpenses(prev => prev.filter(e=>e.id!==id)) }
  function editExpense(id, patch) { setExpenses(prev => prev.map(e=> e.id===id ? { ...e, ...patch } : e )) }

  function addWant({ title, dueDate }) {
    const id = crypto.randomUUID()
    setWants(prev => [...prev, { id, title, dueDate, done: false }])
  }
  function toggleWantDone(id, done) { setWants(prev => prev.map(w=> w.id===id ? { ...w, done } : w)) }
  function removeWant(id) { setWants(prev => prev.filter(w=>w.id!==id)) }

  const now = new Date()
  const monthKey = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}`
  const expensesThisMonth = useMemo(() => {
    return expenses.filter(e => (e.date || '').startsWith(monthKey))
  }, [expenses, monthKey])

  const totalExpenseThisMonth = useMemo(() => expensesThisMonth.reduce((s,e)=>s+Number(e.cost||0),0), [expensesThisMonth])
  const totalByCategoryThisMonth = useMemo(() => {
    const map = Object.fromEntries(categories.map(c=>[c,0]))
    for (const e of expensesThisMonth) { map[e.category] = (map[e.category]||0) + Number(e.cost||0) }
    return map
  }, [expensesThisMonth])

  const notifications = useMemo(() => {
    const list = []
    // Budget notifications
    if (monthlyBudget > 0) {
      if (totalExpenseThisMonth <= monthlyBudget) {
        list.push({ type:'success', text: `Congratulations! You're within budget: ₹${totalExpenseThisMonth.toLocaleString('en-IN')} / ₹${monthlyBudget.toLocaleString('en-IN')}` })
      } else {
        list.push({ type:'warn', text: `Over budget by ₹${(totalExpenseThisMonth - monthlyBudget).toLocaleString('en-IN')}` })
      }
    }
    // Category overages
    for (const c of categories) {
      const budget = Number(categoryBudgets[c]||0)
      if (budget > 0 && totalByCategoryThisMonth[c] > budget) {
        list.push({ type:'warn', text: `${c} exceeded by ₹${(totalByCategoryThisMonth[c]-budget).toLocaleString('en-IN')}` })
      }
    }
    // Wants reminders within 3 days
    const today = new Date()
    for (const w of wants) {
      if (w.done || !w.dueDate) continue
      const due = new Date(w.dueDate)
      const diffDays = Math.ceil((due - today) / (1000*60*60*24))
      if (diffDays <= 3) {
        list.push({ type:'reminder', text: `Reminder: Buy "${w.title}" by ${w.dueDate}` })
      }
    }
    return list
  }, [monthlyBudget, totalExpenseThisMonth, categoryBudgets, totalByCategoryThisMonth, wants])

  const value = {
    categories,
    monthlyBudget,
    setMonthlyBudget: (v)=> setMonthlyBudget(Number(v||0)),
    categoryBudgets,
    setCategoryBudget,
    expenses,
    addExpense,
    editExpense,
    removeExpense,
    wants,
    addWant,
    toggleWantDone,
    removeWant,
    totalExpenseThisMonth,
    totalByCategoryThisMonth,
    notifications,
  }

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData must be used within DataProvider')
  return ctx
}