import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const DataContext = createContext(null)

const STORAGE_KEY = 'finova_state'

function generateId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

export function DataProvider({ children }) {
  const [state, setState] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null')
      if (saved) return saved
    } catch {}
    // bootstrap from previous login/signup keys if present
    let user = null
    try { user = JSON.parse(localStorage.getItem('finova_user') || 'null') } catch {}
    return {
      user: user ? { name: user.name, email: user.email } : null,
      monthlyIncome: 0,
      emergencyFund: 0,
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
    monthlyExpenseTotal() {
      const month = new Date().toISOString().slice(0,7) // YYYY-MM
      return state.expenses.filter(e => (e.date || '').startsWith(month)).reduce((sum,e)=>sum+e.cost,0)
    },
    byCategoryThisMonth() {
      const month = new Date().toISOString().slice(0,7)
      const map = {}
      for (const e of state.expenses) {
        if (!e.date || !e.date.startsWith(month)) continue
        map[e.category] = (map[e.category] || 0) + e.cost
      }
      return Object.entries(map).map(([category, amount]) => ({ category, amount }))
    },
    availableForSavings() {
      const income = state.monthlyIncome || 0
      const expenses = selectors.monthlyExpenseTotal()
      const reserved = state.emergencyFund || 0
      return Math.max(0, income - expenses - reserved)
    }
  }), [state])

  const value = useMemo(() => ({ state, actions, selectors }), [state, actions, selectors])

  return (
    <DataContext.Provider value={value}>{children}</DataContext.Provider>
  )
}

export function useData() {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData must be used within DataProvider')
  return ctx
}