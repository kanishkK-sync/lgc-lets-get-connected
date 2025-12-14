
"use client";

import { useAuth } from "@/components/auth-context";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getProjects } from "@/lib/mock-db";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { Project } from "@/lib/types";

export default function Dashboard() {
    const { user } = useAuth();
    const router = useRouter();
    const [projects, setProjects] = useState<Project[]>([]);
    
    useEffect(() => {
        // Fetch projects on component mount
        setProjects(getProjects());
    }, []);

    const handleProjectSelect = (projectId: string) => {
        if (projectId) {
            router.push(`/projects/${projectId}`);
        }
    };

    if (!user) return null;

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Hi, {user.name.split(' ')[0]}</h1>

            <Card>
                <CardHeader>
                    <CardTitle>Explore Projects</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground mb-4">Select a project to view its details.</p>
                    <Select onValueChange={handleProjectSelect}>
                        <SelectTrigger className="w-full md:w-[300px]">
                            <SelectValue placeholder="Search for a project..." />
                        </SelectTrigger>
                        <SelectContent>
                            {projects.map(project => (
                                <SelectItem key={project.id} value={project.id}>
                                    {project.title}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </CardContent>
            </Card>
        </div>
    );
}
