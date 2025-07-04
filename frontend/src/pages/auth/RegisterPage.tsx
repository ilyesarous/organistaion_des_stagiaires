import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { axiosRequest } from "../../apis/AxiosHelper";

export const RegisterPage = () => {
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [numBadge, setNumBadge] = useState("");
  const [signature, setSignature] = useState("");
  const [role, setRole] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);

  const register = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Les mots de passe ne correspondent pas");
      return;
    }
    await axiosRequest("post", "/auth/register", {
      nom,
      prenom,
      email,
      password,
      password_confirmation: confirmPassword,
      phone,
      profile_picture: "default.png", // Assuming a default profile picture
      type: role,
      numBadge: role === "employee" ? numBadge : undefined,
      signature: role === "employee" ? signature : undefined,
      societe_id: 1,
    })
      .then(async (response) => {
        console.log("Registration successful:", response.data);
        setIsRegistered(true);
        setVerificationSent(true);
        await axiosRequest("post", "/email/verification-notification");
        // Redirect or show success message
      })
      .catch((error) => {
        console.error("Registration failed:", error);
        // Show error message
      });
  };

  return (
    <div className="container mt-5">
      <div className="col-md-6 offset-md-3">
        <form className="form-control p-4 shadow-sm" onSubmit={register}>
          <h2 className="text-center mb-4">Register</h2>
          <Form.Label>Nom</Form.Label>
          <Form.Control
            type="text"
            placeholder="Entrer votre nom"
            onChange={(e) => setNom(e.target.value)}
            required
          />
          <Form.Label>Prenom</Form.Label>
          <Form.Control
            type="text"
            placeholder="Entrer votre prenom"
            onChange={(e) => setPrenom(e.target.value)}
            required
          />
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Entre votre email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Entre votre password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Form.Label>Confirmez votre Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Confirmez votre password"
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <Form.Label>Phone</Form.Label>
          <Form.Control
            type="tel"
            placeholder="Entre votre numero de telephone"
            onChange={(e) => setPhone(e.target.value)}
            required
          />
          <div className="d-flex gap-3 mt-3">
            <p>Registre en tantque: </p>
            <Form.Check
              type="radio"
              label="Etudiant"
              name="role"
              value="etudiant"
              onChange={(e) => setRole(e.target.value)}
            />
            <Form.Check
              type="radio"
              label="Employer"
              name="role"
              value="employee"
              onChange={(e) => setRole(e.target.value)}
            />
          </div>
          {role === "employee" && (
            <>
              <Form.Label>Numero du Badge</Form.Label>
              <Form.Control
                type="text"
                placeholder="Entre votre numero de badge"
                onChange={(e) => setNumBadge(e.target.value)}
                required
              />
              <Form.Label>Signature</Form.Label>
              <Form.Control
                type="text"
                placeholder="Entre votre Signature"
                onChange={(e) => setSignature(e.target.value)}
                required
              />
            </>
          )}
          <div className="d-flex justify-content-end gap-3 mt-4">
            <Button variant="primary" type="submit">
              Register
            </Button>
            <Button variant="secondary" type="button">
              Login
            </Button>
          </div>
        </form>
        {isRegistered && (
          <div className="col-md-6 offset-md-3 mt-4">
            <div className="alert alert-info">
              <h4>Verify Your Email Address</h4>
              <p>
                A verification link has been sent to <strong>{email}</strong>.
                Please check your email and click the link to verify your
                account.
              </p>

              {verificationSent && (
                <div className="alert alert-success mt-2">
                  Verification email sent successfully!
                </div>
              )}

              <button
                className="btn btn-link p-0"
                onClick={async () => {
                  try {
                    await axiosRequest(
                      "post",
                      "/email/verification-notification"
                    );
                    setVerificationSent(true);
                  } catch (error) {
                    console.error("Failed to resend:", error);
                    alert("Failed to resend verification email");
                  }
                }}
              >
                Didn't receive the email? Click here to resend
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
