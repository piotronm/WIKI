// routes/AppRoutes.tsx
import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Article from "../pages/Article";
//import Login from "../pages/Login";
import AdminPanel from "../pages/AdminPanel";
import UnauthorizedPage from '../pages/UnauthorizedPage';
import NotFoundPage from "../pages/NotfoundPage";
//import ProtectedRoute from '../components/ProtectedRoute';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/article/:id" element={<Article />} />
      <Route path="/admin" element={<AdminPanel />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
//<Route path="/login" element={<Login />} />
//<Route path="/admin" element={<AdminPanel />} />