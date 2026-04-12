import OpenAI from 'openai';
import { AISuggestion } from './types';

export function createOpenAIClient(apiKey: string): OpenAI {
  return new OpenAI({ apiKey, dangerouslyAllowBrowser: true });
}

export async function analyzeWriting(
  client: OpenAI,
  text: string,
  context: string = 'academic'
): Promise<AISuggestion[]> {
  const prompt = `You are an expert academic writing tutor. Analyze the following ${context} writing and provide specific, actionable suggestions for improvement. Focus on helping the student learn to write better.

Analyze these aspects:
1. **Clarity**: Are ideas expressed clearly?
2. **Structure**: Is the logical flow sound?
3. **Tone**: Is it appropriately academic?
4. **Vocabulary**: Could word choices be more precise or varied?
5. **Flow**: Do paragraphs and sentences connect well?

For each issue found, provide:
- The exact text snippet with the issue
- A specific suggestion for improvement
- A clear explanation of WHY this improves the writing
- The type and severity of the issue

Text to analyze:
"""
${text}
"""

Respond ONLY with a JSON array of suggestions in this exact format:
[
  {
    "id": "1",
    "original": "exact text snippet",
    "suggestion": "improved version",
    "explanation": "why this is better and what writing principle it demonstrates",
    "type": "clarity|structure|tone|vocabulary|flow",
    "severity": "low|medium|high"
  }
]

If the writing is already excellent, return fewer suggestions. Maximum 15 suggestions. Return empty array if no improvements needed.`;

  const response = await client.chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.3,
    max_tokens: 4000,
    response_format: { type: 'json_object' },
  });

  const content = response.choices[0]?.message?.content;
  if (!content) return [];

  try {
    const parsed = JSON.parse(content);
    return parsed.suggestions || parsed;
  } catch {
    // Try to extract JSON from markdown code blocks
    const jsonMatch = content.match(/```(?:json)?\n?([\s\S]*?)```/);
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[1]);
        return parsed.suggestions || parsed;
      } catch {
        return [];
      }
    }
    return [];
  }
}

export async function improveParagraph(
  client: OpenAI,
  paragraph: string,
  goal: string = 'clarity and academic tone'
): Promise<{ improved: string; changes: string[] }> {
  const response = await client.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: `You are an academic writing tutor. Improve the given paragraph for ${goal}. 
Explain each change clearly so the student learns WHY it's better. 
Maintain the student's original argument and voice. Never fabricate facts or citations.`
      },
      {
        role: 'user',
        content: `Improve this paragraph: "${paragraph}"

Return JSON with:
{
  "improved": "the improved paragraph",
  "changes": ["list of specific changes made with explanations"]
}`
      }
    ],
    temperature: 0.3,
    max_tokens: 2000,
    response_format: { type: 'json_object' },
  });

  const content = response.choices[0]?.message?.content;
  if (!content) return { improved: paragraph, changes: [] };

  try {
    return JSON.parse(content);
  } catch {
    return { improved: paragraph, changes: [] };
  }
}

export async function proofreadText(
  client: OpenAI,
  text: string
): Promise<{ corrections: Array<{ original: string; corrected: string; type: string; explanation: string }>; score: number }> {
  const response = await client.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: `You are a professional academic proofreader. Find and correct:
- Grammar errors
- Spelling mistakes
- Punctuation issues
- Awkward phrasing
- Word choice improvements
- Consistency issues

For each correction, explain the rule or principle. Give an overall quality score 0-100.`
      },
      {
        role: 'user',
        content: `Proofread this text:
"""
${text}
"""

Return JSON:
{
  "corrections": [
    {
      "original": "exact original text",
      "corrected": "corrected version",
      "type": "grammar|spelling|punctuation|phrasing|word_choice|consistency",
      "explanation": "why this is wrong and the rule it violates"
    }
  ],
  "score": 85
}`
      }
    ],
    temperature: 0.2,
    max_tokens: 4000,
    response_format: { type: 'json_object' },
  });

  const content = response.choices[0]?.message?.content;
  if (!content) return { corrections: [], score: 0 };

  try {
    return JSON.parse(content);
  } catch {
    return { corrections: [], score: 0 };
  }
}

export async function generateThesisStructure(
  client: OpenAI,
  topic: string,
  university: string,
  degree: string,
  department: string
): Promise<{ structure: Array<{ title: string; description: string; wordCount: number; subsections: string[] }>; totalWords: number }> {
  const response = await client.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: `You are an experienced thesis supervisor at a top university. 
Create a detailed thesis structure for a ${degree} thesis in ${department} at ${university}.
The structure should be comprehensive and follow standard academic conventions.
Include word count recommendations for each section.`
      },
      {
        role: 'user',
        content: `Topic: "${topic}"
Degree: ${degree}
Department: ${department}
University: ${university}

Create a detailed thesis structure. Return JSON:
{
  "structure": [
    {
      "title": "Chapter/Section Title",
      "description": "What this section should cover",
      "wordCount": 5000,
      "subsections": ["subsection 1", "subsection 2"]
    }
  ],
  "totalWords": 15000
}`
      }
    ],
    temperature: 0.4,
    max_tokens: 4000,
    response_format: { type: 'json_object' },
  });

  const content = response.choices[0]?.message?.content;
  if (!content) return { structure: [], totalWords: 0 };

  try {
    return JSON.parse(content);
  } catch {
    return { structure: [], totalWords: 0 };
  }
}

export async function formatCitation(
  client: OpenAI,
  sourceInfo: string,
  style: string
): Promise<string> {
  const response = await client.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: `You are a citation expert. Format the provided source information into a proper citation using ${style.toUpperCase()} style. 
Be precise and follow the style guide exactly. Provide both in-text citation and full reference.`
      },
      {
        role: 'user',
        content: `Format this source in ${style.toUpperCase()} style:
${sourceInfo}

Return JSON:
{
  "inText": "(citation)",
  "reference": "Full reference entry",
  "footnote": "Footnote format if applicable"
}`
      }
    ],
    temperature: 0.1,
    max_tokens: 500,
    response_format: { type: 'json_object' },
  });

  const content = response.choices[0]?.message?.content;
  if (!content) return '';

  try {
    const parsed = JSON.parse(content);
    return parsed.reference || parsed.inText || content;
  } catch {
    return content;
  }
}

export async function expandThesisContent(
  client: OpenAI,
  sectionTitle: string,
  sectionDescription: string,
  topic: string,
  notes: string,
  style: string = 'academic'
): Promise<string> {
  const response = await client.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: `You are helping a student write their thesis. 
Topic: ${topic}
Style: ${style}

IMPORTANT GUIDELINES:
- Expand on the student's notes and arguments - never fabricate facts
- Suggest where citations are needed with [CITATION NEEDED] markers
- Write in clear, academic prose
- Maintain logical flow between paragraphs
- Use hedging language appropriately (suggests, indicates, may)
- Include critical analysis, not just description
- The student must verify all facts and add real citations`
      },
      {
        role: 'user',
        content: `Write content for the section: "${sectionTitle}"

Section guidance: ${sectionDescription}

Student's notes and arguments to include:
${notes}

Write comprehensive, well-structured academic content for this section. 
Use [CITATION NEEDED] markers where the student must add real sources.
Be thorough but always mark claims that need verification.`
      }
    ],
    temperature: 0.5,
    max_tokens: 4000,
  });

  return response.choices[0]?.message?.content || '';
}
