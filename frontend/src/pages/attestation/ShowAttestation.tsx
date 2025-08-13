import { getItem } from "../../tools/localStorage";
import { AttestationDetails } from "./AttestationDetails";
import { AttestationList } from "./AttestationList";

const ShowAttestation = () => {
  const role = getItem("type");
  const user = getItem("user");

  return (
    <div>
      {role === "etudiant" ? (
        <AttestationDetails id={user.id} nom={user.nom + " " + user.prenom} />
      ) : (
        <AttestationList />
      )}
    </div>
  );
};

export default ShowAttestation;
