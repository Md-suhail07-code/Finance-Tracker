export interface Category {
  id: string
  name: string
  icon?: string
}

export interface Transaction {
  id: string
  title: string
  amount: number
  type: "INCOME" | "EXPENSE"
  description?: string
  date: string

  category: Category
}

export interface TransactionState {
  transactions: Transaction[]
  loading: boolean
}