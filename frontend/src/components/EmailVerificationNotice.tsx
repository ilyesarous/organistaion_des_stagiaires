import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function VerifyEmail() {
  const [status, setStatus] = useState("verifying");
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    console.log(params);
    
    const verifyUrl = params.get("verify_url"); // ✅ FULL Laravel verification URL
    console.log("🔗 Verification URL:", verifyUrl);
    

    // const token = localStorage.getItem("token");

    if (!verifyUrl) {
      setStatus("missing");
      return;
    }

    axios
      .get(verifyUrl)
      .then((response) => {
        console.log("✅ Email verified:", response.data);
        setStatus("success");
        navigate("/"); // Redirect to login after successful verification
      })
      .catch((error) => {
        console.error("❌ Verification failed:", error.response?.data || error);
        setStatus("failed");
      });
  }, []);

  return (
    <div className="container text-center mt-5">
      {status === "verifying" && <p>⏳ Verifying your email...</p>}
      {status === "success" && <p>✅ Your email has been verified!</p>}
      {status === "failed" && (
        <p>❌ Verification failed. Link may be expired or invalid.</p>
      )}
      {status === "missing" && <p>⚠️ Missing verification URL.</p>}
    </div>
  );
}

export default VerifyEmail;
