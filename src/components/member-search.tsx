"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, Search, Frown } from 'lucide-react';
import { suggestSimilarMembers } from '@/ai/flows/ai-suggest-similar-members';
import type { User } from '@/lib/types';
import { allUsers } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

const searchSchema = z.object({
  query: z.string().min(2, { message: 'Search query must be at least 2 characters.' }),
});

type SearchFormValues = z.infer<typeof searchSchema>;

export default function MemberSearch() {
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<User[]>([]);
  const [searched, setSearched] = useState(false);

  const form = useForm<SearchFormValues>({
    resolver: zodResolver(searchSchema),
    defaultValues: { query: '' },
  });

  const onSubmit = async (data: SearchFormValues) => {
    setIsSearching(true);
    setSearched(true);
    setResults([]);

    await new Promise(resolve => setTimeout(resolve, 500));

    const directResults = allUsers.filter(user =>
      user.name.toLowerCase().includes(data.query.toLowerCase())
    );

    let aiSuggestions: string[] = [];
    try {
        const aiResponse = await suggestSimilarMembers({ memberName: data.query });
        aiSuggestions = aiResponse.suggestions || [];
    } catch (error) {
        console.error("AI suggestion failed:", error);
    }
    
    const aiResults = allUsers.filter(user =>
        aiSuggestions.some(suggestion => user.name.toLowerCase() === suggestion.toLowerCase())
    );

    const combinedResults = [...directResults, ...aiResults];
    const uniqueResults = Array.from(new Map(combinedResults.map(user => [user.id, user])).values());

    setResults(uniqueResults);
    setIsSearching(false);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-center gap-2 mb-8">
        <Input
          {...form.register('query')}
          placeholder="e.g., Harsha, Kanishk..."
          className="flex-grow text-lg py-6"
        />
        <Button type="submit" size="lg" disabled={isSearching} className="py-6">
          {isSearching ? <Loader2 className="animate-spin" /> : <Search />}
        </Button>
      </form>
      {form.formState.errors.query && (
        <p className="text-destructive text-center mb-4">{form.formState.errors.query.message}</p>
      )}

      {isSearching && (
        <div className="text-center text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          <p className="mt-2">Searching for members...</p>
        </div>
      )}

      {!isSearching && searched && (
        <div className="space-y-4">
            {results.length > 0 ? (
                results.map(user => (
                    <Card key={user.id} className="hover:border-primary transition-colors">
                        <Link href={`/users/${user.id}`} className="block p-4">
                            <CardHeader className="p-0">
                                <CardTitle className="text-primary">{user.name}</CardTitle>
                                <p className="text-muted-foreground">{user.designation}</p>
                            </CardHeader>
                            <CardFooter className="p-0 pt-4 flex justify-between">
                                <Badge variant="secondary">Projects: {user.projectsCount}</Badge>
                                <Badge variant="secondary">Likes: {user.likesCount} ❤️</Badge>
                            </CardFooter>
                        </Link>
                    </Card>
                ))
            ) : (
                <Card className="text-center py-12">
                    <CardContent>
                        <Frown className="h-12 w-12 mx-auto text-muted-foreground mb-4"/>
                        <h3 className="text-xl font-semibold">No Members Found</h3>
                        <p className="text-muted-foreground mt-2">Try a different name or check for typos. Our AI will try to help!</p>
                    </CardContent>
                </Card>
            )}
        </div>
      )}
    </div>
  );
}
