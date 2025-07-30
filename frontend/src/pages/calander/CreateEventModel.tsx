// components/CreateEventModal.tsx
import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

interface Props {
  show: boolean;
  onClose: () => void;
  onSave: (event: {
    title: string;
    start: string;
    end: string;
    description: string;
  }) => void;
}

const CreateEventModal: React.FC<Props> = ({ show, onClose, onSave }) => {
  const [title, setTitle] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = () => {
    onSave({ title, start, end, description });
    setTitle("");
    setStart("");
    setEnd("");
    setDescription("");
    onClose();
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Create New Event</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>Title</Form.Label>
            <Form.Control value={title} onChange={(e) => setTitle(e.target.value)} />
          </Form.Group>
          <Form.Group>
            <Form.Label>Start</Form.Label>
            <Form.Control type="datetime-local" value={start} onChange={(e) => setStart(e.target.value)} />
          </Form.Group>
          <Form.Group>
            <Form.Label>End</Form.Label>
            <Form.Control type="datetime-local" value={end} onChange={(e) => setEnd(e.target.value)} />
          </Form.Group>
          <Form.Group>
            <Form.Label>Description</Form.Label>
            <Form.Control as="textarea" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button variant="primary" onClick={handleSubmit}>Add Event</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreateEventModal;
