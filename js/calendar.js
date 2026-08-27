const DAY_MS = 24 * 60 * 60 * 1000;
const HOUR_MS = 60 * 60 * 1000;
const MINUTE_MS = 60 * 1000;
const START_YEAR = -3101;
const END_YEAR = 428899;
const DURATION_YEARS = 432000;

// Astronomical year -3101 corresponds to 3102 BCE. The display intentionally
// uses the conventional BCE/CE reckoning described in the page copy.
export const KALI_YUGA_START = new Date(Date.UTC(START_YEAR, 0, 1, 0, 0, 0));
// Date cannot safely represent year 428,899, so the endpoint is kept as an
// explicit calendar year and countdown units are calculated from the current
// Gregorian year. This also keeps the no-year-zero convention visible.
export const KALI_YUGA_END = { year: END_YEAR, month: 0, day: 1, hour: 0, minute: 0, second: 0 };

function toDate(value) {
  return value instanceof Date ? new Date(value.getTime()) : new Date(value);
}

function daysInYear(year) {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0 ? 366 : 365;
}

export function getCountdownParts(now = new Date(), end = KALI_YUGA_END) {
  const current = toDate(now);
  const endYear = end.year;
  const currentYear = current.getUTCFullYear();
  const currentMonth = current.getUTCMonth();
  const currentDay = current.getUTCDate();
  const currentHour = current.getUTCHours();
  const currentMinute = current.getUTCMinutes();
  const currentSecond = current.getUTCSeconds();
  const hasReachedEnd = currentYear > endYear || (currentYear === endYear && (
    currentMonth > end.month ||
    (currentMonth === end.month && currentDay > end.day) ||
    (currentMonth === end.month && currentDay === end.day && (
      currentHour > end.hour ||
      (currentHour === end.hour && currentMinute > end.minute) ||
      (currentHour === end.hour && currentMinute === end.minute && currentSecond >= end.second)
    ))
  ));

  if (hasReachedEnd) return { years: 0, days: 0, hours: 0, minutes: 0, seconds: 0, totalMilliseconds: 0 };

  let years = endYear - currentYear;
  const isEndAnniversary = currentMonth === end.month && currentDay === end.day && currentHour === end.hour && currentMinute === end.minute && currentSecond === end.second;
  if (!isEndAnniversary) years -= 1;
  years = Math.max(0, years);

  const dayOfYear = Math.floor((Date.UTC(currentYear, currentMonth, currentDay) - Date.UTC(currentYear, 0, 1)) / DAY_MS);
  let remainder = isEndAnniversary ? 0 : (daysInYear(currentYear) - dayOfYear) * DAY_MS;
  if (!isEndAnniversary) remainder -= (currentHour * HOUR_MS) + (currentMinute * MINUTE_MS) + (currentSecond * 1000) + current.getUTCMilliseconds();
  remainder = Math.max(0, remainder);
  const difference = remainder + years * 365.2425 * DAY_MS;

  const days = Math.floor(remainder / DAY_MS);
  remainder -= days * DAY_MS;
  const hours = Math.floor(remainder / HOUR_MS);
  remainder -= hours * HOUR_MS;
  const minutes = Math.floor(remainder / MINUTE_MS);
  remainder -= minutes * MINUTE_MS;
  const seconds = Math.floor(remainder / 1000);

  return { years, days, hours, minutes, seconds, totalMilliseconds: difference };
}

export function getElapsedPercentage(now = new Date(), start = KALI_YUGA_START, end = KALI_YUGA_END) {
  const current = toDate(now);
  const currentYear = current.getUTCFullYear();
  const endYear = typeof end === "object" && "year" in end ? end.year : toDate(end).getUTCFullYear();
  if (currentYear > endYear || (currentYear === endYear && current.getTime() >= Date.UTC(endYear, end.month ?? 0, end.day ?? 1))) return 100;
  const dayOfYear = Math.floor((Date.UTC(currentYear, current.getUTCMonth(), current.getUTCDate()) - Date.UTC(currentYear, 0, 1)) / DAY_MS);
  const fractionOfYear = (dayOfYear + (current.getUTCHours() / 24) + (current.getUTCMinutes() / 1440) + (current.getUTCSeconds() / 86400)) / daysInYear(currentYear);
  const elapsedYears = currentYear - START_YEAR + fractionOfYear;
  return Math.min(100, Math.max(0, (elapsedYears / DURATION_YEARS) * 100));
}
