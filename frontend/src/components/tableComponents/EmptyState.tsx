import { Alert } from "react-bootstrap";

interface EmptyStateProps {
  searchTerm: string;
  name: string;
}

export const EmptyState = ({ searchTerm, name }: EmptyStateProps) => {
  return (
    <div className="text-center py-5">
      <Alert variant="info" className="mx-3">
        {searchTerm ? "Aucun résultat trouvé" : "Aucune "+name+" trouvée"}
      </Alert>
    </div>
  );
};