/**
 * A number grouped in threes the way en-US writes it -- 1,234,567.5, at
 * most three decimals -- without Intl. The first Intl formatter a page makes
 * loads the locale's data: 0.4s on a throttled phone, in the middle of
 * hydration, when the grouping was all that was wanted of it. Written the
 * same on the server and in the browser, so hydration never meets a figure
 * it did not render.
 */
export function groupDigits(n: number): string {
  if (!Number.isFinite(n)) return String(n);
  const [whole, frac] = Math.abs(n).toFixed(3).split(".");
  const decimals = frac.replace(/0+$/, "");
  const sign = n < 0 && (whole !== "0" || decimals) ? "-" : "";
  return sign + whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (decimals ? "." + decimals : "");
}
