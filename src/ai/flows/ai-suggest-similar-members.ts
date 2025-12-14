// This file is machine-generated - edit at your own risk.
'use server';

/**
 * @fileOverview Implements an AI flow that suggests similar member names based on a search query.
 *
 * - suggestSimilarMembers - A function that takes a member name query and suggests similar names using AI.
 * - SuggestSimilarMembersInput - The input type for the suggestSimilarMembers function.
 * - SuggestSimilarMembersOutput - The return type for the suggestSimilarMembers function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestSimilarMembersInputSchema = z.object({
  memberName: z.string().describe('The member name search query.'),
});
export type SuggestSimilarMembersInput = z.infer<typeof SuggestSimilarMembersInputSchema>;

const SuggestSimilarMembersOutputSchema = z.object({
  suggestions: z.array(
    z.string().describe('A suggested similar member name.')
  ).describe('A list of suggested similar member names based on the input query.')
});
export type SuggestSimilarMembersOutput = z.infer<typeof SuggestSimilarMembersOutputSchema>;

export async function suggestSimilarMembers(input: SuggestSimilarMembersInput): Promise<SuggestSimilarMembersOutput> {
  return suggestSimilarMembersFlow(input);
}

const suggestSimilarMembersPrompt = ai.definePrompt({
  name: 'suggestSimilarMembersPrompt',
  input: {schema: SuggestSimilarMembersInputSchema},
  output: {schema: SuggestSimilarMembersOutputSchema},
  prompt: `You are an intelligent assistant for a member directory. Your goal is to find potential matches for a user's search query.
Given the search query "{{memberName}}", suggest a list of names that are similar.
Consider the following:
- Common misspellings or typos.
- Phonetically similar names.
- Partial names (e.g., "Kani" for "Kanishk").
- Different ordering of first/last names if applicable.

Return a JSON object with a 'suggestions' array containing the suggested names. The names in the array should be properly capitalized if the intent is clear (e.g., "harsha" should be "Harsha Sai"). Do not add any extra text or explanation, only the JSON object.`,
});

const suggestSimilarMembersFlow = ai.defineFlow(
  {
    name: 'suggestSimilarMembersFlow',
    inputSchema: SuggestSimilarMembersInputSchema,
    outputSchema: SuggestSimilarMembersOutputSchema,
  },
  async input => {
    const {output} = await suggestSimilarMembersPrompt(input);
    return output!;
  }
);
