import { useEffect, useState } from "react";
import { Container, Card, Alert } from "react-bootstrap";
import { axiosRequest } from "../../apis/AxiosHelper";
import { LoadingIndicator } from "../../components/Loading";
import { TableHeader } from "../../components/tableComponents/TableHeader";
import { EmptyState } from "../../components/tableComponents/EmptyState";
import { DisplayTable } from "./DisplayTableAttestation";
import { TableFooter } from "../../components/tableComponents/TableFooter";
import { getItem } from "../../tools/localStorage";
import AddAttestationModal from "./AttestationForm";
import { AttestationDetailsModal } from "./AttestationModelDetails";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../tools/redux/Store";
import { fetchAttestations } from "./attestationRedux/AttestationThunkRedux";
import { AttestationActions } from "./attestationRedux/AttestationSlice";

export const AttestationList = () => {
  const attestations = useSelector(
    (state: RootState) => state.attestation.attestations
  );
  const status = useSelector((state: RootState) => state.attestation.status);
  let error = useSelector((state: RootState) => state.attestation.error);
  const dispatch = useDispatch<AppDispatch>();

  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedAttestation, setSelectedAttestation] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const role = getItem("type");

  useEffect(() => {
    if (status === "idle")
      dispatch(fetchAttestations());
  }, [dispatch, attestations]);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Supprimer cette attestation ?")) return;
    setDeleteId(id);
    try {
      await axiosRequest("delete", `attestation/${id}`);
      dispatch(AttestationActions.deleteAttestation(id));
    } catch {
      error = "Suppression échouée.";
    } finally {
      setDeleteId(null);
    }
  };

  const handleSuccess = () => {
    setShowModal(false);
  };

  const handleDetails = async (id: number) => {
    const res = await axiosRequest("get", `attestation/${id}`);
    setSelectedAttestation(res.data.attestation);
    setShowDetailsModal(true);
  };
  const validateAttestation = async (id: number) => {
    await axiosRequest("put", `attestation/validate/${id}`).then(() => {
      dispatch(AttestationActions.validateAttestation(id));
    });
  };
  const approveAttestation = async (id: number) => {
    await axiosRequest("put", `attestation/approve/${id}`).then(() => {
      dispatch(AttestationActions.approveAttestation(id));
    });
  };

  const filteredAttestations = attestations.filter((a) =>
    a.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (status === "loading") return <LoadingIndicator />;
  if (status === "failed")
    return (
      <Alert variant="danger" onClose={() => (error = null)} dismissible>
        {error}
      </Alert>
    );

  return (
    <Container fluid className="px-4 py-3">
      <Card className="border-0 shadow-sm">
        <Card.Header className="bg-white border-0 py-3">
          <TableHeader
            name="Attestations"
            role={role}
            onAddClick={() => setShowModal(true)}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />
        </Card.Header>

        <Card.Body className="p-0">
          {filteredAttestations.length === 0 ? (
            <EmptyState searchTerm={searchTerm} name="attestation" />
          ) : (
            <DisplayTable
              attestations={filteredAttestations}
              onDelete={handleDelete}
              deleteId={deleteId}
              onDetails={handleDetails}
              onApprove={approveAttestation}
              onValidate={validateAttestation}
            />
          )}
        </Card.Body>

        {filteredAttestations.length > 0 && (
          <Card.Footer className="bg-white border-0 py-3">
            <TableFooter
              filteredCount={filteredAttestations.length}
              totalCount={attestations.length}
            />
          </Card.Footer>
        )}
      </Card>

      <AddAttestationModal
        show={showModal}
        onHide={() => setShowModal(false)}
        onSuccess={handleSuccess}
      />

      <AttestationDetailsModal
        show={showDetailsModal}
        onHide={() => setShowDetailsModal(false)}
        attestation={selectedAttestation}
      />
    </Container>
  );
};
