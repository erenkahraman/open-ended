export function cleanText(text) {
  return (
    text
      // Remove extra whitespace
      .replace(/\s+/g, " ")
      // Remove special characters but keep sentence structure
      .replace(/[^\w\s.,!?-]/g, "")
      // Normalize whitespace around punctuation
      .replace(/\s*([.,!?])\s*/g, "$1 ")
      // Remove multiple consecutive punctuation
      .replace(/([.,!?])+/g, "$1")
      // Trim whitespace
      .trim()
  );
}
