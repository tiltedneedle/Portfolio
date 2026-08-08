// Caps how many videos may be fetching at once so a grid of autoplaying
// previews doesn't saturate the connection. Max 4 concurrent loads.
const MAX_CONCURRENT = 4;

let active = 0;
const queue: Array<() => void> = [];

export const loadedSrcs = new Set<string>();

export function requestSlot(): Promise<void> {
  if (active < MAX_CONCURRENT) {
    active++;
    return Promise.resolve();
  }
  return new Promise<void>((resolve) => {
    queue.push(() => {
      active++;
      resolve();
    });
  });
}

export function releaseSlot() {
  active--;
  if (queue.length > 0) queue.shift()!();
}
