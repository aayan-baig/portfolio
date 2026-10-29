import { profile } from "./content";

function birthCalendar(date: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return null;
  const parsed = new Date(`${date}T00:00:00Z`);
  return Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0, 10) === date ? parsed : null;
}

// Use the birth location's calendar so the birthday changes at midnight in India,
// independently of the visitor's time zone. Dates are never parsed as local time.
export function ageOnDate(birthDate: string, now = new Date()): number | null {
  const birth = birthCalendar(birthDate);
  if (!birth || !Number.isFinite(now.getTime())) return null;
  const parts = new Intl.DateTimeFormat("en", {
    timeZone: profile.timeZone, year: "numeric", month: "2-digit", day: "2-digit",
  }).formatToParts(now);
  const value = (type: Intl.DateTimeFormatPartTypes) => Number(parts.find((part) => part.type === type)?.value);
  let age = value("year") - birth.getUTCFullYear();
  if (value("month") < birth.getUTCMonth() + 1
    || (value("month") === birth.getUTCMonth() + 1 && value("day") < birth.getUTCDate())) age -= 1;
  return age >= 0 ? age : null;
}

export function birthdayLabel(birthDate: string, includeYear = false): string {
  const birth = birthCalendar(birthDate);
  if (!birth) return "";
  return new Intl.DateTimeFormat("en-US", {
    month: "long", day: "numeric", ...(includeYear ? { year: "numeric" } as const : {}), timeZone: "UTC",
  }).format(birth);
}
