import axios from "axios";
import { useEffect, useRef, useState } from "react";
import type { Facultee } from "../models/Facultee";
import SignatureCanvas from "react-signature-canvas";
import { Button, Card, Col, Form, Row, Alert } from "react-bootstrap";
import { axiosRequest } from "../apis/AxiosHelper";
import { useNavigate } from "react-router-dom";

export const VerifyEmailPage = () => {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "danger" | "">("");
  const [facultes, setFacultes] = useState<Facultee[]>([]);
  const [facultee_id, setFaculteId] = useState("1");
  const [numBadge, setNumBadge] = useState("");
  const signature = useRef<SignatureCanvas>(null);
  const trimmedDataURL = useRef("");
  const [cv, setCv] = useState<File | null>(null);
  const [convention, setConvention] = useState<File | null>(null);
  const [letterAffectation, setLetterAffectation] = useState<File | null>(null);
  const [autreFichier, setAutrFicher] = useState<File | null>(null);

  const navigate = useNavigate();
  const searchParams = new URLSearchParams(window.location.search);
  const token = searchParams.get("token");
  const email = searchParams.get("email");
  const role = searchParams.get("role");

  const clearSignature = () => signature.current?.clear();
  const trimSignature = () => {
    if (signature.current && !signature.current.isEmpty()) {
      trimmedDataURL.current = signature.current
        .getCanvas()
        .toDataURL("image/png");
    }
  };

  useEffect(() => {
    axiosRequest("get", "faculteeAdmin").then((res) =>
      setFacultes(res.data.facultes)
    );
  }, []);

  const submit = async () => {
    trimSignature();
    if (password !== confirm) {
      setMessageType("danger");
      setMessage("Passwords don't match.");
      return;
    }

    const formData = new FormData();
    formData.append("email", email || "");
    formData.append("token", token || "");
    formData.append("password", password);
    formData.append("password_confirmation", confirm);

    if (role === "etudiant") {
      if (cv) formData.append("cv", cv);
      if (convention) formData.append("convention", convention);
      if (letterAffectation)
        formData.append("letterAffectation", letterAffectation);
      if (autreFichier) formData.append("autreFichier", autreFichier);
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
      setMessageType("success");
      setMessage("Account verified successfully!");
      setTimeout(() => navigate("/"), 500);
    } catch (err) {
      console.error(err);
      setMessageType("danger");
      setMessage("Error verifying account.");
    }
  };

  return (
    <Row className="justify-content-center mt-5">
      <Col md={8} lg={6}>
        <Card className="shadow border-0">
          <Card.Body>
            <h3 className="text-center mb-4">Complete Your Account Setup</h3>
            {message && (
              <Alert variant={messageType} className="py-2">
                {message}
              </Alert>
            )}

            {/* Password fields */}
            <Form.Group className="mb-3">
              <Form.Label>Mot de passe</Form.Label>
              <Form.Control
                type="password"
                placeholder="Entrez votre mot de passe"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Confirmer le mot de passe</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirmez votre mot de passe"
                onChange={(e) => setConfirm(e.target.value)}
                required
              />
            </Form.Group>

            {/* Employee Fields */}
            {role === "employee" && (
              <>
                <Form.Group className="mb-3">
                  <Form.Label>Numéro de Badge</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Entrez votre numéro de badge"
                    onChange={(e) => setNumBadge(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Signature</Form.Label>
                  <div className="border rounded">
                    <SignatureCanvas
                      canvasProps={{
                        className: "w-100",
                        height: 150,
                      }}
                      ref={signature}
                    />
                  </div>
                  <div className="d-flex justify-content-end mt-2">
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={clearSignature}
                    >
                      Clear
                    </Button>
                  </div>
                </Form.Group>
              </>
            )}

            {/* Student Fields */}
            {role === "etudiant" && (
              <>
                <Form.Group className="mb-3">
                  <Form.Label>Faculté</Form.Label>
                  <Form.Select onChange={(e) => setFaculteId(e.target.value)}>
                    <option>--Selectionnez votre facultee--</option>
                    {facultes.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>CV</Form.Label>
                  <Form.Control
                    type="file"
                    onChange={(e: any) => setCv(e.target.files?.[0])}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Convention</Form.Label>
                  <Form.Control
                    type="file"
                    onChange={(e: any) => setConvention(e.target.files?.[0])}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Lettre d’Affectation</Form.Label>
                  <Form.Control
                    type="file"
                    onChange={(e: any) =>
                      setLetterAffectation(e.target.files?.[0])
                    }
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Autre fichier</Form.Label>
                  <Form.Control
                    type="file"
                    onChange={(e: any) => setAutrFicher(e.target.files?.[0])}
                    required
                  />
                </Form.Group>
              </>
            )}

            <div className="d-grid mt-4">
              <Button variant="primary" onClick={submit}>
                Submit
              </Button>
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};
