
"use client";
import React, { useState, useEffect, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { useAuth } from '@/components/auth-context';
import { useToast } from '@/hooks/use-toast';
import { hasUserLiked, addLike, removeLike } from '@/lib/mock-db';

// =================================================================
// NOTE: This component is currently using a MOCK database service.
// It is designed to be easily swappable with Firebase/Firestore later.
// The `hasUserLiked`, `addLike`, and `removeLike` functions will
// be replaced with calls to a Firestore service.
// =================================================================

export function LikeButton({ targetUserId, initialLikes }: { targetUserId: string, initialLikes: number }) {
  const { user } = useAuth();
  const [isPending, startTransition] = useTransition();
  
  // State to track if the current user has liked the target user
  const [isLiked, setIsLiked] = useState(false);
  // State for the total like count of the target user
  const [likeCount, setLikeCount] = useState(initialLikes);

  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      // In a real app, you might fetch the like status from Firestore here.
      // For now, we check our mock service.
      const alreadyLiked = hasUserLiked(user.id, targetUserId);
      setIsLiked(alreadyLiked);
    } else {
        setIsLiked(false);
    }

    // In a real app, the initialLikes would come from the user document,
    // and we might set up a real-time listener for the like count.
    // For the mock, we just initialize it.
    // The getLikeCountForUser mock function could be used here too if we wanted
    // the count to be purely from the mock DB, but initialLikes is faster.

  }, [user, targetUserId, initialLikes]);


  const handleLikeToggle = () => {
    if (!user) {
      toast({ title: "Login Required", description: "You must be logged in to like a member.", variant: 'destructive' });
      return;
    }
    if (user.id === targetUserId) {
      toast({ title: "Can't like yourself!", description: "You cannot like your own profile." });
      return;
    }

    startTransition(() => {
        const currentlyLiked = hasUserLiked(user.id, targetUserId);

        if (currentlyLiked) {
            // --- Unlike Logic ---
            // In a real app, this would be a call to a Firestore service to remove the like document.
            removeLike(user.id, targetUserId);
            setIsLiked(false);
            setLikeCount(prev => prev - 1);
            toast({ title: "Unliked!", description: `You unliked this member.` });
        } else {
            // --- Like Logic ---
            // In a real app, this would be a call to a Firestore service to add a like document
            // and potentially a transaction to increment the user's likeCount.
            addLike(user.id, targetUserId);
            setIsLiked(true);
            setLikeCount(prev => prev + 1);
            toast({ title: "Liked!", description: `You liked this member.` });
        }
    });
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        onClick={handleLikeToggle}
        variant={isLiked ? 'default' : 'outline'}
        size="sm"
        className={`transition-all duration-200 ${isLiked ? 'text-primary-foreground bg-primary' : 'text-primary'} ${isPending ? 'animate-pulse' : ''}`}
        disabled={isPending || user?.id === targetUserId}
      >
        <Heart className={`mr-2 h-4 w-4 transition-transform ${isLiked ? 'fill-current scale-110' : 'scale-100'}`} />
        {isLiked ? 'Liked' : 'Like'}
      </Button>
      <span className="text-muted-foreground text-sm font-medium">{likeCount} Likes</span>
    </div>
  );
}
