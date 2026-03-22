'use server';
/**
 * @fileOverview This file implements a Genkit flow for generating assignment questions and topics.
 *
 * - generateAssignmentQuestions - A function that handles the generation of assignment questions and topics.
 * - AiAssignmentQuestionGeneratorInput - The input type for the generateAssignmentQuestions function.
 * - AiAssignmentQuestionGeneratorOutput - The return type for the generateAssignmentQuestions function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AiAssignmentQuestionGeneratorInputSchema = z.object({
  courseMaterialText: z
    .string()
    .describe(
      'The text content of the course material for which to generate assignment questions and topics.'
    ),
});
export type AiAssignmentQuestionGeneratorInput = z.infer<
  typeof AiAssignmentQuestionGeneratorInputSchema
>;

const AiAssignmentQuestionGeneratorOutputSchema = z.object({
  questions: z
    .array(z.string())
    .describe('A list of suggested assignment questions.'),
  topics: z
    .array(z.string())
    .describe('A list of suggested assignment topics.'),
});
export type AiAssignmentQuestionGeneratorOutput = z.infer<
  typeof AiAssignmentQuestionGeneratorOutputSchema
>;

export async function generateAssignmentQuestions(
  input: AiAssignmentQuestionGeneratorInput
): Promise<AiAssignmentQuestionGeneratorOutput> {
  return aiAssignmentQuestionGeneratorFlow(input);
}

const generateAssignmentQuestionsPrompt = ai.definePrompt({
  name: 'generateAssignmentQuestionsPrompt',
  input: { schema: AiAssignmentQuestionGeneratorInputSchema },
  output: { schema: AiAssignmentQuestionGeneratorOutputSchema },
  prompt: `You are an experienced lecturer tasked with creating engaging and relevant assignment questions and topics for a course.

Based on the provided course material, generate 3-5 distinct assignment questions and 3-5 distinct assignment topics. The questions should test comprehension, critical thinking, and application of the material. The topics should encourage further research or project-based learning related to the material.

Ensure the output is a JSON object with two keys: 'questions' (an array of strings) and 'topics' (an array of strings).

Course Material: {{{courseMaterialText}}}`,
});

const aiAssignmentQuestionGeneratorFlow = ai.defineFlow(
  {
    name: 'aiAssignmentQuestionGeneratorFlow',
    inputSchema: AiAssignmentQuestionGeneratorInputSchema,
    outputSchema: AiAssignmentQuestionGeneratorOutputSchema,
  },
  async (input) => {
    const { output } = await generateAssignmentQuestionsPrompt(input);
    return output!;
  }
);
