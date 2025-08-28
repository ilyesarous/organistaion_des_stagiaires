import { getItem } from "../../tools/localStorage";
import { SujetDetails } from "./SujetDetails";
import { SujetFolders } from "./SujetFolder";
import { SujetList } from "./SujetList";

const ShowSujet = () => {
  const role = getItem("type");
  const etudiant = getItem("etudiant");
  return (
    <div>
      {role === "etudiant" ? (
        <SujetDetails sujetId={etudiant.sujet_id} />
      ) : (
        // <SujetList />
        <SujetFolders/>
      )}
    </div>
  );
};

export default ShowSujet;
