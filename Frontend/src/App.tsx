import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Navbar from "./components/Navbar";
import Categories from "./pages/Categories";
import Budgets from "./pages/Budgets";
import Transactions from "./pages/Transactions";

const App = () => {
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
      </Routes>
    </BrowserRouter>
  );
};

export default App;
