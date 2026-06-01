export interface Budget {
  id: string
  amount: number
  month: string
  userId: string
}

export interface BudgetState {
  budgets: Budget[]
}