import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import "./App.css";
import { LoginPage } from "./pages/auth/LoginPage";
import { Dashboard } from "./pages/Dashboard";
import { VerifyEmailPage } from "./components/EmailVerificationNotice";
import NotFoundPage from "./components/NotFound";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Profile } from "./pages/auth/Profile";
import type { RootState } from "./tools/redux/Store";

function App() {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  useEffect(() => {
    isAuthenticated;
  }, [isAuthenticated]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/verify-email" element={<VerifyEmailPage />} />

        {/* Auth route - only accessible when not authenticated */}
        <Route
          path="/login"
          element={
            isAuthenticated ? <Navigate to="/dashboard" /> : <LoginPage />
          }
        />

        {/* Protected routes - only accessible when authenticated */}
        <Route
          path="/dashboard"
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/profile"
          element={isAuthenticated ? <Profile /> : <Navigate to="/login" />}
        />

        {/* Root path redirects based on auth status */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Catch-all route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
