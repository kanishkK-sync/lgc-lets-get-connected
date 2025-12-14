"use client";
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { UserPlus, UserCheck } from 'lucide-react';
import { useAuth } from '@/components/auth-context';
import { useToast } from '@/hooks/use-toast';

export function ConnectButton({ targetUserId }: { targetUserId: string }) {
  const { user } = useAuth();
  const [connected, setConnected] = useState(false);
  const { toast } = useToast();

  const handleConnect = () => {
    if (!user) {
        toast({ title: "Login Required", description: "You must be logged in to connect.", variant: 'destructive' });
        return;
    }
    if(user.id === targetUserId){
        toast({ title: "Can't connect with yourself!", description: "You cannot connect with your own profile." });
        return;
    }

    setConnected(!connected);
    toast({ title: connected ? 'Disconnected' : 'Connected!', description: `You are now ${connected ? 'no longer' : ''} connected.` });
  };

  if(connected) {
    return (
        <Button onClick={handleConnect} variant="secondary" size="sm">
            <UserCheck className="mr-2 h-4 w-4" />
            Connected
        </Button>
    )
  }

  return (
    <Button onClick={handleConnect} size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground">
        <UserPlus className="mr-2 h-4 w-4" />
        Connect
    </Button>
  );
}
