import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { Alert, Card, Badge } from "react-bootstrap";
import type { AppDispatch, RootState } from "../../tools/redux/Store";
import type { Sujet } from "../../models/Sujet";
import { fetchSujets } from "./Redux/SujetReduxThunk";
import { LoadingIndicator } from "../../components/Loading";
import { RiArrowDropRightFill } from "react-icons/ri";

interface Props {
  sessions: Record<string, boolean>;
  onToggleSession: (session: string, types: Record<string, any[]>) => void;
}

export const SujetFolders = ({ onToggleSession }: Props) => {
  const sujets = useSelector((state: RootState) => state.sujet.sujets);
  const sujetStatus = useSelector((state: RootState) => state.sujet.status);
  let error = useSelector((state: RootState) => state.sujet.error);
  const dispatch = useDispatch<AppDispatch>();

  const grouped = groupBySessionAndType(sujets);

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

  useEffect(() => {
    if (sujetStatus === "idle") {
      dispatch(fetchSujets());
    }
  }, [sujetStatus, dispatch]);

  if (sujetStatus === "loading") return <LoadingIndicator />;
  if (sujetStatus === "failed")
    return (
      <Alert variant="danger" onClose={() => (error = "")} dismissible>
        {error}
      </Alert>
    );

  return (
    <div className="d-flex flex-column gap-3">
      {Object.entries(grouped).map(([session, types]) => {
        return (
          <Card
            key={session}
            className="shadow-sm border-0 rounded"
            style={{ cursor: "pointer" }}
            onClick={() => onToggleSession(session, types)}
          >
            <Card.Header
              className="d-flex justify-content-between align-items-center bg-light"
              style={{ borderRadius: "0.5rem" }}
            >
              <span className="d-flex align-items-center gap-2">
                <RiArrowDropRightFill size={24} />
                <strong>Session {session}</strong>
              </span>
              <Badge bg="white" text="dark" pill>
                {Object.values(types).reduce((a, b) => a + b.length, 0)} sujets
              </Badge>
            </Card.Header>
          </Card>
        );
      })}
    </div>
  );
};
