/**
 * Kuwait mobile phone helpers.
 *
 * Kuwait mobile numbers are 8 digits and must start with 5, 6 or 9.
 * E.164 form is +965XXXXXXXX.
 */
const KUWAIT_LOCAL_RE = /^[569]\d{7}$/;
const KUWAIT_E164_RE = /^\+965[569]\d{7}$/;

const stripNonDigits = (raw: string): string => raw.replace(/[^\d+]/g, "");

/**
 * Returns the canonical local 8-digit form, or null if invalid.
 * Accepts: "50001234", "+96550001234", "0096550001234", " 5000 1234 ".
 */
export const normalizeKuwaitLocal = (raw: string): string | null => {
  if (!raw) return null;
  let digits = stripNonDigits(raw);
  if (digits.startsWith("+965")) digits = digits.slice(4);
  else if (digits.startsWith("00965")) digits = digits.slice(5);
  else if (digits.startsWith("965") && digits.length === 11) digits = digits.slice(3);
  if (KUWAIT_LOCAL_RE.test(digits)) return digits;
  return null;
};

/** Returns +965XXXXXXXX or null if invalid. */
export const toE164 = (raw: string): string | null => {
  const local = normalizeKuwaitLocal(raw);
  return local ? `+965${local}` : null;
};

/** True for any input that can be normalized to a valid Kuwait mobile number. */
export const isValidKuwaitPhone = (raw: string): boolean => normalizeKuwaitLocal(raw) !== null;

/** True only for strict E.164 (+965 + 8 digits starting 5/6/9). */
export const isValidE164 = (raw: string): boolean => KUWAIT_E164_RE.test(raw);

/**
 * Pretty-print a phone for read-only display: 5000 1234.
 * Falls back to the input if it doesn't normalize.
 */
export const formatKuwaitLocal = (raw: string): string => {
  const local = normalizeKuwaitLocal(raw);
  if (!local) return raw;
  return `${local.slice(0, 4)} ${local.slice(4)}`;
};
