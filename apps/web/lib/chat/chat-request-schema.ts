import type { CompanionDraft } from '../companions/companion-schema';

const MAX_MESSAGE_COUNT = 12;
const MAX_MESSAGE_LENGTH = 4000;

type ChatRole = 'assistant' | 'user';

export type ChatRequest = {
  companion: CompanionDraft | null;
  messages: Array<{
    role: ChatRole;
    content: string;
  }>;
  selectedModel: string;
};

export type ChatRequestParseResult =
  | {
      ok: true;
      value: ChatRequest;
    }
  | {
      ok: false;
      error: string;
      details: string[];
    };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function parseCompanion(value: unknown): CompanionDraft | null {
  if (value === null) {
    return null;
  }

  if (!isRecord(value)) {
    throw new Error('companion must be null or an object');
  }

  const { id, name, shortBio, personalityTemplate, avatarTheme, skillPacks, savedAt } = value;

  if (
    typeof id !== 'string' ||
    typeof name !== 'string' ||
    typeof shortBio !== 'string' ||
    typeof personalityTemplate !== 'string' ||
    typeof avatarTheme !== 'string' ||
    typeof savedAt !== 'string' ||
    !Array.isArray(skillPacks) ||
    !skillPacks.every((skillPack) => typeof skillPack === 'string')
  ) {
    throw new Error('companion must match the saved draft shape');
  }

  return {
    id,
    name,
    shortBio,
    personalityTemplate,
    avatarTheme,
    skillPacks,
    savedAt,
  };
}

export function parseChatRequest(body: unknown): ChatRequestParseResult {
  if (!isRecord(body)) {
    return {
      ok: false,
      error: 'Invalid chat request.',
      details: ['Request body must be a JSON object.'],
    };
  }

  const details: string[] = [];
  const selectedModel = typeof body.selectedModel === 'string' ? body.selectedModel.trim() : '';

  if (!selectedModel) {
    details.push('Choose a local Ollama model before sending a chat message.');
  }

  if (!Array.isArray(body.messages)) {
    details.push('messages must be an array.');
  }

  let companion: CompanionDraft | null = null;

  try {
    companion = parseCompanion(body.companion ?? null);
  } catch (error) {
    details.push(error instanceof Error ? error.message : 'companion is invalid.');
  }

  const messages = Array.isArray(body.messages)
    ? body.messages.map((message, index) => {
        if (!isRecord(message)) {
          details.push(`messages[${index}] must be an object.`);

          return null;
        }

        const role = message.role;
        const content = typeof message.content === 'string' ? message.content.trim() : '';

        if (role !== 'assistant' && role !== 'user') {
          details.push(`messages[${index}].role must be "assistant" or "user".`);
        }

        if (typeof message.content !== 'string') {
          details.push(`messages[${index}].content must be a string.`);
        } else if (!content) {
          details.push(`messages[${index}].content must not be empty.`);
        } else if (content.length > MAX_MESSAGE_LENGTH) {
          details.push(
            `messages[${index}].content must be ${MAX_MESSAGE_LENGTH} characters or fewer.`,
          );
        }

        if ((role === 'assistant' || role === 'user') && content) {
          const parsedRole: ChatRole = role;

          return {
            role: parsedRole,
            content,
          };
        }

        return null;
      })
    : [];

  if (messages.length < 1) {
    details.push('Provide at least one chat message.');
  } else if (messages.length > MAX_MESSAGE_COUNT) {
    details.push(`Provide no more than ${MAX_MESSAGE_COUNT} chat messages.`);
  }

  if (details.length > 0) {
    return {
      ok: false,
      error: 'Invalid chat request.',
      details,
    };
  }

  return {
    ok: true,
    value: {
      companion,
      messages: messages.filter((message): message is NonNullable<typeof message> => message !== null),
      selectedModel,
    },
  };
}
