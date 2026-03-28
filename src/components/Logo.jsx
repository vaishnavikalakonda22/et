/**
 * MoneyMentor Logo — Orbit AI mark (Logo C adapted for Slate Ocean palette)
 * A circular orbit ring enclosing a stylised "M" lettermark.
 * The small orbiting dot represents the AI sitting in motion around the M.
 */
export default function Logo({ size = 30, showWordmark = true, className = '' }) {
  const id = `lg-${size}`
  return (
    <span className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* ── SVG Mark ── */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={`${id}-a`} x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
            <stop stopColor="#38bdf8" />
            <stop offset="1" stopColor="#818cf8" />
          </linearGradient>
          <linearGradient id={`${id}-b`} x1="0" y1="0" x2="36" y2="0" gradientUnits="userSpaceOnUse">
            <stop stopColor="#0ea5e9" />
            <stop offset="1" stopColor="#38bdf8" />
          </linearGradient>
        </defs>

        {/* Outer orbit ring — dashed */}
        <circle
          cx="18" cy="18" r="16"
          stroke={`url(#${id}-a)`}
          strokeWidth="1.5"
          strokeDasharray="3.5 2.5"
          opacity="0.35"
        />

        {/* Inner subtle fill */}
        <circle
          cx="18" cy="18" r="12"
          fill={`url(#${id}-a)`}
          opacity="0.06"
        />

        {/* M lettermark — clean, geometric */}
        <path
          d="M9 24.5V12L18 20L27 12V24.5"
          stroke={`url(#${id}-b)`}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Orbiting dot — top-right of orbit */}
        <circle
          cx="31.3" cy="10.2" r="2.2"
          fill="#38bdf8"
          opacity="0.9"
        />

        {/* Small inner glow dot */}
        <circle cx="31.3" cy="10.2" r="1" fill="white" opacity="0.6" />
      </svg>

      {/* ── Wordmark ── */}
      {showWordmark && (
        <span className="font-bold tracking-tight leading-none" style={{ fontSize: size * 0.6 }}>
          <span className="text-white">Money</span>
          <span
            style={{
              background: 'linear-gradient(135deg, #38bdf8 0%, #818cf8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Mentor
          </span>
        </span>
      )}
    </span>
  )
}
