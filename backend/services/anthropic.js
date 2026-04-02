import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function parseProtein(input) {
  const message = await client.messages.create({
    model: 'claude-haiku-4-5',
    max_tokens: 512,
    messages: [{
      role: 'user',
      content: `The user ate: ${input}. Return a JSON array of items, each with 'food' (string) and 'protein' (number in grams). Be accurate with standard serving sizes. Return ONLY the JSON array, no explanation.`,
    }],
  });

  const text = message.content[0].text.trim();
  // Strip optional markdown code fences
  const jsonText = text.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');

  let items;
  try {
    items = JSON.parse(jsonText);
  } catch {
    throw new Error(`Failed to parse protein data from AI response: ${text}`);
  }

  if (!Array.isArray(items)) {
    throw new Error('AI response was not a JSON array');
  }

  const totalProtein = items.reduce((sum, item) => sum + (item.protein ?? 0), 0);
  return { items, totalProtein };
}
