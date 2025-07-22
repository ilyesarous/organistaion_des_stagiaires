export type Etudiant = {
  cv: string;
  convention: string;
  letterAffectation: string;
  facultee_id: number;
  sujet_id: number;
};

export type Employee = {
  numBadge: string;
  signature: string;
};
export interface User {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  email_verified_at: string;
  password: string;
  phone: string;
  profile_picture: string;
  role: string;
  societe_id?: number;
  // etudiant?: Etudiant;
  // employee?: Employee;
}
