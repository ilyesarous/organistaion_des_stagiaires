import { getItem } from "../../tools/localStorage";
import { AttestationDetails } from "./AttestationDetails";
import { AttestationList } from "./AttestationList";

const ShowAttestation = () => {
  const role = getItem("type");
  const user = getItem("user");

  return (
    <div>
      {role === "etudiant" ? (
        <AttestationDetails studentId={user.id} />
      ) : (
        <AttestationList />
      )}
    </div>
  );
};

export default ShowAttestation;
