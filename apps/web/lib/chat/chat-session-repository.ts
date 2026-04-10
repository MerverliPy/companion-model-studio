import 'server-only';

import { prisma } from '../db/prisma';

import type { ChatMessage, ChatSession } from './session-store';

function toChatSession(record: {
  id: string;
  updatedAt: Date;
  messages: Array<{
    id: string;
    role: 'assistant' | 'user';
    content: string;
    createdAt: Date;
  }>;
}): ChatSession {
  return {
    id: record.id,
    updatedAt: record.updatedAt.toISOString(),
    messages: record.messages.map((message) => ({
      id: message.id,
      role: message.role,
      content: message.content,
      createdAt: message.createdAt.toISOString(),
    })),
  };
}

function toMessageCreateInput(messages: ChatMessage[]) {
  return messages.map((message, index) => ({
    id: message.id,
    role: message.role,
    content: message.content,
    createdAt: new Date(message.createdAt),
    sequence: index,
  }));
}

export async function getActiveChatSession(): Promise<ChatSession | null> {
  const record = await prisma.chatSession.findFirst({
    orderBy: [{ updatedAt: 'desc' }, { createdAt: 'desc' }],
    include: {
      messages: {
        orderBy: { sequence: 'asc' },
      },
    },
  });

  return record ? toChatSession(record) : null;
}

export async function saveActiveChatSession(session: ChatSession): Promise<ChatSession> {
  const record = await prisma.chatSession.upsert({
    where: { id: session.id },
    create: {
      id: session.id,
      updatedAt: new Date(session.updatedAt),
      messages: {
        create: toMessageCreateInput(session.messages),
      },
    },
    update: {
      updatedAt: new Date(session.updatedAt),
      messages: {
        deleteMany: {},
        create: toMessageCreateInput(session.messages),
      },
    },
    include: {
      messages: {
        orderBy: { sequence: 'asc' },
      },
    },
  });

  return toChatSession(record);
}
