const CONTROL_CHARACTERS = /[\u0000-\u001f\u007f]/g;
const NON_NEWLINE_CONTROL_CHARACTERS =
  /[\u0000-\u0009\u000b-\u001f\u007f]/g;

type SanitizeOptions = {
  /** Keep line breaks (normalized to \n) for free-text message fields. */
  preserveNewlines?: boolean;
};

export function sanitizeText(
  input: string,
  maxLen: number,
  options: SanitizeOptions = {},
): string {
  if (!Number.isSafeInteger(maxLen) || maxLen < 0) {
    throw new RangeError("maxLen must be a non-negative integer");
  }

  const cleaned = options.preserveNewlines
    ? input
        .replace(/\r\n?/g, "\n")
        .replace(NON_NEWLINE_CONTROL_CHARACTERS, "")
    : input.replace(CONTROL_CHARACTERS, "");

  return Array.from(cleaned.trim()).slice(0, maxLen).join("");
}
