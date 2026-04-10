'use client';

import { useEffect, useMemo, useState, type FormEvent } from 'react';

import {
  avatarThemes,
  personalityTemplates,
  type CompanionDraft,
} from '../../lib/companions/companion-schema';
import { loadCompanionDraft } from '../../lib/companions/draft-store';
import { skillPacks } from '../../lib/companions/skill-packs';
import {
  createAssistantMessage,
  createChatSession,
  createUserMessage,
  loadChatSession,
  saveChatSession,
  type ChatMessage,
  type ChatSession,
} from '../../lib/chat/session-store';
import { loadSelectedModelState } from '../../lib/runtime/model-selection-store';

type ComposerState = 'idle' | 'sending' | 'error';

type ChatErrorResponse = {
  error?: string;
  details?: string[];
};

function getCompanionName(companion: CompanionDraft | null) {
  return companion?.name || 'Your companion';
}

function createWelcomeMessage(companion: CompanionDraft | null) {
  const name = getCompanionName(companion);
  const prompt = companion?.shortBio || 'Save a draft companion to apply more context here.';

  return createAssistantMessage(
    `Hi, I'm ${name}. I'm ready for a local chat session. ${prompt}`,
  );
}

export function ChatWorkbench() {
  const [companion, setCompanion] = useState<CompanionDraft | null>(null);
  const [session, setSession] = useState<ChatSession | null>(null);
  const [draftMessage, setDraftMessage] = useState('');
  const [composerState, setComposerState] = useState<ComposerState>('idle');
  const [composerError, setComposerError] = useState('');

  useEffect(() => {
    const savedCompanion = loadCompanionDraft();
    setCompanion(savedCompanion);

    let isActive = true;

    async function initializeSession() {
      try {
        const savedSession = await loadChatSession();
        const nextSession =
          savedSession ||
          (await saveChatSession(createChatSession([createWelcomeMessage(savedCompanion)])));

        if (!isActive) {
          return;
        }

        setSession(nextSession);
        setComposerState('idle');
        setComposerError('');
      } catch (error) {
        if (!isActive) {
          return;
        }

        setSession(createChatSession([createWelcomeMessage(savedCompanion)]));
        setComposerState('error');
        setComposerError(
          error instanceof Error && error.message
            ? error.message
            : 'Unable to load the saved chat session right now.',
        );
      }
    }

    initializeSession();

    return () => {
      isActive = false;
    };
  }, []);

  const companionSummary = useMemo(() => {
    const template = personalityTemplates.find(
      (option) => option.value === companion?.personalityTemplate,
    );
    const avatarTheme = avatarThemes.find((option) => option.value === companion?.avatarTheme);
    const selectedSkillPacks = skillPacks.filter((pack) => companion?.skillPacks.includes(pack.value));

    return {
      template: template?.label || 'Not selected',
      avatarTheme: avatarTheme?.label || 'Not selected',
      skillPacks:
        selectedSkillPacks.length > 0
          ? selectedSkillPacks.map((pack) => pack.label).join(', ')
          : 'No skill packs selected yet',
    };
  }, [companion]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const content = draftMessage.trim();

    if (!content || !session || composerState === 'sending') {
      return;
    }

    const selectedModelState = loadSelectedModelState();

    if (selectedModelState.status !== 'valid') {
      setComposerState('error');
      setComposerError(
        selectedModelState.status === 'stale' && selectedModelState.selectedModel
          ? `${selectedModelState.selectedModel} is no longer available locally. Choose another model before sending a chat message.`
          : 'Choose a local Ollama model before sending a chat message.',
      );
      return;
    }

    const userMessage = createUserMessage(content);
    const previousSession = session;
    const optimisticSession = {
      ...session,
      messages: [...session.messages, userMessage],
      updatedAt: new Date().toISOString(),
    };

    setSession(optimisticSession);
    setDraftMessage('');
    setComposerState('sending');
    setComposerError('');

    try {
      const persistedOptimisticSession = await saveChatSession(optimisticSession);

      setSession(persistedOptimisticSession);

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          companion,
          messages: persistedOptimisticSession.messages,
          selectedModel: selectedModelState.selectedModel,
        }),
      });

      if (!response.ok) {
        const errorResult = (await response.json()) as ChatErrorResponse;
        const detailMessage = Array.isArray(errorResult.details)
          ? errorResult.details.join(' ')
          : '';

        throw new Error(
          [errorResult.error, detailMessage].filter(Boolean).join(' ') || 'Request failed',
        );
      }

      const result = (await response.json()) as { reply: string };
      const nextSession = {
        ...persistedOptimisticSession,
        messages: [...persistedOptimisticSession.messages, createAssistantMessage(result.reply)],
        updatedAt: new Date().toISOString(),
      };
      const persistedNextSession = await saveChatSession(nextSession);

      setSession(persistedNextSession);
      setComposerState('idle');
      setComposerError('');
    } catch (error) {
      const nextComposerError =
        error instanceof Error && error.message
          ? error.message
          : 'I could not send that message just now. Please try again.';

      setSession(previousSession);
      void saveChatSession(previousSession).catch(() => undefined);
      setDraftMessage(content);
      setComposerState('error');
      setComposerError(nextComposerError);
    }
  }

  return (
    <section
      aria-label="Chat workbench"
      style={{
        display: 'grid',
        gap: '1rem',
        marginTop: '1.5rem',
      }}
    >
      <div
        style={{
          border: '1px solid #d1d5db',
          borderRadius: '16px',
          padding: '1rem',
          display: 'grid',
          gap: '0.75rem',
        }}
      >
        <div>
          <strong>Companion:</strong> {getCompanionName(companion)}
        </div>
        <div>
          <strong>Bio:</strong> {companion?.shortBio || 'Save a companion draft to apply profile context.'}
        </div>
        <div>
          <strong>Template:</strong> {companionSummary.template}
        </div>
        <div>
          <strong>Theme:</strong> {companionSummary.avatarTheme}
        </div>
        <div>
          <strong>Skill packs:</strong> {companionSummary.skillPacks}
        </div>
      </div>

      <div
        style={{
          border: '1px solid #d1d5db',
          borderRadius: '16px',
          padding: '1rem',
          display: 'grid',
          gap: '1rem',
        }}
      >
        <div
          aria-live="polite"
          style={{
            display: 'grid',
            gap: '0.75rem',
            minHeight: '18rem',
          }}
        >
          {session?.messages.map((message: ChatMessage) => (
            <article
              key={message.id}
              style={{
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                padding: '0.75rem',
                background: message.role === 'assistant' ? '#f9fafb' : '#eff6ff',
              }}
            >
              <p style={{ margin: 0 }}>
                <strong>{message.role === 'assistant' ? getCompanionName(companion) : 'You'}</strong>
              </p>
              <p style={{ marginBottom: 0 }}>{message.content}</p>
            </article>
          ))}
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '0.75rem' }}>
          <label htmlFor="chat-message">Message</label>
          <textarea
            id="chat-message"
            name="message"
            rows={4}
            value={draftMessage}
            onChange={(event) => setDraftMessage(event.target.value)}
            placeholder="Ask your companion for a next step or reflection prompt."
            disabled={!session || composerState === 'sending'}
          />
          <button type="submit" disabled={!draftMessage.trim() || composerState === 'sending'}>
            {composerState === 'sending' ? 'Sending…' : 'Send message'}
          </button>
          {composerState === 'error' ? (
            <p>{composerError || 'Last send failed, but your local session was kept.'}</p>
          ) : null}
        </form>
      </div>
    </section>
  );
}
