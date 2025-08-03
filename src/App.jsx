// === FRONTEND (React + MUI + Cloudinary Upload Button) ===
import { Route, Routes, useLocation, useNavigate } from "react-router";
import "./App.css";

import CategoriesForm from "./Components/CategoriesForm";
import CategoryTree from "./Components/CategoryTree";
import DashboardLayout from "./layout/DashboardLayout";
import AuthLayout from "./layout/AuthLayout";
import AuthForm from "./Components/auth/AuthForm";
import useAuthStore from "./store/useAuthStore";
import { useEffect } from "react";
import EditorUsersList from "./Components/EditorUsersList";

const App = () => {
  const { token, role, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const allowedRoutes = ["/signup", "/login"];
    if (!token && !allowedRoutes.includes(location.pathname)) {
      navigate("/login");
    }
  }, [token, location.pathname]);

  // useEffect(() => {
  //   logout();
  // }, []);

  return (
    <Routes>
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<CategoryTree />} />
        <Route path="add" element={<CategoriesForm />} />
        {role === "admin" && (
          <Route path="promote" element={<EditorUsersList />} />
        )}
      </Route>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<AuthForm mode="login" />} />
        <Route path="/signup" element={<AuthForm mode="signup" />} />
      </Route>
    </Routes>
  );
};

export default App;
