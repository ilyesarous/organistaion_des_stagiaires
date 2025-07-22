import axios from "axios";
import { useEffect, useRef, useState } from "react";
import type { Facultee } from "../models/Facultee";
import SignatureCanvas from "react-signature-canvas";
import { Button, Form } from "react-bootstrap";
import { axiosRequest } from "../apis/AxiosHelper";
import { useNavigate } from "react-router-dom";

export const VerifyEmailPage = () => {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [facultes, setFacultes] = useState<Facultee[]>([]);
  const [facultee_id, setFaculteId] = useState("1");
  const [numBadge, setNumBadge] = useState("");
  const signature = useRef<SignatureCanvas>(null);
  const trimmedDataURL = useRef("");
  const [cv, setCv] = useState<File | null>(null);
  const [convention, setConvention] = useState<File | null>(null);
  const [letterAffectation, setLetterAffectation] = useState<File | null>(null);

  const navigate = useNavigate();
  const searchParams = new URLSearchParams(window.location.search);
  const token = searchParams.get("token");
  const email = searchParams.get("email");
  const role = searchParams.get("role");

  console.log(role);
  

  const clear = () => signature.current?.clear();
  const trim = () => {
    if (signature.current && !signature.current.isEmpty()) {
      trimmedDataURL.current = signature.current
        .getCanvas()
        .toDataURL("image/png");
    }
  };

  useEffect(() => {
    const getAllFaculties = async () => {
      await axiosRequest("get", "faculteeAdmin").then((res) =>
        setFacultes(res.data.facultes)
      );
    };

    getAllFaculties();
  }, []);

  const submit = async () => {
    trim();
    if (password !== confirm) {
      alert("Passwords don't match");
      return;
    }

    const formData = new FormData();
    formData.append("email", email ? email : "");
    formData.append("token", token ? token : "");
    formData.append("password", password);
    formData.append("password_confirmation", confirm);

    if (role === "etudiant") {
      if (cv) formData.append("cv", cv);
      if (convention) formData.append("convention", convention);
      if (letterAffectation)
        formData.append("letterAffectation", letterAffectation);
      formData.append("facultee_id", facultee_id);
    } else {
      formData.append("numBadge", numBadge);
      formData.append("signature", trimmedDataURL.current);
    }

    try {
      await axios.post(
        "http://localhost:8000/api/auth/verify-complete",
        formData
      );
      setMessage("Account verified successfully!");
      navigate("/");
    } catch (err) {
      console.error(err);
      setMessage("Error verifying account.");
    }
  };

  return (
    <div className="container">
      <h2>Set Your Password</h2>
      <Form.Label>Mot de passe</Form.Label>
      <Form.Control
        type="password"
        placeholder="Entre votre mot de passe"
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <Form.Label>Confirmer votre mot de passe</Form.Label>
      <Form.Control
        type="password"
        placeholder="Confirmer votre mot de passe"
        onChange={(e) => setConfirm(e.target.value)}
        required
      />
      {role === "employee" && (
        <>
          <Form.Label>Numero du Badge</Form.Label>
          <Form.Control
            type="text"
            placeholder="Entre votre numero de badge"
            onChange={(e) => setNumBadge(e.target.value)}
            required
          />
          <div className="d-flex flex-column mt-3">
            <Form.Label>Signature</Form.Label>

            <SignatureCanvas
              canvasProps={{ className: "border" }}
              ref={signature}
            />
            <div className="d-flex justify-content-end mt-3">
              <Button onClick={clear}>clear</Button>
            </div>
          </div>
        </>
      )}
      {role === "etudiant" && (
        <>
          <Form.Label>Facultee</Form.Label>
          <Form.Select
            onChange={(e) => {
              setFaculteId(e.target.value);
            }}
          >
            {facultes.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </Form.Select>
          <Form.Label>CV</Form.Label>
          <Form.Control
            type="file"
            onChange={(e: any) => setCv(e.target.files?.[0])}
            required
          />

          <Form.Label>Convention</Form.Label>
          <Form.Control
            type="file"
            onChange={(e: any) => setConvention(e.target.files?.[0])}
            required
          />

          <Form.Label>Lettre d’Affectation</Form.Label>
          <Form.Control
            type="file"
            onChange={(e: any) => setLetterAffectation(e.target.files?.[0])}
            required
          />
        </>
      )}
      <Button onClick={submit}>Submit</Button>
      <p>{message}</p>
    </div>
  );
};
