import { NextResponse } from 'next/server';

import { personalityTemplates, type CompanionDraft } from '../../../lib/companions/companion-schema';
import { parseChatRequest, type ChatRequest } from '../../../lib/chat/chat-request-schema';
import { sendRuntimeChat, type OllamaChatMessage } from '../../../lib/runtime/ollama';

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
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      {
        error: 'Invalid chat request.',
        details: ['Request body must be valid JSON.'],
      },
      { status: 400 },
    );
  }

  const parseResult = parseChatRequest(body);

  if (!parseResult.ok) {
    return NextResponse.json(
      {
        error: parseResult.error,
        details: parseResult.details,
      },
      { status: 400 },
    );
  }

  const runtimeReply = await sendRuntimeChat({
    selectedModel: parseResult.value.selectedModel,
    messages: buildRuntimeMessages(parseResult.value),
  });

  if (!runtimeReply.ok) {
    return NextResponse.json({ error: runtimeReply.error }, { status: 409 });
  }

  return NextResponse.json({ reply: runtimeReply.reply });
}
