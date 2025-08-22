// Centralized helpers for navigating to the voice error page
// and simple guards commonly used across voice pages

/**
 * Navigate to the shared VoiceError page.
 *
 * @param {import('react-router-dom').NavigateFunction} navigate
 * @param {object} [options]
 * @param {any} [options.cause] optional error to log
 */
export function goToVoiceError(navigate, options = {}) {
  if (options?.cause) {
    try {
      console.error("[VoiceError] cause:", options.cause);
    } catch {
      /* ignore logging issues */
    }
  }
  navigate("/voice-error");
}

/**
 * Returns true when the given text is non-empty after trimming.
 * @param {string} text
 */
export function hasRecognizedText(text) {
  return Boolean(text && typeof text === "string" && text.trim().length > 0);
}

/**
 * Guard helper: navigate to voice error if text is empty. Returns true if redirected.
 * @param {import('react-router-dom').NavigateFunction} navigate
 * @param {string} text
 */
export function ensureRecognizedOrError(navigate, text) {
  if (!hasRecognizedText(text)) {
    goToVoiceError(navigate);
    return true;
  }
  return false;
}
