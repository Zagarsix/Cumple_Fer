import { useState, useEffect } from "react";

const STORAGE_KEY = "cumpleUnlock";
const DURATION_MS = 60 * 60 * 1000; // 1 hora

export function useUnlock() {
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const { expiresAt } = JSON.parse(stored);
      if (expiresAt > Date.now()) {
        setUnlocked(true);
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  const unlock = () => {
    const expiresAt = Date.now() + DURATION_MS;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ expiresAt }));
    setUnlocked(true);
  };

  return { unlocked, unlock };
}