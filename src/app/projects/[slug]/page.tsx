import { projects } from '@/lib/mock-data';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Cpu, Code2, Wrench } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

type Props = {
  params: { slug: string };
};

export async function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.id,
  }));
}

export default function ProjectPage({ params }: Props) {
  const project = projects.find((p) => p.id === params.slug);

  if (!project) {
    notFound();
  }
  
  const circuitImage = PlaceHolderImages.find(img => img.id === `project-${project.id}`) || PlaceHolderImages.find(i => i.imageHint === 'circuit diagram');

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-12 md:py-20">
        <div className="container mx-auto px-4">
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
                  <p className="text-muted-foreground">{project.description}</p>
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
                      src={circuitImage.imageUrl}
                      alt={`Circuit Diagram for ${project.title}`}
                      width={800}
                      height={600}
                      className="rounded-lg border object-cover w-full"
                      data-ai-hint={circuitImage.imageHint}
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
