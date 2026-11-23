const CONTROL_CHARACTERS = /[\u0000-\u001f\u007f]/g;

export function sanitizeText(input: string, maxLen: number): string {
  if (!Number.isSafeInteger(maxLen) || maxLen < 0) {
    throw new RangeError("maxLen must be a non-negative integer");
  }

  return Array.from(input.replace(CONTROL_CHARACTERS, "").trim())
    .slice(0, maxLen)
    .join("");
}
