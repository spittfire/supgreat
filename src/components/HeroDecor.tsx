/**
 * Dekorativer Farbakzent hinter dem Landing-Hero. Dezent, aber sichtbar genug,
 * damit die Seite nicht monochrom wirkt. Blurry SVG-Blobs, kein JS.
 */
export function HeroDecor() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <svg
        viewBox="0 0 1200 800"
        className="absolute -top-40 -right-40 w-[70%] max-w-[900px] opacity-70"
      >
        <defs>
          <radialGradient id="blob-a" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#C4964A" stopOpacity="0.55" />
            <stop offset="70%" stopColor="#C4964A" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="blob-b" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#8FA68E" stopOpacity="0.6" />
            <stop offset="70%" stopColor="#8FA68E" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="blob-c" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#D4736B" stopOpacity="0.4" />
            <stop offset="70%" stopColor="#D4736B" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="760" cy="260" r="320" fill="url(#blob-a)" />
        <circle cx="400" cy="520" r="360" fill="url(#blob-b)" />
        <circle cx="980" cy="540" r="260" fill="url(#blob-c)" />
      </svg>
    </div>
  );
}
