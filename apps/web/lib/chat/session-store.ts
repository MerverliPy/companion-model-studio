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

const storageKey = 'companion-model-studio:chat-session';

function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
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

export function loadChatSession(): ChatSession | null {
  const stored = window.localStorage.getItem(storageKey);

  if (!stored) {
    return null;
  }

  try {
    return JSON.parse(stored) as ChatSession;
  } catch {
    return null;
  }
}

export function saveChatSession(session: ChatSession) {
  window.localStorage.setItem(storageKey, JSON.stringify(session));
}
