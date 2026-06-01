import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "../features/auth/authSlice";
import transactionReducer from "../features/transaction/transactionSlice";
import categoryReducer from "../features/category/categorySlice";
import budgetReducer from "../features/budget/budgetSlice";
import categoryBudgetReducer from "../features/categoryBudget/categoryBudgetSlice";

let storageEngine: any = storage;
if (!storageEngine || typeof storageEngine.getItem !== "function") {
  if (storageEngine && typeof storageEngine.default === "object" && typeof storageEngine.default.getItem === "function") {
    storageEngine = storageEngine.default;
  } else {
    console.warn("redux-persist storage engine missing getItem; found:", storageEngine);
  }
}

const persistConfig = {
  key: "root",
  storage: storageEngine,
};

const rootReducer = combineReducers({
  auth: authReducer,
  transactions: transactionReducer,
  categories: categoryReducer,
  budgets: budgetReducer,
  categoryBudgets: categoryBudgetReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [
                    "persist/PERSIST",
                    "persist/REHYDRATE",
                    "persist/PAUSE",
                    "persist/PURGE",
                    "persist/REGISTER",
                    "persist/FLUSH"
                ],
            },
        }),
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
