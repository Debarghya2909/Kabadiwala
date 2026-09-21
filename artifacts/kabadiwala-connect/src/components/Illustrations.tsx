import React from 'react';

// Illustration 1: Friendly Indian Collector with green recycling truck and parcels (Matches Screen 1 in reference mockup)
export const CollectorHeroIllustration: React.FC<{ className?: string }> = ({ className = 'w-full h-auto' }) => (
  <svg
    viewBox="0 0 400 320"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-label="Kabadiwala collector with green recycling truck"
  >
    <defs>
      <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#ecfdf5" />
        <stop offset="100%" stopColor="#d1fae5" />
      </linearGradient>
      <linearGradient id="truckGrad" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#059669" />
        <stop offset="100%" stopColor="#10b981" />
      </linearGradient>
      <linearGradient id="skinGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#d97706" />
        <stop offset="100%" stopColor="#b45309" />
      </linearGradient>
    </defs>

    {/* Background Soft Sky & Circular Glow */}
    <circle cx="200" cy="160" r="145" fill="url(#skyGrad)" opacity="0.8" />
    <circle cx="320" cy="110" r="60" fill="#a7f3d0" opacity="0.4" />

    {/* Background Trees */}
    <ellipse cx="280" cy="160" rx="35" ry="50" fill="#34d399" opacity="0.7" />
    <ellipse cx="320" cy="170" rx="30" ry="40" fill="#10b981" opacity="0.7" />
    <ellipse cx="250" cy="175" rx="25" ry="35" fill="#059669" opacity="0.6" />

    {/* Recycling Truck in Background */}
    <g transform="translate(190, 150)">
      {/* Truck Body */}
      <rect x="0" y="20" width="160" height="75" rx="8" fill="url(#truckGrad)" />
      {/* Truck Cab */}
      <path d="M120 20 L150 40 L160 55 L160 95 L120 95 Z" fill="#047857" />
      {/* Cab Window */}
      <path d="M126 28 L146 43 L146 58 L126 58 Z" fill="#bae6fd" opacity="0.9" />
      {/* White Recycle Logo on Truck Cargo Body */}
      <circle cx="65" cy="55" r="18" fill="white" opacity="0.95" />
      <path
        d="M65 44 L69 49 L65 49 C61 49 58 52 58 56 L55 56 C55 50 59 46 65 46 Z M74 54 C74 58 71 62 67 63 L68 66 L63 64 L65 59 L66 61 C69 60 71 57 71 54 Z M57 58 C58 58 60 61 63 61 L63 64 C58 64 56 61 55 58 Z"
        fill="#059669"
      />
      {/* Wheels */}
      <circle cx="35" cy="95" r="15" fill="#1f2937" />
      <circle cx="35" cy="95" r="7" fill="#9ca3af" />
      <circle cx="135" cy="95" r="15" fill="#1f2937" />
      <circle cx="135" cy="95" r="7" fill="#9ca3af" />
    </g>

    {/* Road / Ground base */}
    <rect x="20" y="270" width="360" height="24" rx="12" fill="#e2e8f0" />
    <line x1="50" y1="282" x2="90" y2="282" stroke="white" strokeWidth="4" strokeLinecap="round" />
    <line x1="120" y1="282" x2="160" y2="282" stroke="white" strokeWidth="4" strokeLinecap="round" />
    <line x1="190" y1="282" x2="230" y2="282" stroke="white" strokeWidth="4" strokeLinecap="round" />

    {/* Collector Character (Foreground Hero) */}
    <g transform="translate(60, 90)">
      {/* Large Recycled Scrap Sack slung over shoulder */}
      <path
        d="M20 180 C-10 170 -15 110 5 80 C20 60 55 70 60 100 C65 130 50 190 20 180 Z"
        fill="#374151"
      />
      <path
        d="M25 170 C10 160 5 120 15 95 C25 80 45 85 50 110"
        stroke="#4b5563"
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* Body / Shirt */}
      <path
        d="M60 115 L120 115 L135 185 L50 185 Z"
        fill="#b45309"
      />
      {/* Gamcha / Scarf over neck */}
      <path
        d="M80 115 C80 135 100 135 100 115 L108 115 C108 145 72 145 72 115 Z"
        fill="#fef08a"
      />
      <path d="M72 125 L70 170 L80 170 L82 125 Z" fill="#fef08a" />
      <path d="M98 125 L96 165 L104 165 L106 125 Z" fill="#fef08a" />

      {/* Left Arm holding carton box */}
      <path d="M110 125 L145 155 L130 170 L100 145 Z" fill="#d97706" />

      {/* Cardboard Box being carried */}
      <g transform="translate(105, 140)">
        <rect x="0" y="0" width="55" height="42" rx="4" fill="#d97706" stroke="#b45309" strokeWidth="2" />
        <line x1="27" y1="0" x2="27" y2="42" stroke="#b45309" strokeWidth="2" strokeDasharray="4 2" />
        <rect x="18" y="8" width="18" height="6" rx="2" fill="#fef3c7" />
      </g>

      {/* Trousers */}
      <rect x="62" y="185" width="26" height="50" rx="3" fill="#1e3a8a" />
      <rect x="94" y="185" width="26" height="50" rx="3" fill="#1e3a8a" />

      {/* Head & Face */}
      <circle cx="90" cy="85" r="22" fill="#f59e0b" />
      {/* Friendly Smile & Mustache */}
      <path d="M84 92 Q90 98 96 92" stroke="#78350f" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M82 89 C86 87 94 87 98 89" stroke="#1f2937" strokeWidth="3" strokeLinecap="round" />
      {/* Eyes */}
      <circle cx="85" cy="82" r="2.5" fill="#1f2937" />
      <circle cx="95" cy="82" r="2.5" fill="#1f2937" />
      {/* Ears */}
      <circle cx="68" cy="85" r="5" fill="#f59e0b" />
      <circle cx="112" cy="85" r="5" fill="#f59e0b" />

      {/* Green Cap */}
      <path d="M68 80 C68 62 112 62 112 80 Z" fill="#059669" />
      <path d="M66 80 C80 75 110 75 125 82 L122 86 C105 80 80 80 66 84 Z" fill="#047857" />
    </g>
  </svg>
);

