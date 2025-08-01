// src/components/SujetDetails.tsx
import { Card, Col, Form, Row, Alert, Badge } from "react-bootstrap";
import { useEffect, useState } from "react";
import { axiosRequest } from "../../apis/AxiosHelper";
import type { Sujet } from "../../models/Sujet";
import type { User } from "../../models/User";

interface Props {
  sujetId: number | null;
}

export const SujetDetails = ({ sujetId }: Props) => {
  const [employee, setEmployee] = useState<User>();
  const [etudiants, setEtudiants] = useState<User[]>([]);
  const [sujet, setSujet] = useState<Sujet>();
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (!sujetId) return;

    const fetchSujetDetails = async () => {
      try {
        const sujetRes = await axiosRequest("get", `sujet/${sujetId}`);
        if (!sujetRes.data.data) {
          setError("Sujet introuvable.");
          return;
        }
        const fetchedSujet = sujetRes.data.data;
        setSujet(fetchedSujet);

        const empRes = await axiosRequest(
          "get",
          `sujet/getEmployeeById/${fetchedSujet.employee_id}`
        );
        setEmployee(empRes.data.employee);

        const etuRes = await axiosRequest("get", `sujet/getEtudiantById/${sujetId}`);
        setEtudiants(etuRes.data.etudiants || []);
      } catch (err) {
        setError("Erreur lors du chargement des données.");
      }
    };

    fetchSujetDetails();
  }, [sujetId]);

  if (error) {
    return <Alert variant="danger" className="mt-3">{error}</Alert>;
  }

  if (!sujet) {
    return <Alert variant="warning" className="mt-3">Aucun sujet sélectionné.</Alert>;
  }

  return (
    <Card className="p-4 shadow-sm mt-3 border-0">
      <Card.Title className="mb-4 text-primary fs-4">
        Détails du Sujet <Badge bg="secondary">#{sujet.id}</Badge>
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
              <Form.Control as="textarea" rows={2} value={sujet.competences} readOnly />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" rows={3} value={sujet.description} readOnly />
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
              <Form.Label>Nombre d'Étudiants</Form.Label>
              <Form.Control value={sujet.nbEtudiants} readOnly />
            </Form.Group>
          </Col>

          <Col md={6}>
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
                rows={etudiants.length || 1}
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
          </Col>
        </Row>
      </Form>
    </Card>
  );
};
