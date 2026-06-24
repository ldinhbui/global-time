import type { DateFormat, TimeFormat } from "@/constants/preferences";

const DATE_FORMAT_OPTIONS: Record<
  DateFormat,
  Intl.DateTimeFormatOptions
> = {
  long: { month: "long", day: "numeric", year: "numeric" },
  medium: { month: "short", day: "numeric", year: "numeric" },
  short: { month: "numeric", day: "numeric", year: "2-digit" },
  numeric: { month: "2-digit", day: "2-digit", year: "numeric" },
};

export function formatTime(
  date: Date,
  timezone: string,
  timeFormat: TimeFormat = "12h",
): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    hour: "numeric",
    minute: "2-digit",
    hour12: timeFormat === "12h",
  }).format(date);
}

export function formatDate(
  date: Date,
  timezone: string,
  dateFormat: DateFormat = "long",
): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    ...DATE_FORMAT_OPTIONS[dateFormat],
  }).format(date);
}

export function getTimezoneLabel(date: Date, timezone: string): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    timeZoneName: "shortOffset",
  }).formatToParts(date);

  const offset =
    parts.find((part) => part.type === "timeZoneName")?.value ?? "UTC";

  const abbrevParts = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    timeZoneName: "short",
  }).formatToParts(date);

  const abbrev =
    abbrevParts.find((part) => part.type === "timeZoneName")?.value ?? "UTC";

  return `${abbrev} (${offset})`;
}

export function getClockAngles(date: Date, timezone: string) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: false,
  }).formatToParts(date);

  const hour = Number(parts.find((p) => p.type === "hour")?.value ?? 0);
  const minute = Number(parts.find((p) => p.type === "minute")?.value ?? 0);
  const second = Number(parts.find((p) => p.type === "second")?.value ?? 0);

  const hourAngle = ((hour % 12) + minute / 60) * 30;
  const minuteAngle = (minute + second / 60) * 6;
  const secondAngle = second * 6;

  return { hourAngle, minuteAngle, secondAngle };
}

export function isDaytime(date: Date, timezone: string) {
  const hour = Number(
    new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      hour: "numeric",
      hour12: false,
    }).format(date),
  );

  return hour >= 6 && hour < 18;
}
