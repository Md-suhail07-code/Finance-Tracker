export interface Budget {
  id: string
  amount: number
  month: string
}

export interface BudgetState {
  budgets: Budget[]
}