// High-fidelity vector fashion illustrations as reliable standalone data URIs
// Guaranteed to never break or fail external host checks, perfectly styled for Yatrababa.com

function createSvgDataUri(svgContent: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgContent.trim())}`;
}

export const fashionSvgImages = {
  hero: createSvgDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" width="1600" height="900">
      <defs>
        <linearGradient id="heroBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#fff5f2"/>
          <stop offset="50%" stop-color="#fed7cc"/>
          <stop offset="100%" stop-color="#f5e1da"/>
        </linearGradient>
        <linearGradient id="silkGlow" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#e07a5f"/>
          <stop offset="50%" stop-color="#f28482"/>
          <stop offset="100%" stop-color="#d65d4b"/>
        </linearGradient>
        <linearGradient id="goldAccent" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#f6bd60"/>
          <stop offset="100%" stop-color="#e76f51"/>
        </linearGradient>
      </defs>
      <rect width="1600" height="900" fill="url(#heroBg)"/>
      <circle cx="1250" cy="450" r="380" fill="#fceade" opacity="0.8"/>
      <circle cx="1300" cy="420" r="300" fill="#fcd5ce" opacity="0.6"/>
      <path d="M1050 220 Q1200 150 1350 260 T1450 600 Q1300 780 1120 740 Z" fill="url(#silkGlow)" opacity="0.35"/>
      <g transform="translate(1000, 180) scale(1.1)">
        <path d="M120 80 Q140 30 170 80 Q190 140 185 240 L195 480 Q170 540 130 520 L105 240 Z" fill="#2d3142" opacity="0.9"/>
        <path d="M135 170 Q210 210 260 380 Q220 480 160 520 Q120 380 135 170 Z" fill="url(#silkGlow)"/>
        <path d="M170 80 Q210 110 250 160 L240 280 Q190 200 170 80 Z" fill="url(#goldAccent)"/>
        <circle cx="155" cy="50" r="32" fill="#d4a373"/>
        <path d="M135 45 Q155 15 180 40 Q165 75 135 45 Z" fill="#1d2d44"/>
      </g>
      <path d="M0 780 Q400 720 800 780 T1600 750 L1600 900 L0 900 Z" fill="#fff" opacity="0.7"/>
    </svg>
  `),

  western: createSvgDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000" width="800" height="1000">
      <defs>
        <linearGradient id="wBg" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#f7f2ea"/>
          <stop offset="100%" stop-color="#e9decb"/>
        </linearGradient>
        <linearGradient id="suitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#4a5568"/>
          <stop offset="100%" stop-color="#2d3748"/>
        </linearGradient>
      </defs>
      <rect width="800" height="1000" fill="url(#wBg)"/>
      <rect x="180" y="240" width="440" height="660" rx="24" fill="#ffffff" opacity="0.5"/>
      <g transform="translate(250, 150)">
        <circle cx="150" cy="110" r="50" fill="#e2b192"/>
        <path d="M100 105 Q150 60 200 105 Q190 150 150 150 Q110 150 100 105 Z" fill="#1a202c"/>
        <path d="M80 180 L220 180 L250 480 L180 500 L150 320 L120 500 L50 480 Z" fill="url(#suitGrad)"/>
        <path d="M110 180 L150 290 L190 180 Z" fill="#ffffff"/>
        <path d="M70 480 L140 760 L160 760 L230 480 Z" fill="#2d3748"/>
      </g>
    </svg>
  `),

  saree: createSvgDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000" width="800" height="1000">
      <defs>
        <linearGradient id="sareeBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#fdf0ed"/>
          <stop offset="100%" stop-color="#fed0c5"/>
        </linearGradient>
        <linearGradient id="sareeRed" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#b91c1c"/>
          <stop offset="50%" stop-color="#dc2626"/>
          <stop offset="100%" stop-color="#991b1b"/>
        </linearGradient>
        <linearGradient id="zariGold" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#fbbf24"/>
          <stop offset="50%" stop-color="#fef08a"/>
          <stop offset="100%" stop-color="#f59e0b"/>
        </linearGradient>
      </defs>
      <rect width="800" height="1000" fill="url(#sareeBg)"/>
      <g transform="translate(260, 140)">
        <circle cx="140" cy="100" r="45" fill="#c68a68"/>
        <path d="M100 95 Q140 50 180 95 Q170 140 140 135 Q110 140 100 95 Z" fill="#18181b"/>
        <path d="M70 180 Q140 160 210 180 L230 290 Q140 280 50 290 Z" fill="url(#sareeRed)"/>
        <path d="M210 180 Q290 280 270 540 Q210 680 90 740 L60 680 Q190 590 210 320 Z" fill="url(#sareeRed)"/>
        <path d="M270 540 L285 550 Q230 700 95 760 L90 740 Q210 680 270 540 Z" fill="url(#zariGold)"/>
        <path d="M70 290 Q140 330 210 290 L220 740 Q140 760 60 740 Z" fill="url(#sareeRed)"/>
        <rect x="60" y="720" width="160" height="20" fill="url(#zariGold)"/>
      </g>
    </svg>
  `),

  desi: createSvgDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000" width="800" height="1000">
      <defs>
        <linearGradient id="desiBg" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#fbf5f0"/>
          <stop offset="100%" stop-color="#ebd8c8"/>
        </linearGradient>
        <linearGradient id="emerald" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#065f46"/>
          <stop offset="50%" stop-color="#047857"/>
          <stop offset="100%" stop-color="#064e3b"/>
        </linearGradient>
      </defs>
      <rect width="800" height="1000" fill="url(#desiBg)"/>
      <g transform="translate(250, 140)">
        <circle cx="150" cy="100" r="45" fill="#d29979"/>
        <path d="M110 95 Q150 50 190 95 Q180 140 150 140 Q120 140 110 95 Z" fill="#18181b"/>
        <path d="M80 170 L220 170 L260 490 L40 490 Z" fill="url(#emerald)"/>
        <path d="M40 490 L300 740 L0 740 Z" fill="url(#emerald)" opacity="0.95"/>
        <path d="M120 170 L180 170 L150 280 Z" fill="#fbbf24"/>
      </g>
    </svg>
  `),

  indoWestern: createSvgDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000" width="800" height="1000">
      <defs>
        <linearGradient id="iwBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#f3e8ee"/>
          <stop offset="100%" stop-color="#deb8cc"/>
        </linearGradient>
        <linearGradient id="magentaFusion" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#831843"/>
          <stop offset="50%" stop-color="#be185d"/>
          <stop offset="100%" stop-color="#9d174d"/>
        </linearGradient>
      </defs>
      <rect width="800" height="1000" fill="url(#iwBg)"/>
      <g transform="translate(260, 130)">
        <circle cx="140" cy="110" r="45" fill="#c68a68"/>
        <path d="M100 105 Q140 60 180 105 Q170 150 140 145 Z" fill="#18181b"/>
        <path d="M80 180 L200 180 L230 420 L160 440 L140 270 L120 440 L50 420 Z" fill="url(#magentaFusion)"/>
        <path d="M160 210 Q280 290 270 650 L220 720 Q210 420 150 300 Z" fill="#db2777" opacity="0.85"/>
        <path d="M70 440 L130 760 L150 760 L210 440 Z" fill="#4a044e"/>
      </g>
    </svg>
  `),

  partyWear: createSvgDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000" width="800" height="1000">
      <defs>
        <linearGradient id="pwBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#1e1b4b"/>
          <stop offset="100%" stop-color="#0f172a"/>
        </linearGradient>
        <linearGradient id="sparkle" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#c084fc"/>
          <stop offset="50%" stop-color="#e879f9"/>
          <stop offset="100%" stop-color="#f43f5e"/>
        </linearGradient>
      </defs>
      <rect width="800" height="1000" fill="url(#pwBg)"/>
      <g transform="translate(260, 140)">
        <circle cx="140" cy="100" r="45" fill="#dfad92"/>
        <path d="M100 95 Q140 50 180 95 Q170 140 140 135 Z" fill="#0f172a"/>
        <path d="M90 180 L190 180 L230 420 L50 420 Z" fill="url(#sparkle)"/>
        <path d="M50 420 L270 760 L10 760 Z" fill="url(#sparkle)" opacity="0.9"/>
        <circle cx="100" cy="300" r="4" fill="#ffffff" opacity="0.8"/>
        <circle cx="180" cy="360" r="5" fill="#ffffff" opacity="0.8"/>
        <circle cx="140" cy="520" r="6" fill="#ffffff" opacity="0.9"/>
      </g>
    </svg>
  `),

  accessories: createSvgDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000" width="800" height="1000">
      <defs>
        <linearGradient id="accBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#fafaf9"/>
          <stop offset="100%" stop-color="#e7e5e4"/>
        </linearGradient>
        <linearGradient id="goldJ" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#f59e0b"/>
          <stop offset="50%" stop-color="#fde047"/>
          <stop offset="100%" stop-color="#d97706"/>
        </linearGradient>
      </defs>
      <rect width="800" height="1000" fill="url(#accBg)"/>
      <g transform="translate(220, 200)">
        <!-- Statement Jhumka / Earrings -->
        <circle cx="120" cy="100" r="28" fill="url(#goldJ)"/>
        <path d="M80 150 Q120 120 160 150 L180 230 Q120 250 60 230 Z" fill="url(#goldJ)"/>
        <!-- Luxury Handbag / Clutch -->
        <rect x="40" y="320" width="300" height="200" rx="20" fill="#991b1b"/>
        <rect x="40" y="320" width="300" height="80" rx="10" fill="#b91c1c"/>
        <circle cx="190" cy="400" r="14" fill="url(#goldJ)"/>
        <path d="M110 320 Q190 240 270 320" stroke="#f59e0b" stroke-width="8" fill="none"/>
      </g>
    </svg>
  `),
};
