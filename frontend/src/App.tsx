import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { RegisterPage } from "./pages/auth/RegisterPage";
import { LoginPage } from "./pages/auth/LoginPage";
import { Dashboard } from "./pages/Dashboard";
import VerifyEmail from "./components/EmailVerificationNotice";
import NotFoundPage from "./components/NotFound";
import { useEffect } from "react";
import { useSelector } from "react-redux";
//
function App() {
  const token = useSelector((state: any) => state.auth.token); // Access token from Redux store
  // const isAuthenticated = !!token; // Check if token exists

  useEffect(() => {
    token && localStorage.getItem("token"); // Store token in localStorage
  }, [token]);

  return (
    <BrowserRouter>
      <Routes>
        {/* ... other routes ... */}
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        {/* Protected routes that require verified email */}
        {!token ? (
          <Route path="/" element={<LoginPage />} />
        ) : (
          <Route path="/dashboard" element={<Dashboard />} />
        )}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
