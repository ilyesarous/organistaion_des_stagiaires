import { Card, Row, Col, Button } from "react-bootstrap";
import { FaDownload } from "react-icons/fa";

interface EtudiantDetailsProps {
  etudiant: {
    cv: string;
    convention: string;
    letterAffectation: string;
    autreFichier: string
    facultee_id: number;
    sujet_id: number | null;
  };
}

const EtudiantDetails: React.FC<EtudiantDetailsProps> = ({ etudiant }) => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const baseUrl = `${apiUrl}/storage/`;

  const renderDownload = (label: string, path: string) => (
    <Button
      as="a"
      href={`${baseUrl}${path}`}
      download
      target="_blank"
      rel="noopener noreferrer"
      variant="outline-primary"
      className="d-flex align-items-center gap-2 mb-2"
    >
      <FaDownload /> Télécharger {label}
    </Button>
  );

  return (
    <Card className="mt-4 shadow-sm rounded-4 p-4">
      <h5 className="mb-4">Informations Étudiant</h5>
      <Row>
        <Col md={6}>
          {etudiant.cv && renderDownload("le CV", etudiant.cv)}
          {etudiant.convention && renderDownload("la Convention", etudiant.convention)}
          {etudiant.letterAffectation &&
            renderDownload("la Lettre d'affectation", etudiant.letterAffectation)}
          {etudiant.autreFichier &&
            renderDownload("la Lettre d'affectation", etudiant.autreFichier)}
        </Col>
        <Col md={6}>
          <p>
            <strong>Faculté ID:</strong> {etudiant.facultee_id}
          </p>
          <p>
            <strong>Sujet ID:</strong>{" "}
            {etudiant.sujet_id ?? <em className="text-muted">Non défini</em>}
          </p>
        </Col>
      </Row>
    </Card>
  );
};

export default EtudiantDetails;
