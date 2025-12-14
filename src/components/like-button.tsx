"use client";
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { useAuth } from '@/components/auth-context';
import { useToast } from '@/hooks/use-toast';

export function LikeButton({ targetUserId, initialLikes }: { targetUserId: string, initialLikes: number }) {
  const { user } = useAuth();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(initialLikes);
  const { toast } = useToast();

  const handleLike = () => {
    if (!user) {
        toast({ title: "Login Required", description: "You must be logged in to like a member.", variant: 'destructive' });
        return;
    }
    if(user.id === targetUserId){
        toast({ title: "Can't like yourself!", description: "You cannot like your own profile." });
        return;
    }

    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
    toast({ title: liked ? "Unliked!" : "Liked!", description: `You ${liked ? 'un' : ''}liked this member.` });
  };

  return (
    <div className="flex items-center gap-2">
      <Button onClick={handleLike} variant={liked ? 'default' : 'outline'} size="sm" className={liked ? 'text-primary-foreground bg-primary' : 'text-primary'}>
        <Heart className={`mr-2 h-4 w-4 ${liked ? 'fill-current' : ''}`} />
        {liked ? 'Liked' : 'Like'}
      </Button>
      <span className="text-muted-foreground text-sm">{likeCount} Likes</span>
    </div>
  );
}
