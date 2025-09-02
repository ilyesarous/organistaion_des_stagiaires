import { Button } from "react-bootstrap";
import { IoMdAdd } from "react-icons/io";

interface NavItem {
  name: string;
}
interface Props {
  items: NavItem[];
  showModel: () => void;
  onNavigateBack: (index: number) => void;
}

const NavigationBar = ({ items, showModel, onNavigateBack }: Props) => {
  return (
    <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
      <nav aria-label="breadcrumb">
        <ol
          className="breadcrumb m-0 p-0 d-flex align-items-center"
          style={{ fontSize: "16px" }}
        >
          {items.map((item, index) => (
            <li
              key={index}
              className="breadcrumb-item d-flex align-items-center"
              style={{ marginRight: "10px" }}
            >
              <Button
                variant="link"
                onClick={() => {
                  if (index < items.length - 1) onNavigateBack(index);
                }}
                style={{
                  color: index === items.length - 1 ? "#0d6efd" : "#4da6ff",
                  fontWeight: index === items.length - 1 ? "600" : "500",
                  textDecoration: "none",
                  padding: "5px 10px",
                  borderRadius: "0.4rem",
                  transition: "all 0.3s ease",
                  cursor: index === items.length - 1 ? "default" : "pointer",
                }}
                onMouseOver={(e) => {
                  if (index !== items.length - 1)
                    e.currentTarget.style.color = "#1a8cff";
                }}
                onMouseOut={(e) => {
                  if (index !== items.length - 1)
                    e.currentTarget.style.color = "#4da6ff";
                }}
                disabled={index === items.length - 1}
              >
                {item.name}
              </Button>
            </li>
          ))}
        </ol>
      </nav>

      <div className="d-flex flex-column flex-md-row gap-3">
        <Button
          variant="primary"
          className="d-flex align-items-center shadow-sm"
          onClick={showModel}
        >
          <IoMdAdd className="me-2" size={18} />
          Ajouter
        </Button>
      </div>
    </div>
  );
};

export default NavigationBar;
