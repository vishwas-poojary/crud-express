import crypto from "crypto";

export function generateTransactionId(): string {
  return `tx_${crypto.randomUUID().replace(/-/g, "").slice(0, 16)}`;
}

export function generateId(): string {
  return crypto.randomUUID();
}

export function parseNumber(value: string | number | undefined, defaultValue = 0): number {
  if (typeof value === "number") return value;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? defaultValue : parsed;
  }
  return defaultValue;
}
