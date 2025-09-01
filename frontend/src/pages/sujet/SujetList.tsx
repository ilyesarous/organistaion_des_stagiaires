import { Container, Card } from "react-bootstrap";
import NavigationBar from "./NavigationBar";
import { useState } from "react";
import { SujetFolders } from "./SujetFolder";
import { AddNewSujet } from "./AddSujet";
import TypeSessions from "./TypeSessions";
import type { Sujet } from "../../models/Sujet";
import { SujetDetailsView } from "./SujetDetailsModal";

interface NavItem {
  name: string;
  type?: "session" | "type" | "sujet" | "root"; // add "root"
  data?: any; // store additional info like types or sujet
}

export const SujetList = () => {
  const [showModal, setShowModal] = useState(false);
  const [openSessions, setOpenSessions] = useState<Record<string, boolean>>({});
  const [items, setItems] = useState<NavItem[]>([{ name: "List des Sujets" }]);
  const [activeSession, setActiveSession] = useState<string | null>(null);
  const [activeType, setActiveType] = useState<string | null>(null);
  const [types, setTypes] = useState<Record<string, Sujet[]> | null>(null);
  const [selectedSujet, setSelectedSujet] = useState<Sujet | null>(null);

  // Navigate breadcrumb back
  const handleNavigateBack = (index: number) => {
    const target = items[index];
    setItems((prev) => prev.slice(0, index + 1));

    if (!target.type || target.type === "root") {
      // Back to folder view
      setActiveSession(null);
      setActiveType(null);
      setTypes(null);
      setSelectedSujet(null);
    } else if (target.type === "session") {
      // Back to session view (types)
      setActiveSession(target.name);
      setTypes(target.data); // types object
      setActiveType(null);
      setSelectedSujet(null);
    } else if (target.type === "type") {
      // Back to type view
      setActiveSession(target.data.sessionName);
      setActiveType(target.name);
      setSelectedSujet(null);
    } else if (target.type === "sujet") {
      // Navigate to sujet details
      setActiveSession(target.data.sessionName);
      setActiveType(target.data.typeName);
      setSelectedSujet(target.data.sujet);
    }
  };

  // Toggle session open/close
  const handleSessionToggle = (
    session: string,
    typesForSession: Record<string, Sujet[]>
  ) => {
    const updated = { ...openSessions, [session]: !openSessions[session] };
    setOpenSessions(updated);

    if (!openSessions[session]) {
      // Open session
      setActiveSession(session);
      setTypes(typesForSession);
      setItems((prev) => [
        ...prev,
        { name: session, type: "session", data: typesForSession },
      ]);
      setActiveType(null);
      setSelectedSujet(null);
    } else {
      // Close session
      setActiveSession(null);
      setTypes(null);
      setActiveType(null);
      setSelectedSujet(null);
    }
  };

  // Navigate to a specific type
  const handleNavigateToType = (typeName: string) => {
    setActiveType(typeName);
  };

  // Navigate to a specific sujet
  const handleNavigateToSujet = (sujet: Sujet, typeName: string) => {
    setSelectedSujet(sujet);
    setActiveType(typeName);
    const sessionName = activeSession!;
    setItems((prev) => [
      ...prev,
      {
        name: sujet.title,
        type: "sujet",
        data: { sessionName, typeName, sujet },
      },
    ]);
  };

  return (
    <Container fluid className="px-4 py-3">
      {/* Navigation / Breadcrumb */}
      <Card className="bg-white border-0 py-3 mb-3">
        <NavigationBar
          items={items}
          showModel={() => setShowModal(true)}
          onNavigateBack={handleNavigateBack}
        />
      </Card>

      {/* Folder view */}
      {!activeSession && !selectedSujet && (
        <SujetFolders
          sessions={openSessions}
          onToggleSession={handleSessionToggle}
        />
      )}

      {/* Type view */}
      {activeSession && types && !selectedSujet && (
        <TypeSessions
          session={activeSession}
          types={types}
          openSessions={openSessions}
          onNavigateToSujet={handleNavigateToSujet}
          onNavigateToType={handleNavigateToType}
          onNavigateBack={handleNavigateBack}
          breadcrumbIndex={items.length - 1}
          activeType={activeType}
        />
      )}

      {/* Sujet details view */}
      {selectedSujet && (
        <SujetDetailsView
          sujet={selectedSujet}
          onNavigateBack={handleNavigateBack}
          breadcrumbIndex={items.length - 1}
        />
      )}

      {/* Add new sujet modal */}
      <AddNewSujet
        show={showModal}
        onHide={() => setShowModal(false)}
        onSuccess={() => setShowModal(false)}
      />
    </Container>
  );
};
