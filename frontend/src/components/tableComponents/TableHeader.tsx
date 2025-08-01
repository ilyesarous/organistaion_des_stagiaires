import { Button } from "react-bootstrap";
import { IoMdAdd } from "react-icons/io";
import { SearchBar } from "./Searchbar";

interface SocieteListHeaderProps {
  name: string;
  role?: string;
  onAddClick?: () => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

export const TableHeader = ({
  name,
  role,
  onAddClick,
  searchTerm,
  onSearchChange,
}: SocieteListHeaderProps) => {

  const showBtn = () => {
    if (role === "admin" || role === "superAdmin") {
      return true;
    }
    return false;
  };

  return (
    <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center">
      <div className="mb-3 mb-md-0">
        <h4 className="mb-0 fw-semibold">
          <i className="bi bi-buildings me-2 text-primary"></i>
          Liste des {name}
        </h4>
      </div>

      <div className="d-flex flex-column flex-md-row gap-3">
        <SearchBar searchTerm={searchTerm} onSearchChange={onSearchChange} />
        {showBtn() && (
          <Button
            variant="primary"
            className="d-flex align-items-center"
            onClick={onAddClick}
          >
            <IoMdAdd className="me-2" size={18} />
            Ajouter
          </Button>
        )}
      </div>
    </div>
  );
};
