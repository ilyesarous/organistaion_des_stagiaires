import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
// import { LoginPage } from './pages/auth/LoginPage'
import { RegisterPage } from './pages/auth/RegisterPage'
import ProtectedRoute from './components/ProtectedRoute'
import VerifyEmail from './pages/auth/VerificationEmailPage'
import { LoginPage } from './pages/auth/LoginPage'
import { Dashboard } from './pages/Dashboard'
// 
function App() {

  return (
    <BrowserRouter>
      <Routes>
        {/* ... other routes ... */}
        <Route path='/' element={<LoginPage />} />
        <Route path='/register' element={<RegisterPage />} />
        <Route path="/verify-email/:id/:hash" element={<VerifyEmail />} />
        <Route element={<ProtectedRoute requireVerified={true} />}>
          {/* Protected routes that require verified email */}
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          {/* Protected routes that don't require verified email */}
          {/* <Route path="/profile" element={<Profile />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
