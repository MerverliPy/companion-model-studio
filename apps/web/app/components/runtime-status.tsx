'use client';

import { useEffect, useState } from 'react';

type RuntimeHealth = {
  runtime: 'ollama';
  connected: boolean;
  baseUrl: string;
  error?: string;
};

type RuntimeModel = {
  name: string;
  modifiedAt?: string;
  size?: number;
};

type RuntimeModelsResponse = RuntimeHealth & {
  models: RuntimeModel[];
};

export function RuntimeStatus() {
  const [health, setHealth] = useState<RuntimeHealth | null>(null);
  const [models, setModels] = useState<RuntimeModel[]>([]);
  const [selectedModel, setSelectedModel] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isActive = true;

    async function loadRuntimeState() {
      try {
        const [healthResponse, modelsResponse] = await Promise.all([
          fetch('/api/runtime/health', { cache: 'no-store' }),
          fetch('/api/runtime/models', { cache: 'no-store' }),
        ]);

        const nextHealth = (await healthResponse.json()) as RuntimeHealth;
        const nextModels = (await modelsResponse.json()) as RuntimeModelsResponse;

        if (!isActive) {
          return;
        }

        setHealth(nextHealth);
        setModels(nextModels.models);
        setSelectedModel((current) => current || nextModels.models[0]?.name || '');
      } catch {
        if (!isActive) {
          return;
        }

        setHealth({
          runtime: 'ollama',
          connected: false,
          baseUrl: 'http://127.0.0.1:11434',
          error: 'Unable to load runtime status from the web shell.',
        });
        setModels([]);
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    loadRuntimeState();

    return () => {
      isActive = false;
    };
  }, []);

  return (
    <section aria-labelledby="runtime-status-heading">
      <h2 id="runtime-status-heading">Local runtime</h2>
      <p>
        Status:{' '}
        <strong>{isLoading ? 'Checking…' : health?.connected ? 'Connected' : 'Disconnected'}</strong>
      </p>
      <p>
        Runtime: Ollama
        {health ? ` (${health.baseUrl})` : ''}
      </p>
      {health?.error ? <p>{health.error}</p> : null}

      <label htmlFor="runtime-model-select">Selected model</label>
      <select
        id="runtime-model-select"
        value={selectedModel}
        onChange={(event) => setSelectedModel(event.target.value)}
        disabled={isLoading || models.length === 0}
      >
        {models.length === 0 ? (
          <option value="">No local models available</option>
        ) : (
          models.map((model) => (
            <option key={model.name} value={model.name}>
              {model.name}
            </option>
          ))
        )}
      </select>

      <p>{selectedModel ? `Using ${selectedModel} for this page session.` : 'Choose a local model when one is available.'}</p>
    </section>
  );
}
