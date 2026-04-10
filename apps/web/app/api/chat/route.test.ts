import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../../../lib/runtime/ollama', () => ({
  sendRuntimeChat: vi.fn(),
}));

import { POST } from './route';
import { sendRuntimeChat } from '../../../lib/runtime/ollama';

const sendRuntimeChatMock = vi.mocked(sendRuntimeChat);

describe('POST /api/chat', () => {
  beforeEach(() => {
    sendRuntimeChatMock.mockReset();
  });

  it('rejects invalid chat payloads before runtime dispatch', async () => {
    const response = await POST(
      new Request('http://localhost/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [],
          selectedModel: '   ',
        }),
      }),
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({
      error: 'Invalid chat request.',
      details: expect.arrayContaining([
        'Choose a local Ollama model before sending a chat message.',
        'Provide at least one chat message.',
      ]),
    });
    expect(sendRuntimeChatMock).not.toHaveBeenCalled();
  });

  it('dispatches the selected model and trimmed messages to the runtime', async () => {
    sendRuntimeChatMock.mockResolvedValue({
      ok: true,
      reply: 'Local reply',
    });

    const response = await POST(
      new Request('http://localhost/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          companion: {
            id: 'draft-1',
            name: 'Mira',
            shortBio: 'A grounded reflection partner for local-first practice.',
            personalityTemplate: 'warm-encourager',
            avatarTheme: 'sunrise',
            skillPacks: ['daily-reflection'],
            savedAt: '2026-04-09T00:00:00.000Z',
          },
          messages: [{ role: 'user', content: '  Help me plan today.  ' }],
          selectedModel: 'llama3.2',
        }),
      }),
    );

    expect(sendRuntimeChatMock).toHaveBeenCalledWith({
      selectedModel: 'llama3.2',
      messages: [
        {
          role: 'system',
          content: expect.stringContaining('You are Mira.'),
        },
        {
          role: 'user',
          content: 'Help me plan today.',
        },
      ],
    });
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ reply: 'Local reply' });
  });
});
