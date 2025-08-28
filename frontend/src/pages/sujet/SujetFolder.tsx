import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Alert, Card, Nav, Tab, Collapse } from "react-bootstrap";
import type { AppDispatch, RootState } from "../../tools/redux/Store";
import type { Sujet } from "../../models/Sujet";
import { fetchSujets } from "./Redux/SujetReduxThunk";
import { TableHeader } from "../../components/tableComponents/TableHeader";
import { getItem } from "../../tools/localStorage";
import { AddNewSujet } from "./AddSujet";
import { EmptyState } from "../../components/tableComponents/EmptyState";
import { DisplayTable } from "./DisplayTableSujet";
import { LoadingIndicator } from "../../components/Loading";
import { axiosRequest } from "../../apis/AxiosHelper";
import { SujetActions } from "./Redux/SujetSlice";
import { SujetDetailsModal } from "./SujetDetailsModal";
import { UpdateSujetModal } from "./UpdateSujetModal";

export const SujetFolders = () => {
  const sujets = useSelector((state: RootState) => state.sujet.sujets);
  const sujetStatus = useSelector((state: RootState) => state.sujet.status);
  let error = useSelector((state: RootState) => state.sujet.error);
  const dispatch = useDispatch<AppDispatch>();

  const grouped = groupBySessionAndType(sujets);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSujet, setSelectedSujet] = useState<Sujet>();
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const role = getItem("type");

  const [openSessions, setOpenSessions] = useState<Record<string, boolean>>({});

  function getSession(created_at: string): string {
    const year = new Date(created_at).getFullYear();
    return `${year}-${year + 1}`;
  }
  function groupBySessionAndType(sujets: Sujet[]) {
    return sujets.reduce(
      (acc: Record<string, Record<string, Sujet[]>>, sujet) => {
        const session = getSession(sujet.created_at);
        if (!acc[session]) acc[session] = {};
        if (!acc[session][sujet.typeStage]) acc[session][sujet.typeStage] = [];
        acc[session][sujet.typeStage].push(sujet);
        return acc;
      },
      {}
    );
  }

  const toggleSession = (session: string) =>
    setOpenSessions((prev) => ({ ...prev, [session]: !prev[session] }));

  useEffect(() => {
    if (sujetStatus === "idle") {
      dispatch(fetchSujets());
    }
  }, [sujetStatus, dispatch]);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this société?"))
      return;
    setDeleteId(id);
    try {
      await axiosRequest("delete", `sujet/delete/${id}`);
      dispatch(SujetActions.deleteSujet(id));
    } catch (err) {
      error = "Failed to delete société. Please try again.";
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

  const handleEditClick = (sujet: Sujet) => {
    setSelectedSujet(sujet);
    setShowUpdateModal(true);
  };

  if (sujetStatus === "loading") return <LoadingIndicator />;
  if (sujetStatus === "failed")
    return (
      <Alert variant="danger" onClose={() => (error = "")} dismissible>
        {error}
      </Alert>
    );

  return (
    <div className="d-flex flex-column gap-3">
      <Card.Header className="bg-white border-0 py-3">
        <TableHeader
          name="Sujets"
          role={role}
          onAddClick={() => setShowModal(true)}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
      </Card.Header>

      {Object.entries(grouped).map(([session, types]) => (
        <Card key={session} className="shadow-sm border-0">
          <Card.Header
            onClick={() => toggleSession(session)}
            className="d-flex justify-content-between align-items-center bg-light"
            style={{ cursor: "pointer" }}
          >
            <span>
              <i
                className={`bi ${
                  openSessions[session] ? "bi-folder2-open" : "bi-folder"
                } me-2 text-primary`}
              />
              Session {session}
            </span>
            <small className="text-muted">
              {Object.values(types).reduce((a, b) => a + b.length, 0)} sujets
            </small>
          </Card.Header>
          <Collapse in={openSessions[session]}>
            <div>
              <Card.Body>
                <Tab.Container defaultActiveKey={Object.keys(types)[0]}>
                  <Nav variant="tabs" className="mb-3">
                    {Object.keys(types).map((type) => (
                      <Nav.Item key={type}>
                        <Nav.Link eventKey={type}>{type}</Nav.Link>
                      </Nav.Item>
                    ))}
                  </Nav>

                  <Tab.Content>
                    {Object.entries(types).map(([type, sujets]) => (
                      <Tab.Pane eventKey={type} key={type}>
                        {sujets.length === 0 ? (
                          <EmptyState searchTerm={searchTerm} name="sujet" />
                        ) : (
                          <DisplayTable
                            sujets={sujets}
                            onDelete={handleDelete}
                            deleteId={deleteId}
                            Details={handleDetails}
                            onUpdate={handleEditClick}
                          />
                        )}
                      </Tab.Pane>
                    ))}
                  </Tab.Content>
                </Tab.Container>
              </Card.Body>
            </div>
          </Collapse>
        </Card>
      ))}

      <AddNewSujet
        show={showModal}
        onHide={() => setShowModal(false)}
        onSuccess={() => setShowModal(false)}
      />
      <SujetDetailsModal
        show={showDetailsModal}
        onHide={() => setShowDetailsModal(false)}
        sujet={selectedSujet ? selectedSujet : null}
      />
      <UpdateSujetModal
        show={showUpdateModal}
        onHide={() => setShowUpdateModal(false)}
        onSuccess={() => setShowUpdateModal(false)}
        sujet={selectedSujet!}
      />
    </div>
  );
};