// Illustration 2: Friendly Collector Avatar with green foliage (Matches Screen 2 greeting in reference mockup)
export const CollectorAvatarIllustration: React.FC<{ className?: string }> = ({ className = 'w-16 h-16' }) => (
  <svg
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-label="Collector avatar"
  >
    {/* Soft green circle background */}
    <circle cx="50" cy="50" r="46" fill="#d1fae5" />

    {/* Green Foliage behind */}
    <path d="M75 35 C85 25 90 45 80 55 C70 65 65 45 75 35 Z" fill="#10b981" opacity="0.8" />
    <path d="M25 35 C15 25 10 45 20 55 C30 65 35 45 25 35 Z" fill="#34d399" opacity="0.8" />

    {/* Shoulders & Shirt */}
    <path d="M22 92 C25 74 38 68 50 68 C62 68 75 74 78 92 Z" fill="#b45309" />
    {/* Yellow Scarf / Gamcha */}
    <path d="M42 68 C42 78 58 78 58 68 L64 68 C64 84 36 84 36 68 Z" fill="#fef08a" />
    <path d="M38 72 L36 92 L44 92 L46 72 Z" fill="#fef08a" />
    <path d="M56 72 L54 92 L62 92 L64 72 Z" fill="#fef08a" />

    {/* Neck & Face */}
    <rect x="44" y="58" width="12" height="12" rx="4" fill="#f59e0b" />
    <circle cx="50" cy="46" r="18" fill="#f59e0b" />

    {/* Mustache & Smile */}
    <path d="M44 51 C47 49 53 49 56 51" stroke="#1f2937" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M46 54 Q50 58 54 54" stroke="#78350f" strokeWidth="2" fill="none" strokeLinecap="round" />
    {/* Eyes */}
    <circle cx="45" cy="44" r="2" fill="#1f2937" />
    <circle cx="55" cy="44" r="2" fill="#1f2937" />

    {/* Green Cap */}
    <path d="M33 42 C33 28 67 28 67 42 Z" fill="#059669" />
    <path d="M31 42 C40 38 65 38 77 44 L75 47 C65 42 42 42 31 45 Z" fill="#047857" />
  </svg>
);

