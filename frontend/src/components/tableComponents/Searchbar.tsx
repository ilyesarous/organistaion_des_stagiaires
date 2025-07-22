import { FaSearch } from "react-icons/fa";

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  placeholder?: string;
}

export const SearchBar = ({ 
  searchTerm, 
  onSearchChange, 
  placeholder = "Rechercher..." 
}: SearchBarProps) => {
  return (
    <div className="position-relative">
      <div className="position-absolute start-0 top-50 translate-middle-y ps-3">
        <FaSearch className="text-muted" />
      </div>
      <input
        type="text"
        className="form-control ps-5"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
  );
};