import clsx from "clsx";

/** The smiling cat from the logo, peeking over an edge with two little paws. */
export function CatPeek({ className, color = "white" }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 120 84" className={className} aria-hidden="true">
      <g fill={color}>
        <path d="M30 70 V34 Q30 18 40 10 L46 26 Q60 20 74 26 L80 10 Q90 18 90 34 V70 Z" />
        <ellipse cx="22" cy="74" rx="13" ry="9" />
        <ellipse cx="98" cy="74" rx="13" ry="9" />
      </g>
      <g fill="none" stroke="#0b7a5b" strokeWidth="3" strokeLinecap="round">
        <path d="M44 44 q5 -6 10 0" />
        <path d="M66 44 q5 -6 10 0" />
        <path d="M54 56 q6 6 12 0" />
      </g>
      <path d="M56 51 h8 l-4 4 z" fill="#0b7a5b" />
      <g stroke="#0b7a5b" strokeOpacity=".35" strokeWidth="1.6" strokeLinecap="round">
        <path d="M26 52 h-14 M27 58 l-13 4" />
        <path d="M94 52 h14 M93 58 l13 4" />
      </g>
      <g stroke="#0b7a5b" strokeOpacity=".4" strokeWidth="1.6" strokeLinecap="round">
        <path d="M18 76 v-4 M22 77 v-5 M26 76 v-4" />
        <path d="M94 76 v-4 M98 77 v-5 M102 76 v-4" />
      </g>
    </svg>
  );
}

export function Paw({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true" fill="currentColor">
      <ellipse cx="20" cy="26" rx="8" ry="7" />
      <circle cx="9" cy="17" r="4" />
      <circle cx="16" cy="10" r="4" />
      <circle cx="24" cy="10" r="4" />
      <circle cx="31" cy="17" r="4" />
    </svg>
  );
}

export function Logo({ className, light = false }: { className?: string; light?: boolean }) {
  return (
    <span className={clsx("relative inline-flex items-end font-display font-bold leading-none", className)}>
      <span
        className={clsx("text-[1.9em] tracking-tight", light ? "sticker-text" : "text-leaf")}
        style={light ? undefined : { WebkitTextStroke: "0" }}
      >
        Furr<span className="relative">e<CatPeek className="absolute -top-[0.62em] left-1/2 w-[1.15em] -translate-x-1/2" color={light ? "white" : "#12a27a"} /></span>ndly
      </span>
    </span>
  );
}

export function PetIcon({ type, className }: { type: string; className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true" fill="currentColor">
      <PetIconPaths type={type} />
    </svg>
  );
}

/**
 * Illustrated food pouch so the catalog looks finished before real photography exists.
 * Swap for <Image> once you have product shots — the card layout already reserves a square.
 */
export function ProductPack({
  color,
  name,
  brand,
  petType,
  size = "md",
  className,
}: {
  color: string;
  name: string;
  brand: string;
  petType: string;
  size?: "md" | "lg";
  className?: string;
}) {
  const words = name.split(" ");
  const line1 = words.slice(0, Math.ceil(words.length / 2)).join(" ");
  const line2 = words.slice(Math.ceil(words.length / 2)).join(" ");
  const longest = Math.max(line1.length, line2.length);
  const nameSize = Math.min(size === "lg" ? 13 : 12.5, 104 / (longest * 0.56));
  const brandSize = Math.min(11, 92 / (brand.length * 0.72));
  const id = `p${color.replace("#", "")}${petType}`;
  return (
    <svg viewBox="0 0 200 240" className={className} role="img" aria-label={`${brand} ${name} pack`}>
      <defs>
        <linearGradient id={`${id}-shine`} x1="0" x2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset=".5" stopColor="#fff" stopOpacity=".28" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <ellipse cx="100" cy="228" rx="70" ry="8" fill="#0e3b2e" opacity=".12" />
      <path
        d="M40 30 Q38 20 48 20 H152 Q162 20 160 30 L172 200 Q174 220 154 220 H46 Q26 220 28 200 Z"
        fill={color}
        stroke="#0e3b2e"
        strokeWidth="4"
      />
      <path d="M44 20 H156 V36 H44Z" fill="#0e3b2e" opacity=".18" />
      {Array.from({ length: 12 }).map((_, i) => (
        <path key={i} d={`M${50 + i * 9} 22 v12`} stroke="#0e3b2e" strokeOpacity=".25" strokeWidth="2" />
      ))}
      <rect x="56" y="40" width="22" height="170" fill={`url(#${id}-shine)`} />
      <text x="100" y="62" textAnchor="middle" fontFamily="Fredoka Variable, sans-serif" fontWeight="600" fontSize={brandSize} fill="#fff" opacity=".9" letterSpacing="0.6">
        {brand.toUpperCase()}
      </text>
      <circle cx="100" cy="112" r="38" fill="#fffbf2" stroke="#0e3b2e" strokeWidth="3" />
      <svg x="72" y="84" width="56" height="56" viewBox="0 0 64 64" color={color}>
        <g fill={color}>
          <PetIconPaths type={petType} />
        </g>
      </svg>
      <rect x="44" y="160" width="112" height={line2 ? 44 : 30} rx="12" fill="#fffbf2" stroke="#0e3b2e" strokeWidth="3" />
      <text x="100" y="179" textAnchor="middle" fontFamily="Fredoka Variable, sans-serif" fontWeight="700" fontSize={nameSize} fill="#0e3b2e">
        {line1}
      </text>
      {line2 && (
        <text x="100" y="196" textAnchor="middle" fontFamily="Fredoka Variable, sans-serif" fontWeight="700" fontSize={nameSize} fill="#0e3b2e">
          {line2}
        </text>
      )}
    </svg>
  );
}

function PetIconPaths({ type }: { type: string }) {
  if (type === "cat")
    return (
      <>
        <path d="M12 54 V26 Q12 14 18 8 L24 20 Q32 16 40 20 L46 8 Q52 14 52 26 V54 Q32 62 12 54Z" />
        <circle cx="24" cy="32" r="3" fill="white" />
        <circle cx="40" cy="32" r="3" fill="white" />
        <path d="M29 40 h6 l-3 3z" fill="white" />
      </>
    );
  if (type === "small_pet")
    return (
      <>
        <ellipse cx="24" cy="16" rx="6" ry="14" />
        <ellipse cx="40" cy="16" rx="6" ry="14" />
        <ellipse cx="32" cy="40" rx="20" ry="18" />
        <circle cx="25" cy="38" r="3" fill="white" />
        <circle cx="39" cy="38" r="3" fill="white" />
        <ellipse cx="32" cy="46" rx="3" ry="2" fill="white" />
      </>
    );
  return (
    <>
      <ellipse cx="14" cy="26" rx="8" ry="16" transform="rotate(18 14 26)" />
      <ellipse cx="50" cy="26" rx="8" ry="16" transform="rotate(-18 50 26)" />
      <ellipse cx="32" cy="34" rx="18" ry="20" />
      <circle cx="25" cy="31" r="3" fill="white" />
      <circle cx="39" cy="31" r="3" fill="white" />
      <ellipse cx="32" cy="42" rx="5" ry="4" fill="white" />
    </>
  );
}
