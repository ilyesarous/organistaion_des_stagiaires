import { useEffect, useState } from "react";
import { Container, Alert, Card } from "react-bootstrap";
import { axiosRequest } from "../../apis/AxiosHelper";
import { LoadingIndicator } from "../../components/Loading";
import { TableHeader } from "../../components/tableComponents/TableHeader";
import { EmptyState } from "../../components/tableComponents/EmptyState";
import { TableFooter } from "../../components/tableComponents/TableFooter";
import type { Event } from "../../models/Events";
import { DisplayTable } from "./DisplayTableEvents";
import { CreateEventModal } from "./CreateEventModel";
import { EventDetailsModal } from "./EventDetailsModal";
import { useDispatch, useSelector } from "react-redux";
import { EventActions } from "./Redux/EventRedux";
import type { RootState, AppDispatch } from "../../tools/redux/Store";
import { fetchEvents } from "./Redux/EventReduxThunk";
import { getItem } from "../../tools/localStorage";
import { UpdateEventModal } from "./UpdateEventModel";

export const EventList = () => {
  const events = useSelector((state: RootState) => state.event.events);
  let eventError = useSelector((state: RootState) => state.event.error);
  const eventStatus = useSelector((state: RootState) => state.event.status);
  const dispatch = useDispatch<AppDispatch>();

  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event>();
  const role = getItem("type");

  const handleSuccess = () => {
    setShowModal(false);
  };

  useEffect(() => {
    if (eventStatus === "idle") {
      dispatch(fetchEvents());
    }
  }, [eventStatus, dispatch]);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;

    setDeleteId(id);
    try {
      await axiosRequest("delete", `events/delete/${id}`);
      dispatch(EventActions.deleteEvent(id));
    } catch (err) {
      eventError = "Failed to delete event. Please try again later.";
    } finally {
      setDeleteId(null);
    }
  };

  const handleDetails = async (id: number) => {
    await axiosRequest("get", `events/details/${id}`).then((res) => {
      setSelectedEvent(res.data.event);
      setShowDetailsModal(true);
    });
  };
  const handleUpate = (event: Event) => {
      setSelectedEvent(event)
      setShowUpdateModal(true);
  };

  const filteredEvents = events.filter((event) =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (eventStatus==="loading") return <LoadingIndicator />;
  if (eventStatus === "failed")
    return (
      <Alert variant="danger" onClose={() => eventError} dismissible>
        {eventError}
      </Alert>
    );

  return (
    <Container fluid className="px-4 py-3">
      <Card className="border-0 shadow-sm">
        <Card.Header className="bg-white border-0 py-3">
          <TableHeader
            name="Evennements"
            role={role}
            onAddClick={() => setShowModal(true)}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />
        </Card.Header>

        <Card.Body className="p-0">
          {filteredEvents.length === 0 ? (
            <EmptyState searchTerm={searchTerm} name="société" />
          ) : (
            <DisplayTable
              events={filteredEvents}
              onDelete={handleDelete}
              deleteId={deleteId}
              details={handleDetails}
              update={handleUpate}
            />
          )}
        </Card.Body>

        {filteredEvents.length > 0 && (
          <Card.Footer className="bg-white border-0 py-3">
            <TableFooter
              filteredCount={filteredEvents.length}
              totalCount={events.length}
            />
          </Card.Footer>
        )}
      </Card>

      <CreateEventModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={handleSuccess}
      />
      <EventDetailsModal
        show={showDetailsModal}
        onHide={() => setShowDetailsModal(false)}
        event={selectedEvent ? selectedEvent : null}
      />
      {selectedEvent && (
        <UpdateEventModal
          show={showUpdateModal}
          onClose={() => setShowUpdateModal(false)}
          onSuccess={handleSuccess}
          eventData={selectedEvent}
        />
      )}
    </Container>
  );
};
