import { sanitizeText } from "@/lib/leads/sanitize";

test("strips control characters and trims", () => {
  expect(sanitizeText("  hello\u0000\n\tworld\u007f  ", 100)).toBe(
    "helloworld",
  );
});

test("enforces max length", () => {
  expect(sanitizeText("abcdef", 3)).toBe("abc");
});

test("does not split a surrogate pair at the maximum length", () => {
  expect(sanitizeText("ab😀c", 3)).toBe("ab😀");
});

test("preserveNewlines keeps line breaks but strips other control characters", () => {
  expect(
    sanitizeText("a\r\nb\u0000\tc\rd", 100, { preserveNewlines: true }),
  ).toBe("a\nbc\nd");
});
