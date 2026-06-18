import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ProfileState } from "./profileTypes";

const initialState: ProfileState = {
    user: { id: "", name: "", email: "" },
    totalTransactions: 0,
    totalIncome: 0,
    totalExpense: 0,
    totalSaved: 0,
    avgExpense: 0,
    maxCategory: {
        name: "",
        amount: 0
    },
    maxSpendMonth: {
        month: "",
        amount: 0
    }
}

const profileSlice = createSlice({
    name: "profile",
    initialState,
    reducers: {
        setProfile(state, action: PayloadAction<ProfileState>) {
            return action.payload;
        }
    }
})

export const { setProfile } = profileSlice.actions;
export default profileSlice.reducer;