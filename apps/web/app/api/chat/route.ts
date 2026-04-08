import { NextResponse } from 'next/server';

import { personalityTemplates, type CompanionDraft } from '../../../lib/companions/companion-schema';

type ChatRequest = {
  companion: CompanionDraft | null;
  messages: Array<{
    role: 'assistant' | 'user';
    content: string;
  }>;
};

export async function POST(request: Request) {
  const body = (await request.json()) as ChatRequest;
  const latestUserMessage = [...body.messages].reverse().find((message) => message.role === 'user');
  const template = personalityTemplates.find(
    (option) => option.value === body.companion?.personalityTemplate,
  );
  const companionName = body.companion?.name || 'Your companion';
  const skillPackSummary = body.companion?.skillPacks.length
    ? `Relevant skill packs: ${body.companion.skillPacks.join(', ')}.`
    : 'No skill packs are saved yet.';
  const reply = latestUserMessage
    ? `${companionName} (${template?.label || 'Local companion'}) heard: "${latestUserMessage.content}". ${body.companion?.shortBio || 'This session is using only local draft context.'} ${skillPackSummary}`
    : `${companionName} is ready. Start with a short question or reflection prompt.`;

  return NextResponse.json({ reply });
}
