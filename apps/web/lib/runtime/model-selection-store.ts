const SELECTED_MODEL_STORAGE_KEY = 'companion-model-studio.runtime.selected-model';

function getSessionStorage() {
  if (typeof window === 'undefined') {
    return null;
  }

  return window.sessionStorage;
}

export function loadSelectedModel() {
  const storage = getSessionStorage();

  if (!storage) {
    return '';
  }

  return storage.getItem(SELECTED_MODEL_STORAGE_KEY)?.trim() || '';
}

export function saveSelectedModel(selectedModel: string) {
  const storage = getSessionStorage();

  if (!storage) {
    return;
  }

  const normalizedModel = selectedModel.trim();

  if (!normalizedModel) {
    storage.removeItem(SELECTED_MODEL_STORAGE_KEY);
    return;
  }

  storage.setItem(SELECTED_MODEL_STORAGE_KEY, normalizedModel);
}
