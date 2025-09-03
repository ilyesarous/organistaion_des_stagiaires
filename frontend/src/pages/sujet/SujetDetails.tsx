import { Card, Col, Form, Row, Alert, Button } from "react-bootstrap";
import { useEffect, useState } from "react";
import { axiosRequest } from "../../apis/AxiosHelper";
import type { Sujet } from "../../models/Sujet";
import type { User } from "../../models/User";
import { LoadingIndicator } from "../../components/Loading";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../tools/redux/Store";
import { SujetActions } from "./Redux/SujetSlice";

declare global {
  interface Window {
    gapi: any;
    google: any;
  }
}

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
const SCOPE = "https://www.googleapis.com/auth/drive.file";

interface Props {
  sujetId: number | null;
}

export const SujetDetails = ({ sujetId }: Props) => {
  const [employee, setEmployee] = useState<User>();
  const [etudiants, setEtudiants] = useState<User[]>([]);
  const [sujet, setSujet] = useState<Sujet>();
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [sujetLien, setSujetLien] = useState<string>("");
  const googleAccessToken = useSelector((state: RootState) => state.sujet.googleAccessToken);
  const [accessToken, setAccessToken] = useState<string>(
    googleAccessToken || ""
  );
  const [uploading, setUploading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  // Initialize Google API client
  useEffect(() => {
    if (!window.gapi) return;

    window.gapi.load("client", async () => {
      await window.gapi.client.init({
        apiKey: API_KEY,
        discoveryDocs: [
          "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest",
        ],
      });
    });
  }, []);

  // Fetch sujet, employee, etudiants
  useEffect(() => {
    if (!sujetId) return;

    const fetchSujetDetails = async () => {
      setLoading(true);
      try {
        const sujetRes = await axiosRequest("get", `sujet/${sujetId}`);
        if (!sujetRes.data.data) {
          setError("Sujet introuvable.");
          setLoading(false);
          return;
        }
        const fetchedSujet = sujetRes.data.data;
        setSujet(fetchedSujet);
        setSujetLien(fetchedSujet.lien || "");

        const empRes = await axiosRequest(
          "get",
          `sujet/getEmployeeById/${fetchedSujet.employee_id}`
        );
        setEmployee(empRes.data.employee);

        const etuRes = await axiosRequest(
          "get",
          `sujet/getEtudiantById/${sujetId}`
        );
        setEtudiants(etuRes.data.etudiants || []);
      } catch (err) {
        setError("Erreur lors du chargement des données.");
      } finally {
        setLoading(false);
      }
    };

    fetchSujetDetails();
  }, [sujetId]);

  // Update lien du code source
  const handleUpdateLien = async () => {
    if (!sujetId || !sujet) return;
    try {
      await axiosRequest("put", `sujet/update/${sujetId}`, {
        ...sujet,
        lien: sujetLien,
      });
      alert("Lien mis à jour avec succès !");
    } catch (err) {
      alert("Erreur lors de la mise à jour du lien.");
    }
  };

  // Step 1: Get Access Token
  const handleGetToken = () => {
    if (!window.google) {
      alert("Google API not loaded yet!");
      return;
    }
    if (accessToken) {
      handleUploadFile();
    } else {
      const tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPE,
        callback: (tokenResponse: any) => {
          if (!tokenResponse?.access_token) {
            alert("Failed to get access token");
            return;
          }
          setAccessToken(tokenResponse.access_token);
          dispatch(
            SujetActions.setGoogleAccessToken(tokenResponse.access_token)
          );
          alert("✅ Access token obtenu !");
        },
      });

      tokenClient.requestAccessToken({ prompt: "consent" });
    }
  };

  // Step 2: Open File Picker & Upload ZIP
  const handleUploadFile = () => {
    if (!accessToken) {
      alert("Vous devez d'abord obtenir un access token !");
      return;
    }

    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".zip";

    input.onchange = async (e: any) => {
      const file = e.target.files[0];
      if (!file) return;

      setUploading(true);

      const metadata = { name: file.name, mimeType: file.type };
      const form = new FormData();
      form.append(
        "metadata",
        new Blob([JSON.stringify(metadata)], { type: "application/json" })
      );
      form.append("file", file);

      try {
        const res = await fetch(
          "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id",
          {
            method: "POST",
            headers: { Authorization: `Bearer ${accessToken}` },
            body: form,
          }
        );

        const data = await res.json();
        const link = `https://drive.google.com/file/d/${data.id}/view?usp=sharing`;
        setSujetLien(link);
        alert("✅ Fichier uploadé sur Google Drive !");
      } catch (err) {
        console.error(err);
        alert("Erreur lors de l'upload du fichier.");
      } finally {
        setUploading(false);
      }
    };

    input.click();
  };

  if (loading) return <LoadingIndicator />;

  if (error)
    return (
      <Alert variant="danger" className="mt-3">
        {error}
      </Alert>
    );

  if (!sujet)
    return (
      <Alert variant="warning" className="mt-3">
        Aucun sujet sélectionné.
      </Alert>
    );

  return (
    <Card className="p-4 shadow-sm mt-3 border-0">
      <Card.Title className="mb-4 text-primary fs-4">
        Détails du Sujet
      </Card.Title>
      <Form>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Titre</Form.Label>
              <Form.Control value={sujet.title} readOnly />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Compétences</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={sujet.competences}
                readOnly
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Type</Form.Label>
              <Form.Control value={sujet.typeStage} readOnly />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Durée</Form.Label>
              <Form.Control value={`${sujet.duree} mois`} readOnly />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Date Debut</Form.Label>
              <Form.Control value={new Date(sujet.date_debut).toLocaleDateString("fr-FR")} readOnly />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Date fin</Form.Label>
              <Form.Control value={new Date(sujet.date_fin).toLocaleDateString("fr-FR")} readOnly />
            </Form.Group>
          </Col>

          <Col md={6}>
          <Form.Group className="mb-3">
              <Form.Label>Nombre d'Étudiants</Form.Label>
              <Form.Control value={sujet.nbEtudiants} readOnly />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Encadrant</Form.Label>
              <Form.Control
                value={
                  employee
                    ? `${employee.nom} ${employee.prenom} (${employee.email})`
                    : "Aucun encadrant assigné"
                }
                readOnly
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Étudiants Assignés</Form.Label>
              <Form.Control
                as="textarea"
                rows={Math.max(etudiants.length, 1)}
                value={
                  etudiants.length
                    ? etudiants
                        .map((e) => `${e.nom} ${e.prenom} (${e.email})`)
                        .join("\n")
                    : "Aucun étudiant assigné"
                }
                readOnly
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Control value={sujet.status} readOnly />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Lien du Code Source</Form.Label>
              <div className="d-flex gap-2">
                <Form.Control
                  value={sujetLien || ""}
                  onChange={(e) => setSujetLien(e.target.value)}
                  placeholder="Lien Google Drive"
                />
              </div>
            </Form.Group>

            <div className="d-flex justify-content-between mb-3">
              <Button variant="outline-primary" onClick={handleGetToken}>
                {uploading ? "Uploading..." : "Upload code source (.zip)"}
              </Button>
              <Button
                variant="primary"
                onClick={handleUpdateLien}
                disabled={uploading}
              >
                Mettre à jour le lien
              </Button>
            </div>
          </Col>

          <Form.Group className="mb-3 mt-3">
            <Form.Label>Description</Form.Label>
            <div
              className="border rounded p-2 bg-light"
              style={{
                minHeight: "200px",
                maxHeight: "500px",
                overflowY: "auto",
              }}
              dangerouslySetInnerHTML={{
                __html: sujet.description || "<em>Pas de description</em>",
              }}
            />
          </Form.Group>
        </Row>
      </Form>
    </Card>
  );
};
