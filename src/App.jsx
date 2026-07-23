import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Columns from "./pages/Columns";
import Reports from "./pages/Reports";

import DashboardLayout from "./layouts/DashboardLayout";

export default function App() {
  return (
    <Routes>

      <Route path="/" element={<Login />} />

      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/products" element={<Products />} />
        <Route path="/columns" element={<Columns />} />
        <Route path="/reports" element={<Reports />} />
      </Route>

      <Route path="*" element={<Navigate to="/" />} />

    </Routes>
  );
}