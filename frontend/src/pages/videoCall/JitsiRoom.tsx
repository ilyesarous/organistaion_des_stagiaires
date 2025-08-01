import { useEffect, useState } from "react";
import { Container, Form, Button, Row, Col, Card, Alert } from "react-bootstrap";
import VideoCall from "./VideoCall"; // Component created earlier
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../tools/redux/Store";
import { fetchEvents } from "../calander/Redux/EventReduxThunk";

const JitsiRoom = () => {
  const [roomName, setRoomName] = useState("");
  const [joined, setJoined] = useState(false);
  const events = useSelector((state: RootState) => state.event.events);
  const eventStatus = useSelector((state: RootState) => state.event.status);
  const [error, setError] = useState("");
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (events.length > 0) return;
    if (eventStatus === "idle") {
      dispatch(fetchEvents());
    }

    console.log(events);
  }, [dispatch, eventStatus]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const matched = events.some(
      (event) => event.room_name?.trim().toLowerCase() === roomName.trim().toLowerCase()
    );

    if (matched) {
      setJoined(true);
      setError("");
    } else {
      setRoomName("");
      setError("Room not found. Please check the room name.");
    }
  };

  return (
    <Container className="mt-3">
      <Row className="justify-content-center">
        <Col>
          {!joined ? (
            <Card className="shadow-lg p-4 col-md-6 mx-auto">
              <h3 className="text-center mb-4">Join a Video Meeting</h3>
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="roomName">
                  <Form.Label>Room Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter a room name"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    required
                  />
                </Form.Group>
                {error && (
                  <Alert variant="danger" className="mt-3">
                    {error}
                  </Alert>
                )}
                <Button variant="primary" type="submit" className="mt-3 w-100">
                  Join Meeting
                </Button>
              </Form>
            </Card>
          ) : (
            <div>
              <VideoCall roomName={roomName} userDisplayName="Guest User" />
              <div className="text-center mt-3">
                <Button
                  variant="secondary"
                  onClick={() => {
                    setJoined(false);
                    setRoomName("");
                  }}
                >
                  Leave Meeting
                </Button>
              </div>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default JitsiRoom;
