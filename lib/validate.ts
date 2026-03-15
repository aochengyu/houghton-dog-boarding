/**
 * Server-side validation and sanitization utilities.
 * All functions are pure and safe to call in Server Actions.
 */

/** Strip HTML tags and dangerous control chars, trim, enforce max length */
export function sanitize(str: string, maxLen: number): string {
  return str
    .replace(/<[^>]*>/g, "")
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "")
    .trim()
    .slice(0, maxLen);
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export function isValidUUID(str: string): boolean {
  return UUID_RE.test(str ?? "");
}

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
export function isValidDate(str: string): boolean {
  if (!DATE_RE.test(str ?? "")) return false;
  const d = new Date(str);
  return !isNaN(d.getTime());
}

/** Referral codes are exactly 6 uppercase alphanumeric characters */
const REFERRAL_CODE_RE = /^[A-Z0-9]{6}$/;
export function isValidReferralCode(str: string): boolean {
  return REFERRAL_CODE_RE.test(str ?? "");
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export function isValidEmail(str: string): boolean {
  return EMAIL_RE.test(str ?? "") && str.length <= 254;
}

const VALID_SERVICES = new Set(["boarding", "day-care", "walking", "drop-in"]);
export function isValidService(str: string): boolean {
  return VALID_SERVICES.has(str ?? "");
}

const VALID_STATUSES = new Set(["inquiry", "confirmed", "active", "completed", "cancelled"]);
export function isValidStatus(str: string): boolean {
  return VALID_STATUSES.has(str ?? "");
}
