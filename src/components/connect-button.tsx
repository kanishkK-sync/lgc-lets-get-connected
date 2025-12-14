
"use client";
import React, { useState, useEffect, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { UserPlus, UserCheck } from 'lucide-react';
import { useAuth } from '@/components/auth-context';
import { useToast } from '@/hooks/use-toast';
import { isConnected, addConnection, removeConnection } from '@/lib/mock-db';

// =================================================================
// NOTE: This component uses a MOCK database service for connections.
// It is designed to be easily swappable with Firebase/Firestore.
// The `isConnected`, `addConnection`, and `removeConnection` functions
// will be replaced with calls to a Firestore service.
// =================================================================

export function ConnectButton({ targetUserId }: { targetUserId: string }) {
  const { user } = useAuth();
  const [isPending, startTransition] = useTransition();
  const [connected, setConnected] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      // In a real app, fetch connection status from Firestore.
      setConnected(isConnected(user.id, targetUserId));
    }
  }, [user, targetUserId]);

  const handleConnect = () => {
    if (!user) {
      toast({ title: "Login Required", description: "You must be logged in to connect.", variant: 'destructive' });
      return;
    }
    if (user.id === targetUserId) {
      toast({ title: "Can't connect with yourself!", description: "You cannot connect with your own profile." });
      return;
    }

    startTransition(() => {
      // In a real app, this would be a call to a Firestore service.
      if (connected) {
        // Optional: Implement disconnect logic if required.
        // For now, we just log it and show a toast.
        removeConnection(user.id, targetUserId);
        setConnected(false);
        toast({
          title: 'Disconnected',
          description: `You are no longer connected.`
        });
      } else {
        addConnection(user.id, targetUserId);
        setConnected(true);
        toast({
          title: 'Connected!',
          description: `You are now connected.`
        });
      }
    });
  };

  if (connected) {
    return (
      <Button onClick={handleConnect} variant="secondary" size="sm" disabled={isPending}>
        <UserCheck className="mr-2 h-4 w-4" />
        Connected
      </Button>
    )
  }

  return (
    <Button onClick={handleConnect} size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isPending}>
      {isPending ? '...' : <UserPlus className="mr-2 h-4 w-4" />}
      Connect
    </Button>
  );
}
