export const questionAnswerPrompt = (
  role,
  experience,
  topicsToFocus,
  numberOfQuestions,
) => {
  return `You are a senior engineer conducting a technical interview.

Generate exactly ${numberOfQuestions} interview questions for the following profile:
- Role: ${role}
- Experience: ${experience} years
- Topics to focus on: ${topicsToFocus || "general topics for this role"}

Rules for each question:
1. The "answer" field must be plain text (no markdown, no bullet points, no headings, no code blocks).
2. Keep the answer concise and human-readable: 2-4 short sentences, maximum ~70 words.
3. Do not add extra background or tangents. Focus only on the core explanation.
4. Difficulty should match ${experience} years of experience.

Return ONLY a valid JSON array. No extra text, no markdown wrapper around the JSON.

[
  {
    "question": "...",
    "answer": "Concise, plain-text answer in 2-4 sentences."
  }
]`;
};

export const conceptExplainPrompt = (question) => {
  return `You are a senior developer explaining a concept to a junior developer.

Explain the following interview question in depth:
"${question}"

Structure your explanation like this:
1. Start with a one-line definition in plain text.
2. Add 2-4 short sentences expanding the concept.
3. Keep it concise, no bullet points, no headings, no markdown, no code blocks.
4. Avoid tangents and extra background. Focus on the core idea only.

Return ONLY a valid JSON object in this exact shape. No extra text outside the JSON:

{
  "title": "Short, clear concept title (5 words max)",
  "explanation": "Plain-text explanation in 3-5 short sentences."
}`;
};
