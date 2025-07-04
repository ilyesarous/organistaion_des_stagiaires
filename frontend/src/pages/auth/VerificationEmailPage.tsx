// pages/VerifyEmail.js
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Alert, Spinner } from 'react-bootstrap';
import { verifyEmail } from './authRedux/AuthSlice';

export default function VerifyEmail() {
  const { id, hash } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, message } = useSelector(
    (state: any) => state.auth.verification
  );

  useEffect(() => {
    dispatch(verifyEmail({ id, hash }))
      .unwrap()
      .then(() => {
        // Redirect to dashboard after successful verification
        setTimeout(() => navigate('/dashboard'), 3000);
        })
      
  }, [dispatch, id, hash, navigate]);

  if (loading) {
    return (
      <div className="text-center">
        <Spinner animation="border" />
        <p>Verifying your email...</p>
      </div>
    );
  }

  return (
    <div className="container">
      {error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (
        <Alert variant="success">{message}</Alert>
      )}
    </div>
  );
}