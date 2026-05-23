import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

import type {
  Transaction,
  TransactionState,
} from "./transactionType"

const initialState: TransactionState = {
  transactions: [],
  loading: false,
}

const transactionSlice = createSlice({
  name: "transactions",
  initialState,

  reducers: {
    setTransactions: (
      state,
      action: PayloadAction<Transaction[]>
    ) => {
      state.transactions = action.payload
    },

    addTransaction: (
      state,
      action: PayloadAction<Transaction>
    ) => {
      state.transactions.unshift(action.payload)
    },

    deleteTransaction: (
      state,
      action: PayloadAction<string>
    ) => {
      state.transactions = state.transactions.filter(
        (transaction: Transaction) =>
          transaction.id !== action.payload
      )
    },
  },
})

export const {
  setTransactions,
  addTransaction,
  deleteTransaction,
} = transactionSlice.actions

export default transactionSlice.reducer