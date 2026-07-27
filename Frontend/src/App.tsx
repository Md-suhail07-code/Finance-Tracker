import { useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Navbar from "./components/Navbar";
import Categories from "./pages/Categories";
import Budgets from "./pages/Budgets";
import Transactions from "./pages/Transactions";
import Profile from "./pages/Profile";
import { useAppSelector } from "./redux/hooks/reduxHooks";

const App = () => {
  const themeMode = useAppSelector((state) => state.theme?.mode || "dark");

  useEffect(() => {
    const root = document.documentElement;
    if (themeMode === "dark") {
      root.classList.add("dark");
      root.style.colorScheme = "dark";
    } else {
      root.classList.remove("dark");
      root.style.colorScheme = "light";
    }
  }, [themeMode]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/index.html" element={<Navigate to="/login" replace />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <>
              <Navbar />
              <Dashboard />
            </>
          }
        />
        <Route
          path="/categories"
          element={
            <>
              <Navbar />
              <Categories />
            </>
          }
        />
        <Route
          path="/budgets"
          element={
            <>
              <Navbar />
              <Budgets />
            </>
          }
        />
        <Route
          path="/transactions"
          element={
            <>
              <Navbar />
              <Transactions />
            </>
          }
        />
        <Route
          path="/profile"
          element={
            <>
              <Navbar />
              <Profile />
            </>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
