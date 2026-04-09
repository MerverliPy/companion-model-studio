'use client';

import { useEffect, useState } from 'react';

import {
  loadSelectedModel,
  saveSelectedModel,
} from '../../lib/runtime/model-selection-store';

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

        const storedSelectedModel = loadSelectedModel();
        const hasStoredSelectedModel = nextModels.models.some(
          (model) => model.name === storedSelectedModel,
        );

        setHealth(nextHealth);
        setModels(nextModels.models);
        setSelectedModel(hasStoredSelectedModel ? storedSelectedModel : '');

        if (!hasStoredSelectedModel) {
          saveSelectedModel('');
        }
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
        onChange={(event) => {
          const nextSelectedModel = event.target.value;

          setSelectedModel(nextSelectedModel);
          saveSelectedModel(nextSelectedModel);
        }}
        disabled={isLoading || models.length === 0}
      >
        <option value="">Choose a local model</option>
        {models.length === 0 ? (
          <option value="" disabled>
            No local models available
          </option>
        ) : (
          models.map((model) => (
            <option key={model.name} value={model.name}>
              {model.name}
            </option>
          ))
        )}
      </select>

      <p>
        {selectedModel
          ? `Using ${selectedModel} for this page session.`
          : 'Choose a local model before sending a chat message.'}
      </p>
    </section>
  );
}
