import test from "node:test";
import assert from "node:assert/strict";
import { getCountdownParts, getElapsedPercentage, KALI_YUGA_END, KALI_YUGA_START } from "../js/calendar.js";

test("counts down in calendar years followed by day-time units", () => {
  const now = new Date(Date.UTC(2026, 0, 1, 0, 0, 0));
  const parts = getCountdownParts(now, KALI_YUGA_END);

  assert.equal(parts.years, 426873);
  assert.equal(parts.days, 0);
  assert.equal(parts.hours, 0);
  assert.equal(parts.minutes, 0);
  assert.equal(parts.seconds, 0);
});

test("handles a partial year without a layout-changing unit", () => {
  const now = new Date(Date.UTC(2026, 6, 2, 3, 4, 5));
  const parts = getCountdownParts(now, KALI_YUGA_END);

  assert.equal(parts.years, 426872);
  assert.equal(parts.days, 182);
  assert.equal(parts.hours, 20);
  assert.equal(parts.minutes, 55);
  assert.equal(parts.seconds, 55);
});

test("clamps countdown and elapsed progress at the boundaries", () => {
  const before = new Date(KALI_YUGA_START.getTime() - 1000);
  const after = new Date(Date.UTC(2026, 0, 1, 0, 0, 1));
  const sameYearEnd = { year: 2026, month: 0, day: 1, hour: 0, minute: 0, second: 0 };

  assert.equal(getCountdownParts(after, sameYearEnd).totalMilliseconds, 0);
  assert.equal(getElapsedPercentage(before), 0);
  assert.equal(getElapsedPercentage(new Date(Date.UTC(2027, 0, 1)), KALI_YUGA_START, sameYearEnd), 100);
});

test("reports the traditional present-era percentage close to 1.19%", () => {
  const now = new Date(Date.UTC(2026, 0, 1));
  const percentage = getElapsedPercentage(now);

  assert.ok(percentage > 1.18 && percentage < 1.2);
});