// Illustration 3: Green Logistics Truck & Modern Sustainable Depot (Matches Screen 6 in reference mockup)
export const RecyclingWarehouseIllustration: React.FC<{ className?: string }> = ({ className = 'w-full h-auto' }) => (
  <svg
    viewBox="0 0 320 180"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-label="Recycling depot with truck and solar panels"
  >
    <defs>
      <linearGradient id="depotSky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#f0fdf4" />
        <stop offset="100%" stopColor="#dcfce7" />
      </linearGradient>
    </defs>

    {/* Sky & Sun */}
    <rect width="320" height="180" rx="16" fill="url(#depotSky)" />
    <circle cx="280" cy="45" r="24" fill="#fef08a" opacity="0.6" />

    {/* Trees in Background */}
    <ellipse cx="60" cy="110" rx="20" ry="32" fill="#a7f3d0" />
    <ellipse cx="85" cy="105" rx="24" ry="38" fill="#34d399" />
    <ellipse cx="270" cy="120" rx="28" ry="40" fill="#10b981" />
    <ellipse cx="295" cy="125" rx="18" ry="30" fill="#059669" />

    {/* Eco Warehouse Facility */}
    <g transform="translate(130, 45)">
      {/* Main Building Body */}
      <rect x="0" y="35" width="130" height="75" fill="#e2e8f0" />
      {/* Roof with Solar Panels */}
      <path d="M-10 35 L65 5 L140 35 Z" fill="#94a3b8" />
      {/* Solar Panel Cells */}
      <path d="M15 30 L65 8 L85 8 L35 30 Z" fill="#1e3a8a" opacity="0.85" />
      <line x1="30" y1="20" x2="70" y2="20" stroke="#93c5fd" strokeWidth="1" />
      <line x1="45" y1="12" x2="55" y2="28" stroke="#93c5fd" strokeWidth="1" />
      {/* Warehouse Door */}
      <rect x="40" y="60" width="50" height="50" rx="4" fill="#64748b" />
      <line x1="65" y1="60" x2="65" y2="110" stroke="#94a3b8" strokeWidth="2" />
      {/* Windows */}
      <rect x="15" y="48" width="16" height="16" rx="2" fill="#bae6fd" />
      <rect x="100" y="48" width="16" height="16" rx="2" fill="#bae6fd" />
    </g>

    {/* Ground & Road */}
    <rect x="0" y="145" width="320" height="35" fill="#cbd5e1" />
    <line x1="20" y1="162" x2="60" y2="162" stroke="white" strokeWidth="3" strokeLinecap="round" />
    <line x1="90" y1="162" x2="130" y2="162" stroke="white" strokeWidth="3" strokeLinecap="round" />
    <line x1="160" y1="162" x2="200" y2="162" stroke="white" strokeWidth="3" strokeLinecap="round" />

    {/* Modern Green Recycling Truck */}
    <g transform="translate(30, 85)">
      {/* Cargo Body */}
      <rect x="0" y="20" width="110" height="48" rx="6" fill="#059669" />
      {/* Cab */}
      <path d="M110 30 L132 42 L138 52 L138 68 L110 68 Z" fill="#047857" />
      {/* Window */}
      <path d="M114 36 L128 44 L128 54 L114 54 Z" fill="#bae6fd" />
      {/* White Recycle Symbol */}
      <circle cx="55" cy="44" r="14" fill="white" />
      <path
        d="M55 36 L58 40 L55 40 C52 40 50 42 50 45 L47 45 C47 41 50 38 55 38 Z M62 43 C62 46 60 49 57 50 L58 52 L54 51 L55 47 L56 49 C58 48 60 46 60 43 Z M49 46 C50 46 52 48 54 48 L54 50 C50 50 48 48 48 46 Z"
        fill="#059669"
      />
      {/* Wheels */}
      <circle cx="25" cy="68" r="11" fill="#1e293b" />
      <circle cx="25" cy="68" r="5" fill="#94a3b8" />
      <circle cx="95" cy="68" r="11" fill="#1e293b" />
      <circle cx="95" cy="68" r="5" fill="#94a3b8" />
      <circle cx="126" cy="68" r="11" fill="#1e293b" />
      <circle cx="126" cy="68" r="5" fill="#94a3b8" />
    </g>
  </svg>
);

