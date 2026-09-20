import React from 'react';

// Bosch Garden of Earthly Delights decorative iconography & vignettes
export const BoschFountain: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 100 100" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Surreal mineral-coral fountain spire typical of Bosch's central Eden pool */}
    <path d="M50 2 C48 15 42 22 36 28 C42 30 58 30 64 28 C58 22 52 15 50 2 Z" fill="#e06b75" />
    <circle cx="50" cy="18" r="4" fill="#6ba4b8" />
    <path d="M35 30 C20 40 18 52 28 62 C34 58 40 56 50 56 C60 56 66 58 72 62 C82 52 80 40 65 30 C58 33 42 33 35 30 Z" fill="#d95d70" />
    {/* Floating spheres and orbs */}
    <circle cx="50" cy="42" r="8" fill="#f4d35e" />
    <circle cx="50" cy="42" r="4" fill="#3a5a40" />
    <circle cx="32" cy="45" r="4" fill="#588b8b" />
    <circle cx="68" cy="45" r="4" fill="#588b8b" />
    {/* Lower basin */}
    <path d="M24 64 C12 75 20 90 50 92 C80 90 88 75 76 64 C65 70 35 70 24 64 Z" fill="#4d7c8a" />
    <path d="M42 92 L38 98 L62 98 L58 92 Z" fill="#344e41" />
  </svg>
);

export const BoschOwl: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 100 100" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Bosch's iconic watchful owl hidden in the fountain cavity */}
    <ellipse cx="50" cy="55" rx="30" ry="38" fill="#4a3728" />
    <circle cx="36" cy="38" r="14" fill="#d4a373" />
    <circle cx="64" cy="38" r="14" fill="#d4a373" />
    <circle cx="36" cy="38" r="8" fill="#1b1c14" />
    <circle cx="64" cy="38" r="8" fill="#1b1c14" />
    <circle cx="38" cy="36" r="2.5" fill="#fefae0" />
    <circle cx="66" cy="36" r="2.5" fill="#fefae0" />
    <polygon points="50,42 46,54 54,54" fill="#b07d62" />
    {/* Feathers tufts */}
    <polygon points="26,20 32,30 22,28" fill="#4a3728" />
    <polygon points="74,20 68,30 78,28" fill="#4a3728" />
  </svg>
);

export const BoschStrawberry: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 100 100" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Giant strawberry from the central earthly delight panel */}
    <path d="M50 92 C25 75 18 45 28 26 C36 14 64 14 72 26 C82 45 75 75 50 92 Z" fill="#c13e48" />
    {/* Seeds */}
    <circle cx="38" cy="35" r="2" fill="#ffd166" />
    <circle cx="50" cy="30" r="2" fill="#ffd166" />
    <circle cx="62" cy="35" r="2" fill="#ffd166" />
    <circle cx="44" cy="48" r="2.5" fill="#ffd166" />
    <circle cx="56" cy="48" r="2.5" fill="#ffd166" />
    <circle cx="34" cy="55" r="2" fill="#ffd166" />
    <circle cx="66" cy="55" r="2" fill="#ffd166" />
    <circle cx="50" cy="65" r="2.5" fill="#ffd166" />
    <circle cx="42" cy="76" r="2" fill="#ffd166" />
    <circle cx="58" cy="76" r="2" fill="#ffd166" />
    {/* Green crown calyx */}
    <path d="M50 15 L42 24 L30 18 L36 28 L20 28 L32 36 L50 25 L68 36 L80 28 L64 28 L70 18 L58 24 Z" fill="#2d6a4f" />
    <path d="M50 15 Q52 4 60 5" stroke="#2d6a4f" strokeWidth="4" fill="none" strokeLinecap="round" />
  </svg>
);

export const BoschCreature: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 100 100" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Whimsical Bosch bird-beast / hybrid messenger */}
    <ellipse cx="45" cy="60" rx="25" ry="18" fill="#3a5a40" />
    <path d="M60 55 Q75 40 85 30 L95 32 L88 42 Q80 50 68 62 Z" fill="#588157" />
    {/* Long funnel beak */}
    <polygon points="25,58 5,50 22,64" fill="#dda15e" />
    {/* Funnel bell headpiece */}
    <path d="M35 48 C30 35 24 25 36 12 C45 25 42 38 38 48 Z" fill="#bc6c25" />
    <circle cx="36" cy="12" r="4" fill="#d4af37" />
    {/* Fish tail / leafy plumage */}
    <path d="M68 62 C78 72 88 70 94 82 C82 82 75 75 66 68 Z" fill="#c13e48" />
    {/* Legs */}
    <path d="M40 78 L36 94 M52 78 L56 94" stroke="#bc6c25" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

export const BoschTriptychWings: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 100 100" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Arched Renaissance triptych shutter silhouettes */}
    <path d="M10 90 L10 35 C10 18 25 10 32 10 L32 90 Z" fill="#3d2b1f" stroke="#d4af37" strokeWidth="2" />
    <path d="M36 90 L36 20 C36 8 50 4 50 4 C50 4 64 8 64 20 L64 90 Z" fill="#543d2b" stroke="#d4af37" strokeWidth="2" />
    <path d="M68 90 L68 10 C75 10 90 18 90 35 L90 90 Z" fill="#3d2b1f" stroke="#d4af37" strokeWidth="2" />
    {/* Little hinges */}
    <rect x="32" y="30" width="4" height="8" fill="#d4af37" />
    <rect x="32" y="70" width="4" height="8" fill="#d4af37" />
    <rect x="64" y="30" width="4" height="8" fill="#d4af37" />
    <rect x="64" y="70" width="4" height="8" fill="#d4af37" />
  </svg>
);
