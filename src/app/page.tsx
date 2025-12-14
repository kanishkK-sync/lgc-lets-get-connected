import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { coreMembers } from "@/lib/mock-data";
import Image from "next/image";
import Link from "next/link";
import MemberSearch from "@/components/member-search";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Mail, Github, Linkedin, Twitter } from "lucide-react";

export default function Home() {
  const getMemberImage = (name: string) => {
    const id = `member-${name.toLowerCase().replace(/\./g, '').replace(/\s+/g, '-')}`;
    return PlaceHolderImages.find(img => img.id === id) || PlaceHolderImages[0];
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section id="hero" className="w-full relative overflow-hidden py-20 md:py-32 lg:py-40">
          <div className="absolute inset-0 bg-grid-primary/10"></div>
          <div className="container relative mx-auto text-center px-4">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary mb-4">
              LET’S GET CONNECTED (LGC)
            </h1>
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground mb-8">
              ECE Innovators | Project Builders | Future Engineers
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/#projects">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  Explore Projects
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button size="lg" variant="outline" className="border-accent text-accent hover:bg-accent/10">
                  Login / Signup
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Core Members Section */}
        <section id="members" className="w-full py-20 md:py-24 lg:py-32">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Core Members</h2>
            <div className="max-w-2xl mx-auto space-y-8">
              {coreMembers.map((member) => {
                 const memberImage = getMemberImage(member.name);
                 return (
                  <div key={member.id} className="flex items-center gap-6 p-4 rounded-lg hover:bg-card/50 transition-colors duration-300">
                    <Image
                      src={memberImage.imageUrl}
                      alt={`Photo of ${member.name}`}
                      width={80}
                      height={80}
                      className="rounded-full object-cover border-2 border-primary"
                      data-ai-hint={memberImage.imageHint}
                    />
                    <div className="flex-grow">
                      <h3 className="text-xl font-bold text-primary-foreground">{member.name}</h3>
                      <p className="text-md text-accent">{member.designation}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Public Search Bar Section */}
        <section id="search" className="w-full py-20 md:py-24 lg:py-32 bg-card">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Find a Member</h2>
                <p className="text-lg text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
                    Search for a member of our collective. Our AI can help you find them even with a partial name or a typo.
                </p>
                <MemberSearch />
            </div>
        </section>

        {/* About Section */}
        <section id="about" className="w-full py-20 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">About LGC</h2>
              <p className="text-muted-foreground mb-4">
                LGC (Let's Get Connected) is a dynamic and innovative collective of Electronics and Communication Engineering (ECE) students dedicated to pushing the boundaries of technology. We are passionate about building cutting-edge projects, from IoT devices and hardware design to software development and research.
              </p>
              <p className="text-muted-foreground">
                Our mission is to foster a collaborative environment where future engineers can learn, create, and innovate together. We believe in hands-on experience and turning theoretical knowledge into practical, real-world solutions.
              </p>
            </div>
            <Card className="bg-card/50">
              <CardHeader>
                <CardTitle>Contact the Founder</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold">Harsha Sai</h4>
                  <p className="text-sm text-muted-foreground">Founder, Hardware Specialist</p>
                </div>
                <div className="flex items-center gap-4 text-muted-foreground">
                  <Mail className="h-5 w-5" />
                  <span>harsasai@example.com</span>
                </div>
                <div className="flex items-center gap-4 text-muted-foreground">
                    <Linkedin className="h-5 w-5" />
                    <span>linkedin.com/in/harsasai</span>
                </div>
                <div className="flex items-center gap-4 text-muted-foreground">
                    <Github className="h-5 w-5" />
                    <span>github.com/harsasai</span>
                </div>
                <div className="flex items-center gap-4 text-muted-foreground">
                    <Twitter className="h-5 w-5" />
                    <span>@harsasai_tech</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
