// HTML stripping utility
export const stripHtml = (html: string): string => {
  if (!html) return "";
  // Remove HTML tags
  let cleaned = html.replace(/<[^>]*>/g, " ");
  // Remove HTML entities
  cleaned = cleaned.replace(/&[a-zA-Z0-9#]+;/g, " ");
  // Remove extra whitespace
  cleaned = cleaned.replace(/\s+/g, " ").trim();
  return cleaned;
};

// Sentence extraction utility
export const sentences = (text: string): string[] => {
  if (!text) return [];
  // Split by sentence endings (., !, ?) followed by space or end of string
  return text.split(/[.!?]+(?=\s|$)/).filter(s => s.trim().length > 0);
};
