import { Image } from "react-bootstrap";
import profilePic from "../../assets/images/profilePic.png";

interface SocieteLogoProps {
  logo: string | null;
  raisonSociale: string;
}

export const LogoDisplay = ({ logo, raisonSociale }: SocieteLogoProps) => {
  
  return (
    <div className="d-flex justify-content-center">
      {logo ? (
        <Image
          src={`http://localhost:8000${logo}`}
          rounded
          fluid
          alt={raisonSociale}
          style={{ maxHeight: "100px", objectFit: "contain" }}
        />
      ) : (
        <Image
          src={profilePic}
          rounded
          fluid
          alt={raisonSociale}
          style={{ maxHeight: "100px", objectFit: "contain" }}
        />
      )}
    </div>
  );
};
