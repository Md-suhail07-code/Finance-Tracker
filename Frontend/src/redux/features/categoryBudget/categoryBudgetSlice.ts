import type { CategoryBudget, categoryBudgetState } from "./categoryBudgetType";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

const initialState: categoryBudgetState = {
    categoryBudgets: [],
};

const categoryBudgetSlice = createSlice({
    name: "categoryBudgets",
    initialState,
    reducers: {
        setCategoryBudgets: (state, action: PayloadAction<CategoryBudget[]>) => {
            state.categoryBudgets = action.payload;
        },
        addCategoryBudget: (state, action: PayloadAction<CategoryBudget>) => {
            state.categoryBudgets.push(action.payload);
        },
        updateCategoryBudget: (state, action: PayloadAction<CategoryBudget>) => {
            const idx = state.categoryBudgets.findIndex(cb => cb.id === action.payload.id);
            if (idx !== -1) state.categoryBudgets[idx] = action.payload;
        },
        deleteCategoryBudget: (state, action: PayloadAction<string>) => {
            state.categoryBudgets = state.categoryBudgets.filter(cb => cb.id !== action.payload);
        },
    }
});

export const { setCategoryBudgets, addCategoryBudget, updateCategoryBudget, deleteCategoryBudget } = categoryBudgetSlice.actions;
export default categoryBudgetSlice.reducer;