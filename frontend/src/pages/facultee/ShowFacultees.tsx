import { useEffect, useState } from "react";
import { Container, Alert, Card } from "react-bootstrap";
import { axiosRequest } from "../../apis/AxiosHelper";
import { LoadingIndicator } from "../../components/Loading";
import { TableHeader } from "../../components/tableComponents/TableHeader";
import { EmptyState } from "../../components/tableComponents/EmptyState";
import { DisplayTable } from "./DisplayTableFacultee";
import { TableFooter } from "../../components/tableComponents/TableFooter";
import type { Facultee } from "../../models/Facultee";
import { AddNewFacultee } from "./AddFacultee";
import { FaculteeDetailsModal } from "./FaculteeDetailsModal";
import { getItem } from "../../tools/localStorage";

export const FaculteeList = () => {
  const [facultees, setFacultees] = useState<Facultee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedFacultee, setSelectedFacultee] = useState<Facultee>();
   const role = getItem("type");

  const handleSuccess = () => {
    fetchFacultees();
    setShowModal(false);
  };

  const fetchFacultees = async () => {
    try {
      const response = await axiosRequest("get", "facultee");
      setFacultees(response.data.facultes);
    } catch (err) {
      setError("Failed to fetch sociétés. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFacultees();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this facultée?"))
      return;

    setDeleteId(id);
    try {
      await axiosRequest("delete", `facultee/delete/${id}`);
      setFacultees(facultees.filter((facultee) => facultee.id !== id));
    } catch (err) {
      setError("Failed to delete société. Please try again.");
    } finally {
      setDeleteId(null);
    }
  };

  const handleDetails = async (id: number) => {
    await axiosRequest("get", `facultee/details/${id}`).then((res) => {
      setSelectedFacultee(res.data.facultes); 
      setShowDetailsModal(true);
    });
  };

  const filteredFacultees = facultees.filter(
    (facultee) =>
      facultee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      facultee.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      facultee.email.toLowerCase().includes(searchTerm.toLowerCase())
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
            name="Facultées"
            role={role}
            onAddClick={() => setShowModal(true)}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />
        </Card.Header>

        <Card.Body className="p-0">
          {filteredFacultees.length === 0 ? (
            <EmptyState searchTerm={searchTerm} name="société" />
          ) : (
            <DisplayTable
              facultees={filteredFacultees}
              onDelete={handleDelete}
              deleteId={deleteId}
              details={handleDetails}
            />
          )}
        </Card.Body>

        {filteredFacultees.length > 0 && (
          <Card.Footer className="bg-white border-0 py-3">
            <TableFooter
              filteredCount={filteredFacultees.length}
              totalCount={facultees.length}
            />
          </Card.Footer>
        )}
      </Card>

      <AddNewFacultee
        show={showModal}
        onHide={() => setShowModal(false)}
        onSuccess={handleSuccess}
      />
      <FaculteeDetailsModal
        show={showDetailsModal}
        onHide={() => setShowDetailsModal(false)}
        facultee={selectedFacultee ? selectedFacultee : null}
      />
    </Container>
  );
};
