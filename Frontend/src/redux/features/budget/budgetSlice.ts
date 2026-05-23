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
    }
});

export const { setBudgets } = budgetSlice.actions;

export default budgetSlice.reducer;