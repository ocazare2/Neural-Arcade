interface StorageReader {
  getItem: (key: string) => string | null;
}

interface StorageWriter {
  setItem: (key: string, value: string) => void;
}

export function readBooleanFlag(
  storage: StorageReader,
  key: string,
  fallback = false,
): boolean {
  try {
    return storage.getItem(key) === "1";
  } catch {
    return fallback;
  }
}

export function writeBooleanFlag(storage: StorageWriter, key: string): boolean {
  try {
    storage.setItem(key, "1");
    return true;
  } catch {
    return false;
  }
}
