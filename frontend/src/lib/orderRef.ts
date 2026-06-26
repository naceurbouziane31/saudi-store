/**
 * Generates a human-readable order reference, e.g. `NAD-2026-000123`.
 * Counter is in-process for the simulator; PR5 will replace with one
 * minted server-side by FastAPI.
 */
let counter = Math.floor(Math.random() * 900_000) + 100_000;

export const generateOrderRef = (): string => {
  counter += 1;
  const year = new Date().getUTCFullYear();
  return `NAD-${year}-${counter.toString().padStart(6, "0")}`;
};
