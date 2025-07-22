import { Button } from "react-bootstrap";
import { FiFilter } from "react-icons/fi";

interface SocieteListFooterProps {
  filteredCount: number;
  totalCount: number;
}

export const TableFooter = ({ 
  filteredCount, 
  totalCount 
}: SocieteListFooterProps) => {
  return (
    <div className="d-flex flex-column flex-md-row justify-content-between align-items-center">
      <small className="text-muted">
        Affichage de {filteredCount} sur {totalCount} société(s)
      </small>

      <div className="d-flex gap-2 mt-2 mt-md-0">
        <Button variant="outline-secondary" size="sm" disabled>
          <FiFilter className="me-1" />
          Filtrer
        </Button>
      </div>
    </div>
  );
};