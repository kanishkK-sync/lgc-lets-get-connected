
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/auth-context';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { PlusCircle, FolderKanban } from 'lucide-react';
import { getProjects } from '@/lib/mock-db';
import { Project } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';

export default function MyProjectsPage() {
  const { user } = useAuth();
  const [myProjects, setMyProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      // START: Firebase replacement
      // In a real app, this would be a Firestore query like:
      // const q = query(collection(db, "projects"), where("creatorId", "==", user.id));
      // const querySnapshot = await getDocs(q);
      const allProjects = getProjects();
      const userProjects = allProjects.filter(
        p => p.creatorId === user.id || p.doneBy.some(name => name.toLowerCase() === user.name.toLowerCase())
      );
      setMyProjects(userProjects.sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()));
      // END: Firebase replacement
      setIsLoading(false);
    }
  }, [user]);

  if (!user) {
    return null;
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">My Projects</h1>
        <Link href="/dashboard/my-projects/new">
          <Button>
            <PlusCircle className="mr-2" />
            Add Project
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <p>Loading projects...</p>
      ) : myProjects.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {myProjects.map(project => (
            <Link href={`/projects/${project.id}`} key={project.id}>
              <Card className="h-full flex flex-col hover:border-primary transition-colors">
                <CardHeader>
                  <CardTitle className="line-clamp-2">{project.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-muted-foreground line-clamp-3 text-sm mb-4">
                    {project.description}
                  </p>
                   <div className="flex flex-wrap gap-1">
                      {project.doneBy.map(member => (
                          <Badge key={member} variant="secondary">{member}</Badge>
                      ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <p className="text-xs text-muted-foreground">
                    {project.createdAt ? `Created ${formatDistanceToNow(new Date(project.createdAt), { addSuffix: true })}` : 'Creation date unknown'}
                  </p>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <Card className="flex flex-col items-center justify-center text-center py-20">
          <CardHeader>
              <FolderKanban className="mx-auto h-12 w-12 text-muted-foreground" />
              <CardTitle className="mt-4">No Projects Yet</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-6">You haven't created or been added to any projects.</p>
            <Link href="/dashboard/my-projects/new">
                <Button>
                    <PlusCircle className="mr-2" />
                    Create Your First Project
                </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
