export interface User {
  id: string;
  name: string;
  designation: string;
  photoUrl: string;
  projectsCount: number;
  likesCount: number;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  sourceCode: string;
  components: string[];
  doneBy: string[]; // member names
  circuitDiagramUrl: string;
  circuitDiagramImageHint: string;
}
