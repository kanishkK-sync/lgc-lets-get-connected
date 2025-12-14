
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/auth-context';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { PlusCircle, Briefcase, Building, Calendar } from 'lucide-react';
import { getExperiencesByUserId } from '@/lib/mock-db';
import type { Experience } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';

export default function ExperiencePage() {
  const { user } = useAuth();
  const [myExperiences, setMyExperiences] = useState<Experience[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      // START: Firebase replacement
      // In a real app, this would be a Firestore query.
      const userExperiences = getExperiencesByUserId(user.id);
      setMyExperiences(userExperiences);
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
            <h1 className="text-3xl font-bold">My Experience</h1>
            <Link href="/dashboard/experience/new">
            <Button>
                <PlusCircle className="mr-2" />
                Add Experience
            </Button>
            </Link>
        </div>

        {isLoading ? (
            <p>Loading experiences...</p>
        ) : myExperiences.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2">
                {myExperiences.map(exp => (
                    <Card key={exp.id} className="h-full flex flex-col">
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <CardTitle className="line-clamp-2">{exp.title}</CardTitle>
                                <Badge variant="secondary">{exp.type}</Badge>
                            </div>
                            <CardDescription className="flex items-center gap-2 pt-2">
                                <Building className="h-4 w-4" />
                                {exp.location}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow">
                            <p className="text-muted-foreground line-clamp-3 text-sm mb-4">
                                {exp.description}
                            </p>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                            <p className="text-xs text-muted-foreground flex items-center gap-2">
                                <Calendar className="h-4 w-4" /> {exp.date}
                            </p>
                             <p className="text-xs text-muted-foreground">
                                Added {formatDistanceToNow(new Date(exp.createdAt), { addSuffix: true })}
                            </p>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        ) : (
             <Card className="flex flex-col items-center justify-center text-center py-20">
                <CardHeader>
                    <Briefcase className="mx-auto h-12 w-12 text-muted-foreground" />
                    <CardTitle className="mt-4">No Experience Added Yet</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground mb-6">Showcase your skills by adding your work, volunteer, and academic experiences.</p>
                    <Link href="/dashboard/experience/new">
                        <Button>
                            <PlusCircle className="mr-2" />
                            Add Your First Experience
                        </Button>
                    </Link>
                </CardContent>
            </Card>
        )}
    </div>
  );
}
