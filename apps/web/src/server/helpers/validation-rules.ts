// "09:00" OK, "9:00" not OK, "24:00" not OK
export const TIME_HH_MM = /^([01]\d|2[0-3]):[0-5]\d$/;

// Intl throws if the timezone name doesn't exist (e.g. "Asia/Nowhere")
export function isValidTimeZone(timeZone: string) {
  try {
    new Intl.DateTimeFormat('en-US', { timeZone });
    return true;
  } catch {
    return false;
  }
}

// Removes duplicates: ["MON","MON","TUE"] -> ["MON","TUE"]
export const unique = <T>(items: T[]) => [...new Set(items)];
