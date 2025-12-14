
"use client";

import { allUsers, projects } from '@/lib/mock-data';
import { notFound, useParams } from 'next/navigation';
import Image from 'next/image';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { LikeButton } from '@/components/like-button';
import { ConnectButton } from '@/components/connect-button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useEffect, useState } from 'react';
import type { User, Experience } from '@/lib/types';
import { getExperiencesByUserId } from '@/lib/mock-db';
import { Briefcase, Building, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';


export default function UserPage() {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const params = useParams();
  const slug = typeof params.slug === 'string' ? params.slug : null;

  useEffect(() => {
    if (slug) {
        // In a real app with Firestore, you would fetch the user and their experiences here
        const foundUser = allUsers.find((u) => u.id === slug);
        setUser(foundUser);
        if (foundUser) {
          const userExperiences = getExperiencesByUserId(foundUser.id);
          setExperiences(userExperiences);
        }
    }
  }, [slug]);


  if (user === undefined) {
    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1 py-12 md:py-20">
                <div className="container mx-auto px-4 text-center">
                    <p>Loading profile...</p>
                </div>
            </main>
            <Footer />
        </div>
    );
  }

  if (!user) {
    notFound();
  }

  const userProjects = projects.filter(p => p.doneBy.some(name => name.toLowerCase() === user.name.toLowerCase()));
  const userImage = PlaceHolderImages.find(img => img.id === `member-${user.id}`) || PlaceHolderImages.find(img => img.imageHint.includes('professional')) || PlaceHolderImages[0];


  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-12 md:py-20">
        <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-1 lg:sticky lg:top-24 space-y-8">
                    <Card className="p-8">
                        <div className="flex flex-col items-center text-center">
                            <Image
                                src={userImage?.imageUrl || "https://picsum.photos/seed/placeholder/150/150"}
                                alt={`Photo of ${user.name}`}
                                width={150}
                                height={150}
                                className="rounded-full object-cover border-4 border-primary mb-4"
                                data-ai-hint={userImage?.imageHint}
                            />
                            <h1 className="text-3xl font-bold">{user.name}</h1>
                            <p className="text-accent text-lg">{user.designation}</p>
                            <div className="mt-6 flex items-center gap-4">
                               <LikeButton targetUserId={user.id} initialLikes={user.likesCount} />
                               <ConnectButton targetUserId={user.id} />
                            </div>
                        </div>
                    </Card>
                </div>

                <div className="lg:col-span-2 space-y-8">
                     <Card>
                        <CardHeader>
                            <CardTitle>Projects ({userProjects.length})</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {userProjects.length > 0 ? userProjects.map(project => (
                                <Link href={`/projects/${project.id}`} key={project.id}>
                                    <Card className="hover:border-accent transition-colors">
                                        <CardHeader>
                                            <CardTitle>{project.title}</CardTitle>
                                            <CardDescription className="p-0 pt-2 text-sm text-muted-foreground line-clamp-2">
                                                {project.description}
                                            </CardDescription>
                                        </CardHeader>
                                    </Card>
                                </Link>
                            )) : (
                                <p className="text-muted-foreground">This member hasn't been credited on any projects yet.</p>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Experience ({experiences.length})</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {experiences.length > 0 ? experiences.map(exp => (
                                <Card key={exp.id}>
                                    <CardHeader>
                                        <div className="flex justify-between items-start">
                                            <CardTitle className="text-xl">{exp.title}</CardTitle>
                                            <Badge variant="secondary">{exp.type}</Badge>
                                        </div>
                                        <CardDescription className="flex flex-col gap-2 pt-2">
                                            <span className="flex items-center gap-2"><Building className="h-4 w-4" /> {exp.location}</span>
                                            <span className="flex items-center gap-2"><Calendar className="h-4 w-4" /> {exp.date}</span>
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-muted-foreground text-sm">{exp.description}</p>
                                    </CardContent>
                                </Card>
                            )) : (
                                <p className="text-muted-foreground">This member hasn't added any experience yet.</p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
