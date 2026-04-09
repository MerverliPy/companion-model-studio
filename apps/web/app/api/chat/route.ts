import { NextResponse } from 'next/server';

import { personalityTemplates, type CompanionDraft } from '../../../lib/companions/companion-schema';
import { sendRuntimeChat, type OllamaChatMessage } from '../../../lib/runtime/ollama';

type ChatRequest = {
  companion: CompanionDraft | null;
  messages: Array<{
    role: 'assistant' | 'user';
    content: string;
  }>;
  selectedModel: string;
};

const SELECTED_MODEL_REQUIRED_REPLY =
  'Choose a local Ollama model before sending a chat message.';

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
  const selectedModel = body.selectedModel?.trim() || '';

  if (!selectedModel) {
    return NextResponse.json({ error: SELECTED_MODEL_REQUIRED_REPLY }, { status: 400 });
  }

  const runtimeReply = await sendRuntimeChat({
    selectedModel,
    messages: buildRuntimeMessages(body),
  });

  if (!runtimeReply.ok) {
    return NextResponse.json({ error: runtimeReply.error }, { status: 409 });
  }

  return NextResponse.json({ reply: runtimeReply.reply });
}
