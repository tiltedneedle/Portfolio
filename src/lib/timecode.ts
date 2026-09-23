export function pad2(n: number) {
  return n < 10 ? "0" + n : String(n);
}

/** SMPTE-style timecode from seconds, 25 fps. */
export function timecode(seconds: number, fps = 25) {
  const s = Math.max(0, seconds);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = Math.floor(s % 60);
  const f = Math.floor((s - Math.floor(s)) * fps);
  return pad2(h) + ":" + pad2(m) + ":" + pad2(sec) + ":" + pad2(f);
}
