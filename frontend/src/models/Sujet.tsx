
export interface Sujet {
  id?: number;
  title: string;
  description: string;
  competences: string;
  duree: number;
  nbEtudiants: number;
  typeStage: string;
  status: string;
  lien: string;
  employee_id?: number;
}
