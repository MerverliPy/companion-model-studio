// @vitest-environment jsdom

import React from 'react';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ChatWorkbench } from './chat-workbench';

function jsonResponse(body: unknown, init?: ResponseInit) {
  return new Response(JSON.stringify(body), {
    headers: {
      'Content-Type': 'application/json',
    },
    ...init,
  });
}

async function flushTasks() {
  for (let index = 0; index < 5; index += 1) {
    await Promise.resolve();
  }
}

function setTextareaValue(textarea: HTMLTextAreaElement, value: string) {
  const descriptor = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value');

  descriptor?.set?.call(textarea, value);
  textarea.dispatchEvent(new Event('input', { bubbles: true }));
}

describe('ChatWorkbench', () => {
  let container: HTMLDivElement;
  let root: Root;
  let fetchMock: ReturnType<typeof vi.fn>;
  const chatRequests: Array<{ selectedModel: string; messages: Array<{ role: string; content: string }> }> = [];

  beforeEach(() => {
    (globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
    chatRequests.length = 0;

    window.localStorage.setItem(
      'companion-model-studio:draft-companion',
      JSON.stringify({
        id: 'draft-1',
        name: 'Mira',
        shortBio: 'A grounded reflection partner for local-first planning and check-ins.',
        personalityTemplate: 'warm-encourager',
        avatarTheme: 'sunrise',
        skillPacks: ['daily-reflection'],
        savedAt: '2026-04-09T00:00:00.000Z',
      }),
    );
    window.sessionStorage.setItem(
      'companion-model-studio.runtime.selected-model',
      JSON.stringify({
        selectedModel: 'llama3.2',
        availableModels: ['llama3.2'],
      }),
    );

    fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;
      const method = init?.method ?? 'GET';

      if (url === '/api/chat-sessions' && method === 'GET') {
        return jsonResponse({ session: null });
      }

      if (url === '/api/chat-sessions' && method === 'POST') {
        return jsonResponse({ session: JSON.parse(String(init?.body)) });
      }

      if (url === '/api/chat' && method === 'POST') {
        const request = JSON.parse(String(init?.body)) as {
          selectedModel: string;
          messages: Array<{ role: string; content: string }>;
        };

        chatRequests.push({
          selectedModel: request.selectedModel,
          messages: request.messages,
        });

        return jsonResponse({ reply: 'You can start with one calm next step.' });
      }

      throw new Error(`Unexpected fetch: ${method} ${url}`);
    });

    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(async () => {
    await act(async () => {
      root.unmount();
      await flushTasks();
    });

    container.remove();
    window.localStorage.clear();
    window.sessionStorage.clear();
    vi.unstubAllGlobals();
  });

  it('uses the selected model for chat sends and renders the runtime reply', async () => {
    await act(async () => {
      root.render(<ChatWorkbench />);
      await flushTasks();
    });

    const textarea = container.querySelector('textarea');
    const form = container.querySelector('form');

    expect(textarea).not.toBeNull();
    expect(form).not.toBeNull();

    await act(async () => {
      if (!textarea || !form) {
        throw new Error('Chat form did not render.');
      }

      setTextareaValue(textarea, 'Please help me pick one next step.');
      await flushTasks();
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
      await flushTasks();
    });

    expect(chatRequests).toHaveLength(1);
    expect(chatRequests[0]?.selectedModel).toBe('llama3.2');
    expect(chatRequests[0]?.messages.at(-1)).toMatchObject({
      role: 'user',
      content: 'Please help me pick one next step.',
    });
    expect(container.textContent).toContain('You can start with one calm next step.');
  });
});
