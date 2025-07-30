import { useEffect, useState } from "react";
import { Container, Alert, Card } from "react-bootstrap";
import { axiosRequest } from "../../apis/AxiosHelper";
import { AddNewSujet } from "./AddSujet";
import { LoadingIndicator } from "../../components/Loading";
import { TableHeader } from "../../components/tableComponents/TableHeader";
import { EmptyState } from "../../components/tableComponents/EmptyState";
import { DisplayTable } from "./DisplayTableSujet";
import { TableFooter } from "../../components/tableComponents/TableFooter";
import { SujetDetailsModal } from "./SujetDetailsModal";
import type { Sujet } from "../../models/Sujet";
import { UpdateSujetModal } from "./UpdateSujetModal";

export const SujetList = () => {
  const [sujet, setSujet] = useState<Sujet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedSujet, setSelectedSujet] = useState<Sujet>();
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  const handleEditClick = (sujet: Sujet) => {
    setSelectedSujet(sujet);
    setShowUpdateModal(true);
  };

  const handleSuccess = () => {
    fetchSujet();
    setShowModal(false);
  };

  const fetchSujet = async () => {
    try {
      const response = await axiosRequest("get", "sujet");
      setSujet(response.data.data);
    } catch (err) {
      setError("Failed to fetch sujets. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSujet();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this société?"))
      return;
    setDeleteId(id);
    try {
      await axiosRequest("delete", `sujet/delete/${id}`);
      setSujet(sujet.filter((sujet) => sujet.id !== id));
    } catch (err) {
      setError("Failed to delete société. Please try again.");
    } finally {
      setDeleteId(null);
    }
  };

  const handleDetails = async (id: number) => {
    await axiosRequest("get", `sujet/${id}`).then((res) => {
      setSelectedSujet(res.data.data);
      setShowDetailsModal(true);
    });
  };

  const filteredSujet = sujet.filter(
    (sujet) =>
      sujet.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sujet.competences.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sujet.typeStage.toLowerCase().includes(searchTerm.toLowerCase())
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
            name="Sujets"
            onAddClick={() => setShowModal(true)}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />
        </Card.Header>

        <Card.Body className="p-0">
          {filteredSujet.length === 0 ? (
            <EmptyState searchTerm={searchTerm} name="société" />
          ) : (
            <DisplayTable
              sujets={filteredSujet}
              onDelete={handleDelete}
              deleteId={deleteId}
              Details={handleDetails}
              onUpdate={handleEditClick}
            />
          )}
        </Card.Body>

        {filteredSujet.length > 0 && (
          <Card.Footer className="bg-white border-0 py-3">
            <TableFooter
              filteredCount={filteredSujet.length}
              totalCount={sujet.length}
            />
          </Card.Footer>
        )}
      </Card>

      <AddNewSujet
        show={showModal}
        onHide={() => setShowModal(false)}
        onSuccess={handleSuccess}
      />
      <SujetDetailsModal
        show={showDetailsModal}
        onHide={() => setShowDetailsModal(false)}
        sujet={selectedSujet ? selectedSujet : null}
      />
      <UpdateSujetModal
        show={showUpdateModal}
        onHide={() => setShowUpdateModal(false)}
        onSuccess={handleSuccess}
        sujet={selectedSujet!}
      />
    </Container>
  );
};
