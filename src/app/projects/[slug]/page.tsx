
"use client";

import { getProjectById, getProjects } from '@/lib/mock-db';
import { notFound, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Cpu, Code2, Wrench, ArrowLeft } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useEffect, useState } from 'react';
import type { Project } from '@/lib/types';

type Props = {
  params: { slug: string };
};

export default function ProjectPage({ params }: Props) {
  const [project, setProject] = useState<Project | null | undefined>(undefined);
  const router = useRouter();

  useEffect(() => {
    // START: Firebase replacement
    // In a real app, this would be a Firestore getDoc call.
    const foundProject = getProjectById(params.slug);
    setProject(foundProject);
    // END: Firebase replacement
  }, [params.slug]);


  if (project === undefined) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>; // Or a skeleton loader
  }
  
  if (project === null) {
    notFound();
  }
  
  const circuitImage = PlaceHolderImages.find(img => img.id === `project-${project.id}`) || PlaceHolderImages.find(i => i.imageHint === 'circuit diagram');

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="mb-8">
             <button onClick={() => router.back()} className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-4 w-4" />
                Back
            </button>
          </div>
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">{project.title}</h1>
            <div className="flex justify-center gap-2">
              {project.doneBy.map((memberName) => (
                <Badge key={memberName} variant="secondary">{memberName}</Badge>
              ))}
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Project Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground whitespace-pre-wrap">{project.description}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center gap-2">
                  <Code2 className="h-5 w-5 text-primary" />
                  <CardTitle>Source Code</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="bg-muted/50 p-4 rounded-md overflow-x-auto text-sm">
                    <code>{project.sourceCode}</code>
                  </pre>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-8">
              <Card>
                <CardHeader className="flex flex-row items-center gap-2">
                  <Wrench className="h-5 w-5 text-primary" />
                  <CardTitle>Components Used</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  {project.components.map((component) => (
                    <Badge key={component} variant="outline">{component}</Badge>
                  ))}
                </CardContent>
              </Card>
              
              {circuitImage && (
                <Card>
                  <CardHeader className="flex flex-row items-center gap-2">
                    <Cpu className="h-5 w-5 text-primary" />
                    <CardTitle>Circuit Diagram</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Image
                      src={project.circuitDiagramUrl || circuitImage.imageUrl}
                      alt={`Circuit Diagram for ${project.title}`}
                      width={800}
                      height={600}
                      className="rounded-lg border object-cover w-full"
                      data-ai-hint={project.circuitDiagramImageHint || circuitImage.imageHint}
                    />
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
