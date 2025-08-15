// src/components/SocieteDetailsModal.tsx
import { Modal, Button, Row, Col } from "react-bootstrap";
import type { Sujet } from "../../models/Sujet";
import { useEffect, useState } from "react";
import { axiosRequest } from "../../apis/AxiosHelper";
import type { User } from "../../models/User";

interface Props {
  show: boolean;
  onHide: () => void;
  sujet: Sujet | null;
}

export const SujetDetailsModal = ({ show, onHide, sujet }: Props) => {
  if (!sujet) return null;

  const [employee, setEmployee] = useState<User>();
  const [etudiants, setEtudiant] = useState<User[]>([]);

  const fetchEmployee = async () => {
    const res = await axiosRequest(
      "get",
      `sujet/getEmployeeById/${sujet.employee_id}`
    );
    setEmployee(res.data.employee);
  };
  const fetchEtudiant = async () => {
    await axiosRequest("get", `sujet/getEtudiantById/${sujet.id}`).then(
      (res) => {
        if (res.data.etudiants) {
          setEtudiant(res.data.etudiants);
        } else {
          setEtudiant([]);
        }
      }
    );
  };

  useEffect(() => {
    if (show) {
      fetchEmployee();
      fetchEtudiant();
    }
  }, [sujet]);

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Détails du Sujet</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Row>
          <Col md={6}>
            <p>
              <strong>ID:</strong> {sujet.id}
            </p>
            <p>
              <strong>Titre:</strong> {sujet.title}
            </p>
            <p>
              <strong>Competances:</strong> {sujet.competences}
            </p>
            <p>
              <strong>Description:</strong> {sujet.description}
            </p>
            <p>
              <strong>Type:</strong> {sujet.typeStage}
            </p>
            <p>
              <strong>Durée:</strong> {sujet.duree}
            </p>
            <p>
              <strong>Nomber Etudiant:</strong> {sujet.nbEtudiants}
            </p>
          </Col>
          <Col md={6}>
            <span>
              <strong>Encadrant:</strong>
              <ul>
                {employee ? (
                  <li>
                    {employee.nom} {employee.prenom} ({employee.email})
                  </li>
                ) : (
                  <li>Aucun encadrant assigné</li>
                )}
              </ul>
            </span>
            <strong>Etudiants:</strong>
            <ul>
              {etudiants && etudiants.length > 0 ? (
                etudiants.map((etudiant) => (
                  <li key={etudiant.id}>
                    {etudiant.nom} {etudiant.prenom} ({etudiant.email})
                  </li>
                ))
              ) : (
                <li>Aucun étudiant assigné</li>
              )}
            </ul>
            <p>
              <strong>Status:</strong> {sujet.status}
            </p>
            <p>
              <strong>Code Source:</strong>{" "}
              {sujet.lien ? sujet.lien : "not defined"}
            </p>
          </Col>
        </Row>
      </Modal.Body>

      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={() => {
            setEtudiant([]);
            setEmployee(undefined);
            onHide();
          }}
        >
          Fermer
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
