export const APPROVED_COLORS = {
  navy: "#0C2340",
  gold: "#B08D57",
  neutral: "#F6F6F6",
  white: "#FFFFFF",
} as const;

export const APPROVED_HEX = new Set<string>(Object.values(APPROVED_COLORS));

export const cssVar = {
  navy: "var(--color-navy)",
  gold: "var(--color-gold)",
  neutral: "var(--color-neutral)",
  white: "var(--color-white)",
} as const;
