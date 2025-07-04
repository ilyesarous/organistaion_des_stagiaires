// components/EmailVerificationNotice.js
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';// Adjust the import path as necessary
import { Button, Alert } from 'react-bootstrap';
import { resendVerificationEmail } from '../pages/auth/authRedux/AuthSlice';

export default function EmailVerificationNotice() {
  const dispatch = useDispatch();
  const { user } = useSelector((state: any) => state.auth);
  const { resendLoading, resendError, resendSuccess } = useSelector(
    (state: any) => state.auth.verification
  );

  const handleResend = () => {
    dispatch(resendVerificationEmail());
  };

  useEffect(() => {
    if (resendSuccess) {
      // You might want to show a toast notification here
      console.log('Verification email resent successfully');
    }
  }, [resendSuccess]);

  return (
    <div className="verification-notice">
      <h4>Verify Your Email Address</h4>
      <p>
        A verification link has been sent to <strong>{user?.email}</strong>.
        Please check your email and click the link to verify your account.
      </p>
      
      {resendError && <Alert variant="danger">{resendError}</Alert>}
      {resendSuccess && <Alert variant="success">Verification email sent!</Alert>}
      
      <p>
        Didn't receive the email?{' '}
        <Button 
          variant="link" 
          onClick={handleResend}
          disabled={resendLoading}
        >
          {resendLoading ? 'Sending...' : 'Click here to resend'}
        </Button>
      </p>
    </div>
  );
}