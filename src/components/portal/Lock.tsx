/**
 * The mark on a door that is not this client's yet.
 *
 * Drawn rather than set in a font: the system loads four faces and none of
 * them is an icon face, and a padlock character would arrive in whatever
 * the browser fell back to, at whatever weight that face happens to be.
 *
 * Decorative by default. Where the lock is the only thing saying a row is
 * locked, pass `label` so it is said out loud as well as drawn.
 */
export function Lock({ className = "", label }: { className?: string; label?: string }) {
  return (
    <span className={"inline-flex items-center " + className}>
      <svg viewBox="0 0 12 14" width="10" height="12" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true" className="shrink-0">
        <rect x="1" y="6" width="10" height="7" rx="1" />
        <path d="M3.4 6V3.9a2.6 2.6 0 0 1 5.2 0V6" />
      </svg>
      {label && <span className="sr-only">{label}</span>}
    </span>
  );
}
