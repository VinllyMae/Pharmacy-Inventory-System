import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Columns from "./pages/Columns";
import Reports from "./pages/Reports";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/home" element={<Home />} />
      <Route path="/products" element={<Products />} />
      <Route path="/columns" element={<Columns />} />
      <Route path="/reports" element={<Reports />} />
    </Routes>
  );
}