import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { axiosRequest } from "../../apis/AxiosHelper";
import { useDispatch } from "react-redux";
import { AuthActions } from "./authRedux/AuthSlice";
import { useNavigate } from "react-router-dom";

export const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const HandleLogin = async (e: any) => {
    e.preventDefault();

    await axiosRequest("post", "/auth/login", { email, password })
      .then((response) => {
        console.log(response.data);
        
        dispatch(AuthActions.login(response.data));
        navigate("/dashboard"); 
      })
      .catch((error) => {
        console.error("Login failed:", error);
        // Show error message
      });
  };

  return (
    <div className="container mt-5">
      <div className="col-md-6 offset-md-3">
        <form className="form-control p-4 shadow-sm" onSubmit={HandleLogin}>
          <h2 className="text-center mb-4">Login</h2>
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter your email"
            required
            onChange={(e) => setEmail(e.target.value)}
          />
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter your password"
            required
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="d-flex justify-content-end gap-3 mt-4">
            <Button variant="primary" type="submit">
              Login
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
