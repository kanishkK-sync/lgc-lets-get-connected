
"use client";

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth-context';
import { useToast } from '@/hooks/use-toast';
import { addExperience } from '@/lib/mock-db';

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
import { ArrowLeft, Loader2 } from 'lucide-react';
import React, { useState } from 'react';
import Link from 'next/link';

const experienceSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long."),
  type: z.enum(['Hackathon', 'Internship', 'Workshop', 'Conference', 'Research', 'Other']),
  location: z.string().min(2, "Location is required."),
  description: z.string().min(10, "Description must be at least 10 characters long."),
  date: z.string().min(3, "Please provide a date or date range."),
});

type ExperienceFormValues = z.infer<typeof experienceSchema>;

export default function NewExperiencePage() {
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, control, formState: { errors } } = useForm<ExperienceFormValues>({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      title: '',
      type: 'Other',
      location: '',
      description: '',
      date: '',
    }
  });

  const onSubmit = (data: ExperienceFormValues) => {
    if (!user) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to add experience.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    // START: Firebase replacement
    // In a real app, this would be a single call to add a document to the 'experiences' collection in Firestore.
    try {
        const newExperienceData = {
            ...data,
            userId: user.id,
            createdAt: new Date().toISOString(),
        };
        addExperience(newExperienceData);
        
        toast({
            title: "Experience Added!",
            description: `"${data.title}" has been successfully added to your profile.`,
        });
        
        router.push('/dashboard/experience');
    } catch (error) {
         toast({
            title: "Error",
            description: "Failed to add experience. Please try again.",
            variant: "destructive",
        });
        setIsSubmitting(false);
    }
    // END: Firebase replacement
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
        <div className="mb-6">
            <Link href="/dashboard/experience" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-4 w-4" />
                Back to My Experience
            </Link>
        </div>
      <Card>
        <CardHeader>
          <CardTitle>Add New Experience</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input id="title" {...register('title')} placeholder="e.g., Lead Developer, Google Summer of Code" />
                    {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="type">Type</Label>
                    <Controller
                        name="type"
                        control={control}
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select experience type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Internship">Internship</SelectItem>
                                    <SelectItem value="Hackathon">Hackathon</SelectItem>
                                    <SelectItem value="Workshop">Workshop</SelectItem>
                                    <SelectItem value="Conference">Conference</SelectItem>
                                    <SelectItem value="Research">Research</SelectItem>
                                    <SelectItem value="Other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.type && <p className="text-sm text-destructive">{errors.type.message}</p>}
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" {...register('location')} placeholder="e.g., San Francisco, CA or Remote" />
                {errors.location && <p className="text-sm text-destructive">{errors.location.message}</p>}
                </div>

                <div className="space-y-2">
                <Label htmlFor="date">Date / Duration</Label>
                <Input id="date" {...register('date')} placeholder="e.g., June 2023 - August 2023" />
                {errors.date && <p className="text-sm text-destructive">{errors.date.message}</p>}
                </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" {...register('description')} placeholder="Describe your role and accomplishments..." rows={5} />
              {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="attachment">Certificate / Paperwork</Label>
                <Input id="attachment" type="file" disabled />
                 <p className="text-xs text-muted-foreground">File uploads are disabled in this demo.</p>
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {isSubmitting ? 'Saving...' : 'Save Experience'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
