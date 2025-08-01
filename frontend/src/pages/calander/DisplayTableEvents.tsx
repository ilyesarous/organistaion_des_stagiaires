
import { Button, Table } from "react-bootstrap";
import { FaRegEye } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { CiTrash } from "react-icons/ci";
import type { Event } from "../../models/Events";

interface EventTableProps {
  events: Event[];
  onDelete: (id: number) => void;
  deleteId: number | null;
  details: (id: number) => void;
}

export const DisplayTable = ({ events, onDelete, deleteId, details }: EventTableProps) => {
  return (
    <div className="table-responsive">
      <Table hover className="mb-0">
        <thead className="bg-light">
          <tr>
            <th>Titre</th>
            <th>Debut</th>
            <th>Fin</th>
            <th>Description</th>
            <th>Type</th>
            <th>Room</th>
            <th style={{ width: "120px" }} className="text-end">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr key={event.id} className="align-middle">
              <td className="fw-medium">{event.title}</td>
              <td className="fw-medium">{event.start}</td>
              <td className="fw-medium">{event.end}</td>
              <td className="fw-medium">{event.description}</td>
              <td className="fw-medium">{event.type}</td>
              <td className="fw-medium">{event.room_name || "not specified" }</td>
              <td>
                <div className="d-flex justify-content-end gap-2">
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="p-2"
                    title="Voir"
                    onClick={()=>details(event.id!)}
                  >
                    <FaRegEye size={16} />
                  </Button>
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    className="p-2"
                    title="Modifier"
                  >
                    <MdEdit size={16} />
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    className="p-2"
                    title="Supprimer"
                    onClick={() => onDelete(event.id!)}
                    disabled={deleteId === event.id}
                  >
                    {deleteId === event.id ? (
                      <span
                        className="spinner-border spinner-border-sm"
                        role="status"
                      ></span>
                    ) : (
                      <CiTrash size={16} />
                    )}
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};