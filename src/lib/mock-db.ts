
"use client";

// =================================================================
// MOCK DATABASE SERVICE
// This section will be replaced with Firestore interactions.
// It simulates a database for likes and connections.
// =================================================================

// --- LIKES ---

export type Like = {
  likerUserId: string;
  likedUserId: string;
  createdAt: Date;
};

// We use sessionStorage to persist likes across page reloads in this mock setup.
// In a real app, this would be a Firestore collection.
const getLikesFromStorage = (): Like[] => {
  if (typeof window === 'undefined') return [];
  const storedLikes = sessionStorage.getItem('mockLikes');
  return storedLikes ? JSON.parse(storedLikes, (key, value) => {
    if (key === 'createdAt') return new Date(value);
    return value;
  }) : [];
};

const saveLikesToStorage = (likes: Like[]) => {
    if (typeof window === 'undefined') return;
    sessionStorage.setItem('mockLikes', JSON.stringify(likes));
};

/**
 * Checks if a user has already liked another user.
 * @param likerUserId - The ID of the user performing the like.
 * @param likedUserId - The ID of the user being liked.
 * @returns boolean
 */
export const hasUserLiked = (likerUserId: string, likedUserId: string): boolean => {
  const likes = getLikesFromStorage();
  return likes.some(like => like.likerUserId === likerUserId && like.likedUserId === likedUserId);
};

/**
 * Adds a like to the mock database.
 * @param likerUserId - The ID of the user performing the like.
 * @param likedUserId - The ID of the user being liked.
 */
export const addLike = (likerUserId: string, likedUserId: string) => {
  const likes = getLikesFromStorage();
  if (!hasUserLiked(likerUserId, likedUserId)) {
    const newLike: Like = {
      likerUserId,
      likedUserId,
      createdAt: new Date(),
    };
    const updatedLikes = [...likes, newLike];
    saveLikesToStorage(updatedLikes);
    console.log("Mock DB: Like added.", newLike);
  }
};

/**
 * Removes a like from the mock database.
 * @param likerUserId - The ID of the user performing the like.
 * @param likedUserId - The ID of the user being liked.
 */
export const removeLike = (likerUserId: string, likedUserId: string) => {
  let likes = getLikesFromStorage();
  const updatedLikes = likes.filter(like => !(like.likerUserId === likerUserId && like.likedUserId === likedUserId));
  saveLikesToStorage(updatedLikes);
  console.log("Mock DB: Like removed.");
};

/**
 * Gets the total number of likes for a specific user.
 * NOTE: In a real database, you'd use a counter field on the user document.
 * @param userId - The ID of the user.
 * @returns number
 */
export const getLikeCountForUser = (userId: string): number => {
    const likes = getLikesFromStorage();
    return likes.filter(like => like.likedUserId === userId).length;
}


// --- CONNECTIONS ---

export type Connection = {
  requesterUserId: string;
  receiverUserId: string;
  status: 'connected';
  createdAt: Date;
};

// In a real app, this would be a Firestore collection.
const getConnectionsFromStorage = (): Connection[] => {
  if (typeof window === 'undefined') return [];
  const storedConnections = sessionStorage.getItem('mockConnections');
  return storedConnections ? JSON.parse(storedConnections, (key, value) => {
    if (key === 'createdAt') return new Date(value);
    return value;
  }) : [];
};

const saveConnectionsToStorage = (connections: Connection[]) => {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem('mockConnections', JSON.stringify(connections));
};


/**
 * Checks if a connection exists between two users.
 * @param userId1 - The ID of the first user.
 * @param userId2 - The ID of the second user.
 * @returns boolean
 */
export const isConnected = (userId1: string, userId2: string): boolean => {
  const connections = getConnectionsFromStorage();
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
    const connections = getConnectionsFromStorage();
    const newConnection: Connection = {
      requesterUserId,
      receiverUserId,
      status: 'connected',
      createdAt: new Date(),
    };
    saveConnectionsToStorage([...connections, newConnection]);
    console.log("Mock DB: Connection added.", newConnection);
  }
};

/**
 * Removes a connection from the mock database.
 * @param userId1 
 * @param userId2 
 */
export const removeConnection = (userId1: string, userId2: string) => {
    const connections = getConnectionsFromStorage();
    const updatedConnections = connections.filter(
        conn => !(
            (conn.requesterUserId === userId1 && conn.receiverUserId === userId2) ||
            (conn.requesterUserId === userId2 && conn.receiverUserId === userId1)
        )
    );
    saveConnectionsToStorage(updatedConnections);
    console.log("Mock DB: Connection removed.");
}


/**
 * Gets the total number of connections for a specific user.
 * @param userId - The ID of the user.
 * @returns number
 */
export const getConnectionsCountForUser = (userId: string): number => {
    const connections = getConnectionsFromStorage();
    return connections.filter(conn => conn.requesterUserId === userId || conn.receiverUserId === userId).length;
}
