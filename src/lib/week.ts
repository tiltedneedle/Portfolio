/**
 * The ISO week a date falls in, Monday to Sunday, with the range as
 * printed on the call sheet. The arithmetic runs on UTC day numbers so a
 * clock change between January and the date in question cannot push a
 * week boundary by an hour.
 */
export type Week = {
  /** "2026-W39": the ISO year and week. */
  key: string;
  week: number;
  /** "21–27 Sept" or "28 Sept – 4 Oct". */
  range: string;
  /** A number that rises by one every week, for rotating picks. */
  index: number;
  /** True in the last seven days of a month: time to run the monthly process. */
  monthEnd: boolean;
};

const DAY = 86400000;
const utcDay = (y: number, m: number, d: number) => Date.UTC(y, m, d);

function shortMonth(y: number, m: number, d: number) {
  return new Date(Date.UTC(y, m, d)).toLocaleDateString("en-GB", { month: "short", timeZone: "UTC" });
}

export function weekOf(date: Date): Week {
  const y = date.getFullYear();
  const m = date.getMonth();
  const d = date.getDate();
  const today = utcDay(y, m, d);
  const dow = (new Date(today).getUTCDay() + 6) % 7; // Monday = 0
  const monday = today - dow * DAY;
  const sunday = monday + 6 * DAY;
  const thursday = monday + 3 * DAY;
  const isoYear = new Date(thursday).getUTCFullYear();
  const jan1 = utcDay(isoYear, 0, 1);
  const week = Math.floor((thursday - jan1) / DAY / 7) + 1;
  const mo = new Date(monday);
  const su = new Date(sunday);
  const sameMonth = mo.getUTCMonth() === su.getUTCMonth();
  const range = sameMonth
    ? mo.getUTCDate() + "–" + su.getUTCDate() + " " + shortMonth(su.getUTCFullYear(), su.getUTCMonth(), su.getUTCDate())
    : mo.getUTCDate() + " " + shortMonth(mo.getUTCFullYear(), mo.getUTCMonth(), mo.getUTCDate()) + " – " + su.getUTCDate() + " " + shortMonth(su.getUTCFullYear(), su.getUTCMonth(), su.getUTCDate());
  const daysInMonth = new Date(Date.UTC(y, m + 1, 0)).getUTCDate();
  return {
    key: isoYear + "-W" + String(week).padStart(2, "0"),
    week,
    range,
    index: Math.floor((thursday - utcDay(2000, 0, 6)) / DAY / 7),
    monthEnd: daysInMonth - d < 7,
  };
}
