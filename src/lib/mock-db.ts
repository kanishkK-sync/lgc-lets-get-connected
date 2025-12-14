
"use client";

import { allUsers as initialUsers, projects as initialProjects } from './mock-data';
import type { Like, Connection, User, Project, Experience } from './types';

// =================================================================
// MOCK DATABASE SERVICE
// This section will be replaced with Firestore interactions.
// It simulates a database for likes, connections, users and projects.
// =================================================================

// We use sessionStorage to persist data across page reloads in this mock setup.
// In a real app, this would be a Firestore collection.

const getFromStorage = <T>(key: string, initialData: T): T => {
    if (typeof window === 'undefined') return initialData;
    const stored = sessionStorage.getItem(key);
    try {
        return stored ? JSON.parse(stored) : initialData;
    } catch (e) {
        return initialData;
    }
};

const saveToStorage = <T>(key: string, data: T) => {
    if (typeof window === 'undefined') return;
    sessionStorage.setItem(key, JSON.stringify(data));
};


// --- PROJECTS ---
let projects: Project[] = getFromStorage('mockProjects', initialProjects);

export const getProjects = (): Project[] => {
    return getFromStorage('mockProjects', initialProjects);
}

export const getProjectById = (id: string): Project | undefined => {
    return getProjects().find(p => p.id === id);
}

export const addProject = (projectData: Omit<Project, 'id'| 'circuitDiagramUrl' | 'circuitDiagramImageHint'> & { creatorId: string }) => {
    // In a real app, this would be a call to add a document to the 'projects' collection in Firestore.
    // We would also use a transaction to increment the user's projectsCount.
    const newId = projectData.title.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now();
    const newProject: Project = {
        ...projectData,
        id: newId,
        circuitDiagramUrl: 'https://picsum.photos/seed/new-project/800/600',
        circuitDiagramImageHint: 'circuit diagram technology'
    };
    const currentProjects = getProjects();
    saveToStorage('mockProjects', [...currentProjects, newProject]);
    
    // Increment user's project count
    const users = getUsers();
    const userIndex = users.findIndex(u => u.id === projectData.creatorId);
    if (userIndex !== -1) {
        users[userIndex].projectsCount++;
        saveToStorage('mockUsers', users);
    }
    console.log("Mock DB: Project added.", newProject);
    return newProject;
};


// --- USERS ---
let users: User[] = getFromStorage('mockUsers', initialUsers);

export const getUsers = (): User[] => {
    return getFromStorage('mockUsers', initialUsers);
}

export const getUserById = (id: string): User | undefined => {
    return getUsers().find(u => u.id === id);
}

// --- LIKES ---

/**
 * Checks if a user has already liked another user.
 * @param likerUserId - The ID of the user performing the like.
 * @param likedUserId - The ID of the user being liked.
 * @returns boolean
 */
export const hasUserLiked = (likerUserId: string, likedUserId: string): boolean => {
  const likes = getFromStorage<Like[]>('mockLikes', []);
  return likes.some(like => like.likerUserId === likerUserId && like.likedUserId === likedUserId);
};

/**
 * Adds a like to the mock database.
 * @param likerUserId - The ID of the user performing the like.
 * @param likedUserId - The ID of the user being liked.
 */
export const addLike = (likerUserId: string, likedUserId: string) => {
  const likes = getFromStorage<Like[]>('mockLikes', []);
  if (!hasUserLiked(likerUserId, likedUserId)) {
    const newLike: Like = {
      likerUserId,
      likedUserId,
      createdAt: new Date().toISOString(),
    };
    saveToStorage('mockLikes', [...likes, newLike]);
    
    // In a real app with Firestore, you'd increment a counter field on the user document.
    const allUsers = getUsers();
    const likedUserIndex = allUsers.findIndex(u => u.id === likedUserId);
    if (likedUserIndex !== -1) {
        allUsers[likedUserIndex].likesCount++;
        saveToStorage('mockUsers', allUsers);
    }
    console.log("Mock DB: Like added.", newLike);
  }
};

