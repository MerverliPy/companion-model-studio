const SELECTED_MODEL_STORAGE_KEY = 'companion-model-studio.runtime.selected-model';

type ModelSelectionStore = {
  selectedModel: string;
  availableModels: string[];
};

export type SelectedModelState = {
  selectedModel: string;
  status: 'missing' | 'stale' | 'valid';
};

function getSessionStorage() {
  if (typeof window === 'undefined') {
    return null;
  }

  return window.sessionStorage;
}

export function loadSelectedModel() {
  return loadModelSelectionStore().selectedModel;
}

function loadModelSelectionStore(): ModelSelectionStore {
  const storage = getSessionStorage();

  if (!storage) {
    return {
      selectedModel: '',
      availableModels: [],
    };
  }

  const savedValue = storage.getItem(SELECTED_MODEL_STORAGE_KEY)?.trim();

  if (!savedValue) {
    return {
      selectedModel: '',
      availableModels: [],
    };
  }

  try {
    const parsedValue = JSON.parse(savedValue) as {
      selectedModel?: string;
      availableModels?: unknown;
    };

    return {
      selectedModel: parsedValue.selectedModel?.trim() || '',
      availableModels: Array.isArray(parsedValue.availableModels)
        ? parsedValue.availableModels.filter((value): value is string => typeof value === 'string')
        : [],
    };
  } catch {
    return {
      selectedModel: savedValue,
      availableModels: [],
    };
  }
}

function saveModelSelectionStore(nextState: ModelSelectionStore) {
  const storage = getSessionStorage();

  if (!storage) {
    return;
  }

  if (!nextState.selectedModel && nextState.availableModels.length === 0) {
    storage.removeItem(SELECTED_MODEL_STORAGE_KEY);
    return;
  }

  storage.setItem(SELECTED_MODEL_STORAGE_KEY, JSON.stringify(nextState));
}

export function saveSelectedModel(selectedModel: string) {
  const currentState = loadModelSelectionStore();

  const normalizedModel = selectedModel.trim();

  saveModelSelectionStore({
    ...currentState,
    selectedModel: normalizedModel,
  });
}

export function saveAvailableModels(availableModels: string[]) {
  const currentState = loadModelSelectionStore();

  saveModelSelectionStore({
    ...currentState,
    availableModels: availableModels
      .map((model) => model.trim())
      .filter((model, index, models) => Boolean(model) && models.indexOf(model) === index),
  });
}

export function loadSelectedModelState(): SelectedModelState {
  const { selectedModel, availableModels } = loadModelSelectionStore();

  if (!selectedModel) {
    return {
      selectedModel: '',
      status: 'missing',
    };
  }

  if (availableModels.length > 0 && !availableModels.includes(selectedModel)) {
    return {
      selectedModel,
      status: 'stale',
    };
  }

  return {
    selectedModel,
    status: 'valid',
  };
}
