// src/pages/auth/LoginPage.tsx
import { useState } from "react";
import { Button, Form, Card } from "react-bootstrap";
import { axiosRequest } from "../../apis/AxiosHelper";
import { useDispatch } from "react-redux";
import { AuthActions } from "./authRedux/AuthSlice";
import { useNavigate } from "react-router-dom";

export const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const HandleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axiosRequest("post", "/auth/login", { email, password });
      dispatch(AuthActions.login(response.data));
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid credentials");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <Card className="shadow-lg p-4 rounded-3" style={{ maxWidth: "420px", width: "100%" }}>
        <div className="text-center mb-4">
          <h3 className="mt-3 fw-bold">Welcome Back</h3>
          <p className="text-muted small">Please sign in to continue</p>
        </div>
        <Form onSubmit={HandleLogin}>
          {error && <div className="alert alert-danger">{error}</div>}
          <Form.Group className="mb-3">
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="rounded-3"
            />
          </Form.Group>
          <Form.Group className="mb-4">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="rounded-3"
            />
          </Form.Group>
          <Button
            variant="primary"
            type="submit"
            className="w-100 rounded-3 py-2 fw-semibold"
          >
            Login
          </Button>
        </Form>
      </Card>
    </div>
  );
};