/**
 * Removes a like from the mock database.
 * @param likerUserId - The ID of the user performing the like.
 * @param likedUserId - The ID of the user being liked.
 */
export const removeLike = (likerUserId: string, likedUserId: string) => {
  let likes = getFromStorage<Like[]>('mockLikes', []);
  const updatedLikes = likes.filter(like => !(like.likerUserId === likerUserId && like.likedUserId === likedUserId));
  saveToStorage('mockLikes', updatedLikes);

  // In a real app with Firestore, you'd decrement a counter field.
  const allUsers = getUsers();
  const likedUserIndex = allUsers.findIndex(u => u.id === likedUserId);
  if (likedUserIndex !== -1 && allUsers[likedUserIndex].likesCount > 0) {
      allUsers[likedUserIndex].likesCount--;
      saveToStorage('mockUsers', allUsers);
  }
  console.log("Mock DB: Like removed.");
};


// --- CONNECTIONS ---

/**
 * Checks if a connection exists between two users.
 * @param userId1 - The ID of the first user.
 * @param userId2 - The ID of the second user.
 * @returns boolean
 */
export const isConnected = (userId1: string, userId2: string): boolean => {
  const connections = getFromStorage<Connection[]>('mockConnections', []);
  return connections.some(
    conn => (conn.requesterUserId === userId1 && conn.receiverUserId === userId2) ||
            (conn.requesterUserId === userId2 && conn.receiverUserId === userId1)
  );
};

/**
 * Adds a connection to the mock database.
 * @param requesterUserId - The ID of the user initiating the connection.
 * @param receiverUserId - The ID of the user receiving the connection request.
 */
export const addConnection = (requesterUserId: string, receiverUserId: string) => {
  if (!isConnected(requesterUserId, receiverUserId)) {
    const connections = getFromStorage<Connection[]>('mockConnections', []);
    const newConnection: Connection = {
      requesterUserId,
      receiverUserId,
      status: 'connected',
      createdAt: new Date().toISOString(),
    };
    saveToStorage('mockConnections', [...connections, newConnection]);
    console.log("Mock DB: Connection added.", newConnection);
  }
};

/**
 * Removes a connection from the mock database.
 * @param userId1 
 * @param userId2 
 */
export const removeConnection = (userId1: string, userId2: string) => {
    const connections = getFromStorage<Connection[]>('mockConnections', []);
    const updatedConnections = connections.filter(
        conn => !(
            (conn.requesterUserId === userId1 && conn.receiverUserId === userId2) ||
            (conn.requesterUserId === userId2 && conn.receiverUserId === userId1)
        )
    );
    saveToStorage('mockConnections', updatedConnections);
    console.log("Mock DB: Connection removed.");
}


/**
 * Gets the total number of connections for a specific user.
 * @param userId - The ID of the user.
 * @returns number
 */
export const getConnectionsCountForUser = (userId: string): number => {
    const connections = getFromStorage<Connection[]>('mockConnections', []);
    return connections.filter(conn => conn.requesterUserId === userId || conn.receiverUserId === userId).length;
}


// --- EXPERIENCE ---
const initialExperiences: Experience[] = [];

export const getExperiencesByUserId = (userId: string): Experience[] => {
    // In a real app, this would be a Firestore query: query(collection(db, "experiences"), where("userId", "==", userId))
    const allExperiences = getFromStorage<Experience[]>('mockExperiences', initialExperiences);
    return allExperiences
        .filter(exp => exp.userId === userId)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export const addExperience = (experienceData: Omit<Experience, 'id'>) => {
    // In a real app, this would be a call to add a document to the 'experiences' collection in Firestore.
    const newId = experienceData.title.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now();
    const newExperience: Experience = {
        ...experienceData,
        id: newId,
    };
    const currentExperiences = getFromStorage<Experience[]>('mockExperiences', initialExperiences);
    saveToStorage('mockExperiences', [...currentExperiences, newExperience]);
    console.log("Mock DB: Experience added.", newExperience);
    return newExperience;
}

// Update types to use ISOString for dates to align with JSON serialization
export type { Like, Connection };
