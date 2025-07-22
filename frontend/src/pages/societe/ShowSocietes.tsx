import { useEffect, useState } from "react";
import { Container, Alert, Card } from "react-bootstrap";
import { axiosRequest } from "../../apis/AxiosHelper";
import { AddNewSociete } from "./AddSociete";
import { LoadingIndicator } from "../../components/Loading";
import { TableHeader } from "../../components/tableComponents/TableHeader";
import { EmptyState } from "../../components/tableComponents/EmptyState";
import { DisplayTable } from "./DisplayTableSociete";
import { TableFooter } from "../../components/tableComponents/TableFooter";
import type { Societe } from "../../models/Societe";
import { SocieteDetailsModal } from "./SocieteDetailsModal";

export const SocieteList = () => {
  const [societes, setSocietes] = useState<Societe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedSociete, setSelectedSociete] = useState<Societe>();

  const handleSuccess = () => {
    fetchSocietes();
    setShowModal(false);
  };

  const fetchSocietes = async () => {
    try {
      const response = await axiosRequest("get", "societe");
      setSocietes(response.data.societes);
    } catch (err) {
      setError("Failed to fetch sociétés. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSocietes();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this société?"))
      return;

    setDeleteId(id);
    try {
      await axiosRequest("delete", `societe/delete/${id}`);
      setSocietes(societes.filter((societe) => societe.id !== id));
    } catch (err) {
      setError("Failed to delete société. Please try again.");
    } finally {
      setDeleteId(null);
    }
  };

  const handleDetails = async (id: number) => {
    await axiosRequest("get", `societe/details/${id}`).then((res) => {
      setSelectedSociete(res.data.societe[0]);
      setShowDetailsModal(true);
    });
  };

  const filteredSocietes = societes.filter(
    (societe) =>
      societe.raison_sociale.toLowerCase().includes(searchTerm.toLowerCase()) ||
      societe.matricule_fiscale
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      societe.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <LoadingIndicator />;
  if (error)
    return (
      <Alert variant="danger" onClose={() => setError(null)} dismissible>
        {error}
      </Alert>
    );

  return (
    <Container fluid className="px-4 py-3">
      <Card className="border-0 shadow-sm">
        <Card.Header className="bg-white border-0 py-3">
          <TableHeader
            name="Sociétés"
            onAddClick={() => setShowModal(true)}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />
        </Card.Header>

        <Card.Body className="p-0">
          {filteredSocietes.length === 0 ? (
            <EmptyState searchTerm={searchTerm} name="société" />
          ) : (
            <DisplayTable
              societes={filteredSocietes}
              onDelete={handleDelete}
              deleteId={deleteId}
              Details={handleDetails}
            />
          )}
        </Card.Body>

        {filteredSocietes.length > 0 && (
          <Card.Footer className="bg-white border-0 py-3">
            <TableFooter
              filteredCount={filteredSocietes.length}
              totalCount={societes.length}
            />
          </Card.Footer>
        )}
      </Card>

      <AddNewSociete
        show={showModal}
        onHide={() => setShowModal(false)}
        onSuccess={handleSuccess}
      />
      <SocieteDetailsModal
        show={showDetailsModal}
        onHide={() => setShowDetailsModal(false)}
        societe={selectedSociete ? selectedSociete : null}
      />
    </Container>
  );
};
