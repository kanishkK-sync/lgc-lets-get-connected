
"use client";

// =================================================================
// MOCK DATABASE SERVICE
// This section will be replaced with Firestore interactions.
// It simulates a database for likes and connections.
// =================================================================

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

// --- Public API for the mock database ---

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
 * NOTE: This is not efficient for a real database. In Firestore, you'd use a counter
 * field on the user document and update it with a transaction or cloud function.
 * For mock purposes, we just count the entries.
 * @param userId - The ID of the user.
 * @returns number
 */
export const getLikeCountForUser = (userId: string): number => {
    const likes = getLikesFromStorage();
    return likes.filter(like => like.likedUserId === userId).length;
}
