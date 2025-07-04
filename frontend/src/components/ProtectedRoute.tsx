// components/ProtectedRoute.js
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import EmailVerificationNotice from './EmailVerificationNotice';

export default function ProtectedRoute({ requireVerified = false }) {
  const { user } = useSelector((state: any) => state.auth);

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (requireVerified && !user.email_verified_at) {
    return (
      <div className="container">
        <EmailVerificationNotice />
        {/* Optionally render Outlet if you want to show protected content */}
        {/* <Outlet /> */}
      </div>
    );
  }

  return <Outlet />;
}