
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
  createdAt?: string;
  creatorId?: string;
}

export interface Like {
  likerUserId: string;
  likedUserId: string;
  createdAt: string; // ISO 8601 date string
};

export interface Connection {
  requesterUserId: string;
  receiverUserId: string;
  status: 'connected';
  createdAt: string; // ISO 8601 date string
};

export interface Experience {
  id: string;
  userId: string;
  title: string;
  type: 'Hackathon' | 'Internship' | 'Workshop' | 'Conference' | 'Research' | 'Other';
  location: string;
  description: string;
  date: string;
  createdAt: string;
}
