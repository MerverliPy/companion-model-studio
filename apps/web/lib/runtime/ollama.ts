const DEFAULT_OLLAMA_URL = 'http://127.0.0.1:11434';

export type RuntimeHealth = {
  runtime: 'ollama';
  connected: boolean;
  baseUrl: string;
  error?: string;
};

export type RuntimeModel = {
  name: string;
  modifiedAt?: string;
  size?: number;
};

export type RuntimeModelsResponse = RuntimeHealth & {
  models: RuntimeModel[];
};

export type OllamaChatMessage = {
  role: 'system' | 'assistant' | 'user';
  content: string;
};

type OllamaChatRequest = {
  messages: OllamaChatMessage[];
};

type OllamaChatResponse =
  | {
      ok: true;
      reply: string;
    }
  | {
      ok: false;
      error: string;
    };

function getBaseUrl() {
  return process.env.OLLAMA_BASE_URL ?? DEFAULT_OLLAMA_URL;
}

async function fetchOllama(path: string, init?: RequestInit) {
  return fetch(`${getBaseUrl()}${path}`, {
    ...init,
    headers: {
      Accept: 'application/json',
      ...(init?.headers ?? {}),
    },
    cache: 'no-store',
  });
}

function getDefaultChatModel(models: RuntimeModel[]) {
  return models[0]?.name;
}

export async function getRuntimeHealth(): Promise<RuntimeHealth> {
  try {
    const response = await fetchOllama('/api/version');

    if (!response.ok) {
      return {
        runtime: 'ollama',
        connected: false,
        baseUrl: getBaseUrl(),
        error: `Runtime responded with status ${response.status}.`,
      };
    }

    return {
      runtime: 'ollama',
      connected: true,
      baseUrl: getBaseUrl(),
    };
  } catch {
    return {
      runtime: 'ollama',
      connected: false,
      baseUrl: getBaseUrl(),
      error: 'Unable to reach the local Ollama runtime.',
    };
  }
}

export async function listRuntimeModels(): Promise<RuntimeModelsResponse> {
  const health = await getRuntimeHealth();

  if (!health.connected) {
    return {
      ...health,
      models: [],
    };
  }

  try {
    const response = await fetchOllama('/api/tags');

    if (!response.ok) {
      return {
        ...health,
        connected: false,
        models: [],
        error: `Runtime responded with status ${response.status}.`,
      };
    }

    const data = await response.json();
    const models = Array.isArray(data?.models)
      ? data.models.map((model: { name?: string; modified_at?: string; size?: number }) => ({
          name: model.name ?? 'unknown',
          modifiedAt: model.modified_at,
          size: typeof model.size === 'number' ? model.size : undefined,
        }))
      : [];

    return {
      ...health,
      models,
    };
  } catch {
    return {
      ...health,
      connected: false,
      models: [],
      error: 'Unable to load models from the local Ollama runtime.',
    };
  }
}

export async function sendRuntimeChat(
  request: OllamaChatRequest,
): Promise<OllamaChatResponse> {
  const models = await listRuntimeModels();
  const model = getDefaultChatModel(models.models);

  if (!models.connected || !model) {
    return {
      ok: false,
      error: models.error || 'Unable to reach the local Ollama runtime.',
    };
  }

  try {
    const response = await fetchOllama('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        stream: false,
        messages: request.messages,
      }),
    });

    if (!response.ok) {
      return {
        ok: false,
        error: `Runtime responded with status ${response.status}.`,
      };
    }

    const data = await response.json();
    const reply = data?.message?.content;

    if (typeof reply !== 'string' || !reply.trim()) {
      return {
        ok: false,
        error: 'Local Ollama returned an empty chat reply.',
      };
    }

    return {
      ok: true,
      reply,
    };
  } catch {
    return {
      ok: false,
      error: 'Unable to reach the local Ollama runtime.',
    };
  }
}
