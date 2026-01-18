/**
 * authEvents.ts
 *
 * Simple event system for auth state changes.
 * Avoids navigation inside axios.
 */

type Listener = () => void;

let listeners: Listener[] = [];

export const authEvents = {
  subscribe(fn: Listener) {
    listeners.push(fn);
    return () => {
      listeners = listeners.filter((l) => l !== fn);
    };
  },

  emitLogout() {
    listeners.forEach((l) => l());
  },
};
