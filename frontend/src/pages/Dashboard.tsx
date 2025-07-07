import { Button } from "react-bootstrap";
import { axiosRequest } from "../apis/AxiosHelper";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AuthActions } from "./auth/authRedux/AuthSlice";

export const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  return (
    <div className="container">
      <h1>Dashboard</h1>
      <p>Welcome to your dashboard!</p>
      <Button onClick={()=> {
        axiosRequest('post', 'auth/logout')
          .then(response => {
            console.log(response.data);
            dispatch(AuthActions.logout())
            navigate("/"); // Redirect to login page
          })
          .catch(error => {
            console.error("There was an error logging out!", error);
          });
      }}>Logout</Button>
    </div>
  );
}