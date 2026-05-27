import type { Category, CategoryState } from "./categoryType";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

const initialState: CategoryState = {
  categories: [],
};

const categorySlice = createSlice({
    name: "categories",
    initialState,
    reducers: {
        setCategories: (state, action: PayloadAction<Category[]>) => {
            state.categories = action.payload;
        },
        addCategory: (state, action: PayloadAction<Category>) => {
            state.categories.push(action.payload);
        },
        updateCategory: (state, action: PayloadAction<Category>) => {
            const idx = state.categories.findIndex(c => c.id === action.payload.id);
            if (idx!== -1) state.categories[idx] = action.payload;
        },
        deleteCategory: (state, action: PayloadAction<string>) => {
            state.categories = state.categories.filter(c => c.id!== action.payload);
        }
    }
});

export const { setCategories, addCategory, updateCategory, deleteCategory } = categorySlice.actions;
export default categorySlice.reducer;