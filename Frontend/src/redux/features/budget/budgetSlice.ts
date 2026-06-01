import { createSlice } from "@reduxjs/toolkit";
import type { Budget, BudgetState } from "./budgetTypes";
import type { PayloadAction } from "@reduxjs/toolkit";

const initialState: BudgetState = {
  budgets: [],
};

const budgetSlice = createSlice({
    name : "budgets",
    initialState,
    reducers: {
        setBudgets: (state, action: PayloadAction<Budget[]>) => {
            state.budgets = action.payload
        },
        addBudgets: (state, action: PayloadAction<Budget>) => {
            state.budgets.push(action.payload);
        },
        updateBudgets: (state, action: PayloadAction<Budget>) => {
            const idx = state.budgets.findIndex(b => b.id === action.payload.id);
            if (idx !== -1) state.budgets[idx] = action.payload;
        },
        deleteBudget: (state, action: PayloadAction<string>) => {
            state.budgets = state.budgets.filter(b => b.id !== action.payload);
        }
    }
});

export const {
  setBudgets,
  addBudgets,
  updateBudgets,
  deleteBudget
} = budgetSlice.actions;

export default budgetSlice.reducer;