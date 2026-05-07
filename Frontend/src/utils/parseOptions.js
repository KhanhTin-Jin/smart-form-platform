/**
 * Parses an options string into a clean array of strings.
 * Handles both CSV format ("A, B, C") and JSON array format (["A","B","C"]).
 * Ensures backward compatibility with old data stored as CSV.
 *
 * @param {string|null} optionsStr - The raw options string from the API.
 * @returns {string[]} - Array of trimmed option strings.
 */
export const parseOptions = (optionsStr) => {
  if (!optionsStr) return [];
  try {
    const parsed = JSON.parse(optionsStr);
    if (Array.isArray(parsed)) return parsed.map((s) => String(s).trim());
  } catch (e) {
    // Not valid JSON, fall through to CSV parsing
  }
  return optionsStr.split(',').map((s) => s.trim()).filter(Boolean);
};
