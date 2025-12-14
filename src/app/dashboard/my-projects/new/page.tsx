
"use client";

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth-context';
import { useToast } from '@/hooks/use-toast';
import { addProject, getUsers } from '@/lib/mock-db';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Loader2 } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import type { User } from '@/lib/types';
import Link from 'next/link';

const projectSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters long."),
  description: z.string().min(20, "Description must be at least 20 characters long."),
  sourceCode: z.string().optional(),
  components: z.string().min(3, "Please list at least one component."),
  doneBy: z.array(z.string()).min(1, "You must select at least one member."),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

export default function NewProjectPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [allMembers, setAllMembers] = useState<User[]>([]);

  useEffect(() => {
    // START: Firebase replacement
    // In a real app, you would fetch all users from Firestore to populate the members list.
    setAllMembers(getUsers());
    // END: Firebase replacement
  }, []);

  const { register, handleSubmit, control, formState: { errors } } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: '',
      description: '',
      sourceCode: '',
      components: '',
      doneBy: user ? [user.name] : [],
    }
  });

  const onSubmit = (data: ProjectFormValues) => {
    if (!user) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to create a project.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    // START: Firebase replacement
    // In a real app, this would be a single call to a Cloud Function or a batched write to Firestore.
    try {
        const newProjectData = {
            ...data,
            components: data.components.split(',').map(c => c.trim()),
            creatorId: user.id,
            createdAt: new Date().toISOString(),
        };
        addProject(newProjectData);
        
        toast({
            title: "Project Created!",
            description: `"${data.title}" has been successfully added.`,
        });
        
        router.push('/dashboard/my-projects');
    } catch (error) {
         toast({
            title: "Error",
            description: "Failed to create the project. Please try again.",
            variant: "destructive",
        });
        setIsSubmitting(false);
    }
    // END: Firebase replacement
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
        <div className="mb-6">
            <Link href="/dashboard/my-projects" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-4 w-4" />
                Back to My Projects
            </Link>
        </div>
      <Card>
        <CardHeader>
          <CardTitle>Create a New Project</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Project Title</Label>
              <Input id="title" {...register('title')} placeholder="e.g., IoT Smart Lighting System" />
              {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" {...register('description')} placeholder="Describe your project in detail..." rows={5} />
              {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="sourceCode">Source Code</Label>
              <Textarea id="sourceCode" {...register('sourceCode')} placeholder="Paste your main source code file here..." rows={10} className="font-mono text-xs" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="components">Components Used (comma-separated)</Label>
              <Input id="components" {...register('components')} placeholder="e.g., ESP32, DHT11 Sensor, Jumper Wires" />
              {errors.components && <p className="text-sm text-destructive">{errors.components.message}</p>}
            </div>

            <div className="space-y-2">
                <Label>Members Involved</Label>
                <Controller
                    name="doneBy"
                    control={control}
                    render={({ field }) => (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 rounded-lg border p-4 max-h-60 overflow-y-auto">
                            {allMembers.map((member) => (
                                <div key={member.id} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`member-${member.id}`}
                                        checked={field.value?.includes(member.name)}
                                        onCheckedChange={(checked) => {
                                            return checked
                                                ? field.onChange([...(field.value || []), member.name])
                                                : field.onChange(field.value?.filter((value) => value !== member.name));
                                        }}
                                    />
                                    <label
                                        htmlFor={`member-${member.id}`}
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                        {member.name}
                                    </label>
                                </div>
                            ))}
                        </div>
                    )}
                />
                 {errors.doneBy && <p className="text-sm text-destructive">{errors.doneBy.message}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="circuit-diagram">Circuit Diagram Image</Label>
                <Input id="circuit-diagram" type="file" disabled />
                 <p className="text-xs text-muted-foreground">Image uploads are disabled in this demo. A placeholder will be used.</p>
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {isSubmitting ? 'Creating Project...' : 'Create Project'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
