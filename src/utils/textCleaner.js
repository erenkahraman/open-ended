const PUNCTUATION_REGEX = /[^\w\s.,!?-]/g;
const WHITESPACE_REGEX = /\s+/g;

export function cleanText(text) {
  if (!text?.trim()) return '';
  
  return text
    .trim()
    .toLowerCase()
    .replace(WHITESPACE_REGEX, ' ')
    .replace(PUNCTUATION_REGEX, '')
    .replace(WHITESPACE_REGEX, ' ')
    .trim();
}

export function countWords(text) {
  return text?.trim() ? text.trim().split(/\s+/).length : 0;
}

export function validateText(text, minLength = 10, minWords = 5) {
  if (!text?.trim()) return false;
  
  const cleaned = cleanText(text);
  return cleaned.length >= minLength && countWords(cleaned) >= minWords;
}
