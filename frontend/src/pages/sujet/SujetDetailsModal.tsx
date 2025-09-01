import { Card, Button, Badge, Row, Col, ListGroup } from "react-bootstrap";
import { MdEdit } from "react-icons/md";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { UpdateSujetModal } from "./UpdateSujetModal";
import { AssignEtudiantModal } from "./AssignEtudiantModal";
import { axiosRequest } from "../../apis/AxiosHelper";
import type { Sujet } from "../../models/Sujet";
import type { Etudiant, User } from "../../models/User";
import { SujetActions } from "./Redux/SujetSlice";
import { RemoveEtudiantModal } from "./RemoveEtudiantModal";
import { BsDash } from "react-icons/bs";
import { IoIosArrowBack } from "react-icons/io";

interface Props {
  sujet: Sujet;
  onNavigateBack: (index: number) => void;
  breadcrumbIndex: number;
}

export const SujetDetailsView = ({
  sujet,
  onNavigateBack,
  breadcrumbIndex,
}: Props) => {
  const dispatch = useDispatch();
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [employee, setEmployee] = useState<User>();
  const [etudiants, setEtudiants] = useState<User[]>([]);
  const [etudiantsInfos, setEtudiantsInfos] = useState<Etudiant[]>([]);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [etudiantToRemove, setEtudiantToRemove] = useState<User | null>(null);

  // Fetch employee
  const fetchEmployee = async () => {
    try {
      const res = await axiosRequest(
        "get",
        `sujet/getEmployeeById/${sujet.employee_id}`
      );
      setEmployee(res.data.employee);
    } catch {
      setEmployee(undefined);
    }
  };

  // Fetch students assigned to the sujet
  const fetchEtudiants = async () => {
    try {
      const res = await axiosRequest(
        "get",
        `sujet/getEtudiantById/${sujet.id}`
      );
      setEtudiants(res.data.etudiants || []);
      setEtudiantsInfos(res.data.etudiantInfos || []);
    } catch {
      setEtudiants([]);
      setEtudiantsInfos([]);
    }
  };

  useEffect(() => {
    fetchEmployee();
    fetchEtudiants();
  }, [sujet]);

  // Handle updating Redux store after UpdateSujetModal
  const handleUpdateSuccess = (updatedSujet: Sujet) => {
    dispatch(SujetActions.updateSujet(updatedSujet)); // update Redux
    fetchEtudiants(); // refresh students
    setShowUpdateModal(false);
  };

  return (
    <>
      <Card className="shadow-sm border-0 rounded mb-3">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <Button
            variant="outline-secondary"
            size="sm"
            className="d-flex align-items-center shadow-sm gap-2 p-2"
            onClick={() => onNavigateBack(breadcrumbIndex - 1)}
          >
            <IoIosArrowBack size={18} />
          </Button>
          <span className="fw-bold fs-5">{sujet.title}</span>
          <Button
            variant="outline-secondary"
            size="sm"
            className="d-flex align-items-center gap-2 shadow-sm p-2 "
            onClick={(e) => {
              e.stopPropagation();
              setShowUpdateModal(true);
            }}
          >
            <MdEdit size={16} />
          </Button>
        </Card.Header>

        <Card.Body className="d-flex flex-column gap-3">
          <Row>
            <Col md={6}>
              <p>
                <strong>ID:</strong> {sujet.id}
              </p>
              <p>
                <strong>Status:</strong> {sujet.status}
              </p>
              <p>
                <strong>Compétances:</strong> {sujet.competences}
              </p>
              <p>
                <strong>Durée:</strong> {sujet.duree}
              </p>
              <p>
                <strong>Nombre d'étudiants:</strong> {sujet.nbEtudiants}
              </p>
            </Col>
            <Col md={6}>
              <p className="d-flex gap-3 align-items-center">
                <strong>Code Source:</strong>
                {sujet.lien ? (
                  <a
                    href={sujet.lien}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    click here Link
                  </a>
                ) : (
                  "Aucun lien"
                )}
              </p>
              <p>
                <strong>Encadrant:</strong>
              </p>
              <ListGroup>
                {employee ? (
                  <ListGroup.Item>
                    {employee.nom} {employee.prenom} ({employee.email})
                  </ListGroup.Item>
                ) : (
                  <ListGroup.Item>Aucun encadrant assigné</ListGroup.Item>
                )}
              </ListGroup>
              <p className="mt-2 d-flex justify-content-between align-items-center">
                <strong>Etudiants:</strong>
                <Button
                  size="sm"
                  variant="success"
                  onClick={() => setShowAssignModal(true)}
                >
                  + Assigner
                </Button>
              </p>
              <ListGroup>
                {etudiants.length > 0 ? (
                  etudiants.map((etudiant, index) => {
                    const etudiantInfo = etudiantsInfos[index]; // assuming same order
                    const hasAccess = etudiantInfo?.hasAccess ?? true;

                    return (
                      <ListGroup.Item
                        key={etudiant.id}
                        className="d-flex justify-content-between align-items-center"
                      >
                        <span
                          style={{
                            textDecoration: hasAccess ? "none" : "line-through",
                          }}
                        >
                          {etudiant.nom} {etudiant.prenom} ({etudiant.email})
                        </span>

                        <Button
                          size="sm"
                          variant="link"
                          onClick={() => {
                            setEtudiantToRemove(etudiant);
                            setShowRemoveModal(true);
                          }}
                        >
                          <BsDash color="red" />
                        </Button>
                      </ListGroup.Item>
                    );
                  })
                ) : (
                  <ListGroup.Item>Aucun étudiant assigné</ListGroup.Item>
                )}
              </ListGroup>
            </Col>
            <p>
              <strong>Description:</strong>
            </p>
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
          </Row>

          <div className="d-flex gap-2 mt-3">
            <Badge bg="info">{sujet.typeStage}</Badge>
            <Badge bg="secondary">
              {new Date(sujet.created_at).getFullYear()}
            </Badge>
          </div>
        </Card.Body>
      </Card>

      {/* Update Sujet Modal */}
      <UpdateSujetModal
        show={showUpdateModal}
        onHide={() => setShowUpdateModal(false)}
        onSuccess={handleUpdateSuccess}
        sujet={sujet}
      />

      {/* Assign Etudiant Modal */}
      <AssignEtudiantModal
        show={showAssignModal}
        onHide={() => setShowAssignModal(false)}
        sujet={sujet}
        onAssignSuccess={fetchEtudiants} // refresh students after assigning
      />
      {etudiantToRemove && (
        <RemoveEtudiantModal
          show={showRemoveModal}
          onHide={() => setShowRemoveModal(false)}
          etudiant={etudiantToRemove}
          sujet={sujet}
          onRemoveSuccess={fetchEtudiants} // refresh list after removing
        />
      )}
    </>
  );
};
