
"use client";

import { allUsers, projects } from '@/lib/mock-data';
import { notFound, useParams } from 'next/navigation';
import Image from 'next/image';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { LikeButton } from '@/components/like-button';
import { ConnectButton } from '@/components/connect-button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useEffect, useState } from 'react';
import type { User } from '@/lib/types';


export default function UserPage() {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const params = useParams();
  const slug = typeof params.slug === 'string' ? params.slug : null;

  useEffect(() => {
    if (slug) {
        const foundUser = allUsers.find((u) => u.id === slug);
        // In a real app with Firestore, you would fetch the user document here
        // based on the slug/ID and set it to state.
        // e.g., const userDoc = await getUserFromFirestore(params.slug);
        setUser(foundUser);
    }
  }, [slug]);


  if (user === undefined) {
    // You can show a loading skeleton here while the user data is being fetched
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
            <Card className="p-8">
                <div className="grid md:grid-cols-3 gap-8 items-start">
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
                    <div className="md:col-span-2">
                        <h2 className="text-2xl font-bold mb-4">Projects ({userProjects.length})</h2>
                        <div className="space-y-4">
                            {userProjects.length > 0 ? userProjects.map(project => (
                                <Link href={`/projects/${project.id}`} key={project.id}>
                                    <Card className="hover:border-accent transition-colors">
                                        <CardHeader>
                                            <CardTitle>{project.title}</CardTitle>
                                            <CardContent className="p-0 pt-2 text-sm text-muted-foreground line-clamp-2">
                                                {project.description}
                                            </CardContent>
                                        </CardHeader>
                                    </Card>
                                </Link>
                            )) : (
                                <p className="text-muted-foreground">This member hasn't been credited on any projects yet.</p>
                            )}
                        </div>
                    </div>
                </div>
            </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
