import { useEffect, useState } from "react";
import { Container, Alert, Card } from "react-bootstrap";
import { axiosRequest } from "../../apis/AxiosHelper";
import { LoadingIndicator } from "../../components/Loading";
import { TableHeader } from "../../components/tableComponents/TableHeader";
import { EmptyState } from "../../components/tableComponents/EmptyState";
import { DisplayTable } from "./DisplayTableSociete";
import { TableFooter } from "../../components/tableComponents/TableFooter";
import type { Societe } from "../../models/Societe";
import { SocieteDetailsModal } from "./SocieteDetailsModal";
import { fetchSocietes } from "./Redux/SocieteThunk";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../tools/redux/Store";
import { SocieteActions } from "./Redux/SocieteSlice";
import { getItem } from "../../tools/localStorage";
import AddSocieteModal from "./AddSociete";

export const SocieteList = () => {
  const societes = useSelector((state: RootState) => state.societe.societe);
  const societeStatus = useSelector((state: RootState) => state.societe.status);
  let societeError = useSelector((state: RootState) => state.societe.error);
  const dispatch = useDispatch<AppDispatch>();

  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedSociete, setSelectedSociete] = useState<Societe>();
   const role = getItem("type");

  const handleSuccess = () => {
    setShowModal(false);
    dispatch(fetchSocietes());
  };

  useEffect(() => {
    if (societeStatus === "idle") {
      dispatch(fetchSocietes());
    }
  }, [societeStatus, dispatch]);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this société?"))
      return;

    setDeleteId(id);
    try {
      await axiosRequest("delete", `societe/delete/${id}`);
      dispatch(SocieteActions.deleteSociete(id));
    } catch (err) {
      societeError = "Failed to delete société. Please try again.";
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

  if (societeStatus === "loading") return <LoadingIndicator />;
  if (societeStatus === "failed")
    return (
      <Alert variant="danger" onClose={() => societeError = null} dismissible>
        {societeError}
      </Alert>
    );

  return (
    <Container fluid className="px-4 py-3">
      <Card className="border-0 shadow-sm">
        <Card.Header className="bg-white border-0 py-3">
          <TableHeader
            name="Sociétés"
            role={role}
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

      <AddSocieteModal
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
