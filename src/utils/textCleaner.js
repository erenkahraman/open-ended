export function cleanText(text) {
  if (!text) return '';
  
  return text
    .trim()
    .replace(/\s+/g, ' ')        // normalize whitespace
    .replace(/[^\w\s.,!?-]/g, '') // remove special characters except basic punctuation
    .replace(/\s+/g, ' ');       // normalize whitespace again
}
