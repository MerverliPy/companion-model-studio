import { NextResponse } from 'next/server';

import { personalityTemplates, type CompanionDraft } from '../../../lib/companions/companion-schema';
import { sendRuntimeChat, type OllamaChatMessage } from '../../../lib/runtime/ollama';

type ChatRequest = {
  companion: CompanionDraft | null;
  messages: Array<{
    role: 'assistant' | 'user';
    content: string;
  }>;
};

const RUNTIME_UNAVAILABLE_REPLY =
  'I could not reach the local Ollama runtime just now. Confirm it is running, then try again.';

function buildSystemPrompt(companion: CompanionDraft | null) {
  const template = personalityTemplates.find(
    (option) => option.value === companion?.personalityTemplate,
  );
  const companionName = companion?.name || 'Your companion';
  const shortBio = companion?.shortBio || 'Keep the response grounded in the local draft context.';
  const skillPackSummary = companion?.skillPacks.length
    ? `Relevant skill packs: ${companion.skillPacks.join(', ')}.`
    : 'No skill packs are saved yet.';

  return [
    `You are ${companionName}.`,
    `Personality template: ${template?.label || 'Local companion'}.`,
    shortBio,
    skillPackSummary,
    'Respond conversationally and keep answers concise and supportive.',
  ].join(' ');
}

function buildRuntimeMessages(body: ChatRequest): OllamaChatMessage[] {
  const messages = body.messages
    .filter((message) => typeof message.content === 'string' && message.content.trim())
    .slice(-12)
    .map((message) => ({
      role: message.role,
      content: message.content.trim(),
    }));

  return [
    {
      role: 'system',
      content: buildSystemPrompt(body.companion),
    },
    ...messages,
  ];
}

export async function POST(request: Request) {
  const body = (await request.json()) as ChatRequest;
  const runtimeReply = await sendRuntimeChat({
    messages: buildRuntimeMessages(body),
  });

  const reply = runtimeReply.ok
    ? runtimeReply.reply
    : `${RUNTIME_UNAVAILABLE_REPLY} ${runtimeReply.error}`;

  return NextResponse.json({ reply });
}
