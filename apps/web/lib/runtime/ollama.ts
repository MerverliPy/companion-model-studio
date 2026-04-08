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

function getBaseUrl() {
  return process.env.OLLAMA_BASE_URL ?? DEFAULT_OLLAMA_URL;
}

async function fetchOllama(path: string) {
  return fetch(`${getBaseUrl()}${path}`, {
    headers: {
      Accept: 'application/json',
    },
    cache: 'no-store',
  });
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