// Material Icons Matching Screen 3 in Reference Image
export const CardboardBoxIcon: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="6" y="12" width="36" height="30" rx="4" fill="#d97706" />
    <path d="M6 16 L24 26 L42 16" stroke="#b45309" strokeWidth="2.5" />
    <path d="M24 26 L24 42" stroke="#b45309" strokeWidth="2.5" />
    <rect x="18" y="6" width="12" height="6" rx="1.5" fill="#fef3c7" stroke="#d97706" strokeWidth="2" />
  </svg>
);

export const PlasticBottleIcon: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="20" y="4" width="8" height="6" rx="2" fill="#0284c7" />
    <path d="M21 10 L16 16 L16 40 C16 42.2 17.8 44 20 44 L28 44 C30.2 44 32 42.2 32 40 L32 16 L27 10 Z" fill="#38bdf8" />
    <rect x="16" y="24" width="16" height="8" fill="#bae6fd" opacity="0.8" />
    <line x1="20" y1="20" x2="28" y2="20" stroke="#0284c7" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const MetalBeamIcon: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Ingot 1 */}
    <path d="M8 26 L14 18 L34 18 L40 26 L8 26 Z" fill="#94a3b8" />
    <rect x="8" y="26" width="32" height="14" rx="2" fill="#64748b" />
    {/* Ingot 2 in back */}
    <path d="M14 16 L18 10 L38 10 L42 16 Z" fill="#cbd5e1" />
  </svg>
);

export const GlassBottleIcon: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="21" y="4" width="6" height="5" rx="1.5" fill="#059669" />
    <path d="M22 9 L17 17 L17 40 C17 42 18.5 44 21 44 L27 44 C29.5 44 31 42 31 40 L31 17 L26 9 Z" fill="#10b981" />
    <line x1="21" y1="22" x2="27" y2="22" stroke="#d1fae5" strokeWidth="2" strokeLinecap="round" />
    <line x1="21" y1="28" x2="27" y2="28" stroke="#d1fae5" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const EwastePhoneIcon: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="14" y="6" width="20" height="36" rx="4" fill="#334155" stroke="#1e293b" strokeWidth="2" />
    <rect x="17" y="11" width="14" height="24" rx="2" fill="#38bdf8" />
    <circle cx="24" cy="38" r="1.5" fill="#94a3b8" />
    <line x1="21" y1="8" x2="27" y2="8" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const CableCoilIcon: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <ellipse cx="24" cy="24" rx="18" ry="12" fill="none" stroke="#ea580c" strokeWidth="4" />
    <ellipse cx="24" cy="26" rx="14" ry="9" fill="none" stroke="#ca8a04" strokeWidth="3.5" />
    <rect x="36" y="16" width="7" height="10" rx="2" fill="#334155" />
    <rect x="5" y="24" width="7" height="10" rx="2" fill="#334155" />
  </svg>
);
