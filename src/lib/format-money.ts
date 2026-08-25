/** Display helpers for the Acme example ledger. Amounts are USD dollars. */

export function usdCompact(value: number): string {
  const sign = value < 0 ? "−" : "";
  const abs = Math.abs(value);
  if (abs >= 1_000_000) {
    const millions = abs / 1_000_000;
    const digits = millions >= 10 ? 1 : 2;
    return `${sign}$${millions.toFixed(digits)}M`;
  }
  if (abs >= 1_000) {
    return `${sign}$${Math.round(abs / 1_000)}K`;
  }
  return `${sign}$${Math.round(abs).toLocaleString("en-US")}`;
}

export function usdExact(value: number): string {
  const sign = value < 0 ? "−" : "";
  return `${sign}$${Math.round(Math.abs(value)).toLocaleString("en-US")}`;
}

export function signedPct(value: number, digits = 1): string {
  const sign = value >= 0 ? "+" : "−";
  return `${sign}${Math.abs(value).toFixed(digits)}%`;
}
