import axios from "axios";

axios.defaults.baseURL = "http://localhost:8000/api";
axios.defaults.headers.post["Content-Type"] = "application/json";
const token = localStorage.getItem("token");
if (token) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}
axios.defaults.withCredentials = true; //to allow cookies

export const axiosRequest = (
  method: any,
  url: string,
  data?: any,
  header?: any
) => {
  return axios({
    method: method,
    url: url,
    data: data,
    headers: header
  });
};