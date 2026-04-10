export type ChatMessage = {
  id: string;
  role: 'assistant' | 'user';
  content: string;
  createdAt: string;
};

export type ChatSession = {
  id: string;
  messages: ChatMessage[];
  updatedAt: string;
};

type ChatSessionResponse = {
  error?: string;
  session?: unknown;
};

function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function isChatMessage(value: unknown): value is ChatMessage {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const message = value as Record<string, unknown>;

  return (
    typeof message.id === 'string' &&
    (message.role === 'assistant' || message.role === 'user') &&
    typeof message.content === 'string' &&
    typeof message.createdAt === 'string'
  );
}

export function isChatSession(value: unknown): value is ChatSession {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const session = value as Record<string, unknown>;

  return (
    typeof session.id === 'string' &&
    typeof session.updatedAt === 'string' &&
    Array.isArray(session.messages) &&
    session.messages.every(isChatMessage)
  );
}

async function parseChatSessionResponse(response: Response) {
  const body = (await response.json()) as ChatSessionResponse;

  if (!response.ok) {
    throw new Error(body.error ?? 'Unable to load chat session.');
  }

  if (!body.session) {
    return null;
  }

  if (!isChatSession(body.session)) {
    throw new Error('Received an invalid chat session response.');
  }

  return body.session;
}

export function createUserMessage(content: string): ChatMessage {
  return {
    id: createId('user'),
    role: 'user',
    content,
    createdAt: new Date().toISOString(),
  };
}

export function createAssistantMessage(content: string): ChatMessage {
  return {
    id: createId('assistant'),
    role: 'assistant',
    content,
    createdAt: new Date().toISOString(),
  };
}

export function createChatSession(messages: ChatMessage[]): ChatSession {
  return {
    id: createId('session'),
    messages,
    updatedAt: new Date().toISOString(),
  };
}

export async function loadChatSession(): Promise<ChatSession | null> {
  const response = await fetch('/api/chat-sessions', {
    method: 'GET',
    cache: 'no-store',
  });

  return parseChatSessionResponse(response);
}

export async function saveChatSession(session: ChatSession): Promise<ChatSession> {
  const response = await fetch('/api/chat-sessions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(session),
  });

  const savedSession = await parseChatSessionResponse(response);

  if (!savedSession) {
    throw new Error('Chat session save did not return a session.');
  }

  return savedSession;
}
