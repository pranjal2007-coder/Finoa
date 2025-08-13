import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const DataContext = createContext(null)

const STORAGE_KEY = 'finova_state'
const DEFAULT_CATEGORIES = ['Food','Transport','Bills','Shopping','Entertainment','Other']

function generateId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

export function DataProvider({ children }) {
  const [state, setState] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null')
      if (saved) return saved
    } catch {}
    let user = null
    try { user = JSON.parse(localStorage.getItem('finova_user') || 'null') } catch {}
    const categoryBudgets = Object.fromEntries(DEFAULT_CATEGORIES.map(c => [c, 0]))
    return {
      user: user ? { name: user.name, email: user.email } : null,
      monthlyIncome: 0,
      emergencyFund: 0,
      categoryBudgets,
      expenses: [],
      goals: [],
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const actions = useMemo(() => ({
    setUser(user) { setState(s => ({ ...s, user })) },
    setMonthlyIncome(amount) { setState(s => ({ ...s, monthlyIncome: Number(amount) || 0 })) },
    setEmergencyFund(amount) { setState(s => ({ ...s, emergencyFund: Number(amount) || 0 })) },
    setCategoryBudget(category, amount) { setState(s => ({ ...s, categoryBudgets: { ...s.categoryBudgets, [category]: Number(amount)||0 } })) },

    addExpense(expense) {
      const e = { id: generateId(), date: expense.date || new Date().toISOString().slice(0,10), category: expense.category, name: expense.name, cost: Number(expense.cost) || 0 }
      setState(s => ({ ...s, expenses: [e, ...s.expenses] }))
    },
    updateExpense(id, updates) {
      setState(s => ({ ...s, expenses: s.expenses.map(e => e.id === id ? { ...e, ...updates, cost: updates.cost !== undefined ? Number(updates.cost) : e.cost } : e) }))
    },
    deleteExpense(id) {
      setState(s => ({ ...s, expenses: s.expenses.filter(e => e.id !== id) }))
    },

    addGoal(goal) {
      const g = { id: generateId(), name: goal.name, cost: Number(goal.cost) || 0, deadline: goal.deadline, savedSoFar: Number(goal.savedSoFar) || 0 }
      setState(s => ({ ...s, goals: [g, ...s.goals] }))
    },
    updateGoal(id, updates) {
      setState(s => ({ ...s, goals: s.goals.map(g => g.id === id ? { ...g, ...updates, cost: updates.cost !== undefined ? Number(updates.cost) : g.cost, savedSoFar: updates.savedSoFar !== undefined ? Number(updates.savedSoFar) : g.savedSoFar } : g) }))
    },
    deleteGoal(id) { setState(s => ({ ...s, goals: s.goals.filter(g => g.id !== id) })) },
  }), [])

  const selectors = useMemo(() => ({
    monthKey() { return new Date().toISOString().slice(0,7) },
    monthlyExpenseTotal() {
      const month = selectors.monthKey()
      return state.expenses.filter(e => (e.date || '').startsWith(month)).reduce((sum,e)=>sum+e.cost,0)
    },
    byCategoryThisMonth() {
      const month = selectors.monthKey()
      const map = {}
      for (const e of state.expenses) {
        if (!e.date || !e.date.startsWith(month)) continue
        map[e.category] = (map[e.category] || 0) + e.cost
      }
      return Object.entries(map).map(([category, amount]) => ({ category, amount }))
    },
    categorySpendThisMonth(category) {
      const month = selectors.monthKey()
      return state.expenses.filter(e => e.category === category && (e.date||'').startsWith(month)).reduce((s,e)=>s+e.cost,0)
    },
    availableForSavings() {
      const income = state.monthlyIncome || 0
      const expenses = selectors.monthlyExpenseTotal()
      const reserved = state.emergencyFund || 0
      return Math.max(0, income - expenses - reserved)
    },
    overallUnderBudget() {
      return selectors.monthlyExpenseTotal() < Math.max(0, state.monthlyIncome - state.emergencyFund)
    },
    categoryUnderBudget(category) {
      const cap = state.categoryBudgets?.[category] || 0
      if (!cap) return null
      return selectors.categorySpendThisMonth(category) <= cap
    },
    notifications() {
      const notes = []
      if (selectors.overallUnderBudget()) {
        notes.push({ type: 'success', text: 'Congratulations! You are under your monthly budget.' })
      }
      for (const [cat, cap] of Object.entries(state.categoryBudgets||{})) {
        if (!cap) continue
        const spent = selectors.categorySpendThisMonth(cat)
        if (spent > cap) notes.push({ type: 'warn', text: `You exceeded the ${cat} budget.` })
      }
      const today = new Date()
      for (const g of state.goals) {
        const daysLeft = Math.ceil((new Date(g.deadline) - today) / (1000*60*60*24))
        const remaining = Math.max(0, g.cost - g.savedSoFar)
        if (daysLeft <= 14 && remaining > 0) {
          notes.push({ type: 'reminder', text: `Goal '${g.name}' is due in ${daysLeft} days. Save ₹${Math.ceil(remaining/Math.max(1,daysLeft))}/day.` })
        }
      }
      return notes
    }
  }), [state])

  const value = useMemo(() => ({ state, actions, selectors, DEFAULT_CATEGORIES }), [state, actions, selectors])

  return (
    <DataContext.Provider value={value}>{children}</DataContext.Provider>
  )
}

export function useData() {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData must be used within DataProvider')
  return ctx
}