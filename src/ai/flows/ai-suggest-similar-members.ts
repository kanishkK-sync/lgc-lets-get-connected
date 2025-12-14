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
  prompt: `Suggest similar member names for the following search query:

{{memberName}}

Return a list of names that are similar to the query, considering potential typos or partial names. Return only name suggestions, do not add any extra text.`, 
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
