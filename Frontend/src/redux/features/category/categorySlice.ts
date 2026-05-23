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
            state.categories = action.payload
        }
    }
});

export const { setCategories } = categorySlice.actions;
export default categorySlice.reducer;