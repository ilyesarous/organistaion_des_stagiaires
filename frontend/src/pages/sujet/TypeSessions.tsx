import {
  Card,
  Collapse,
  Nav,
  Tab,
  Badge,
  Button,
  Spinner,
} from "react-bootstrap";
import { CiTrash } from "react-icons/ci";
import { axiosRequest } from "../../apis/AxiosHelper";
import { SujetActions } from "./Redux/SujetSlice";
import { useState } from "react";
import type { AppDispatch } from "../../tools/redux/Store";
import { useDispatch } from "react-redux";
import type { Sujet } from "../../models/Sujet";
import { IoIosArrowBack } from "react-icons/io";

interface Props {
  session: string;
  types: Record<string, Sujet[]>;
  openSessions: Record<string, boolean>;
  onNavigateToSujet: (sujet: Sujet, typeName: string) => void;
  onNavigateToType?: (typeName: string) => void;
  onNavigateBack: (index: number) => void;
  breadcrumbIndex: number;
  activeType?: string | null;
}

const TypeSessions = ({
  session,
  types,
  openSessions,
  onNavigateToSujet,
  onNavigateToType,
  onNavigateBack,
  breadcrumbIndex,
  activeType,
}: Props) => {
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const dispatch = useDispatch<AppDispatch>();

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this sujet?")) return;
    setDeleteId(id);
    try {
      await axiosRequest("delete", `sujet/delete/${id}`);
      dispatch(SujetActions.deleteSujet(id));
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <Collapse in={openSessions[session]}>
      <div>
        <Card className="shadow-sm border-0 rounded mb-3">
          <Card.Body>
            <Button
              variant="outline-secondary"
              size="sm"
              className="mb-3 d-flex align-items-center gap-2 shadow-sm px-3 py-1"
              onClick={() => onNavigateBack(breadcrumbIndex - 1)}
            >
              <IoIosArrowBack size={18} />
              <span className="fw-semibold">Retour</span>
            </Button>

            <Tab.Container
              defaultActiveKey={activeType ?? Object.keys(types)[0]}
            >
              <Nav variant="tabs" className="mb-3">
                {Object.keys(types).map((type) => (
                  <Nav.Item key={type}>
                    <Nav.Link
                      eventKey={type}
                      onClick={() => onNavigateToType?.(type)}
                    >
                      {type}
                    </Nav.Link>
                  </Nav.Item>
                ))}
              </Nav>

              <Tab.Content>
                {Object.entries(types).map(([type, sujets]) => (
                  <Tab.Pane eventKey={type} key={type}>
                    <div className="d-flex flex-column gap-3">
                      {sujets.map((sujet) => (
                        <Card
                          key={sujet.id}
                          className="shadow-sm border-0 hover-shadow"
                        >
                          <Card.Body className="d-flex align-items-center justify-content-between gap-3 py-2 px-3">
                            <div
                              className="d-flex align-items-center gap-3 flex-grow-1"
                              onClick={() => onNavigateToSujet(sujet, type)}
                              style={{ cursor: "pointer" }}
                            >
                              <div
                                style={{ minWidth: "150px", fontWeight: 600 }}
                              >
                                {sujet.title}
                              </div>
                            </div>

                            <div className="d-flex gap-2 align-items-center">
                              <Badge bg="info" className="px-2 py-1">
                                {sujet.typeStage}
                              </Badge>
                              <Badge bg="secondary" className="px-2 py-1">
                                {new Date(sujet.created_at).getFullYear()}
                              </Badge>
                              <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(sujet.id ?? 0);
                                }}
                                disabled={deleteId === sujet.id}
                              >
                                {deleteId === sujet.id ? (
                                  <Spinner animation="border" size="sm" />
                                ) : (
                                  <CiTrash size={16} />
                                )}
                              </Button>
                            </div>
                          </Card.Body>
                        </Card>
                      ))}
                    </div>
                  </Tab.Pane>
                ))}
              </Tab.Content>
            </Tab.Container>
          </Card.Body>
        </Card>
      </div>
    </Collapse>
  );
};

export default TypeSessions;
