import React from 'react';

export const OnboardingEmblem: React.FC<{ className?: string }> = ({ className = 'w-20 h-20' }) => (
  <svg viewBox="0 0 96 96" fill="none" className={className} aria-hidden="true">
    <circle cx="48" cy="48" r="46" fill="#EDE7DC" />
    {/* Left student silhouette */}
    <circle cx="33" cy="37" r="7.5" fill="#CBBFB2" />
    <path d="M19 60C19 52.5 25.2 47 33 47C40.8 47 47 52.5 47 60H19Z" fill="#CBBFB2" />
    {/* Right student silhouette */}
    <circle cx="63" cy="37" r="7.5" fill="#CBBFB2" />
    <path d="M49 60C49 52.5 55.2 47 63 47C70.8 47 77 52.5 77 60H49Z" fill="#CBBFB2" />
    {/* Steam lines */}
    <path d="M41 25C40 28 42.5 30 41 34" stroke="#9B8675" strokeWidth="2.2" strokeLinecap="round" />
    <path d="M48 23C47 26.5 49.5 29 48 33" stroke="#9B8675" strokeWidth="2.2" strokeLinecap="round" />
    <path d="M55 25C54 28 56.5 30 55 34" stroke="#9B8675" strokeWidth="2.2" strokeLinecap="round" />
    {/* Coffee cup */}
    <path
      d="M32 39H60V53C60 59.6 54.6 65 48 65H44C37.4 65 32 59.6 32 53V39Z"
      fill="#382418"
    />
    {/* Cup handle */}
    <path
      d="M60 43H64.5C67.5 43 69.5 45 69.5 48C69.5 51 67.5 53 64.5 53H60"
      stroke="#382418"
      strokeWidth="3.2"
      strokeLinecap="round"
    />
    {/* Saucer */}
    <rect x="26" y="65.5" width="44" height="4" rx="2" fill="#382418" />
  </svg>
);

export const StudentAvatar: React.FC<{
  variant: 'arsen' | 'aizat' | 'dinara' | 'kamila' | 'user';
  className?: string;
}> = ({ variant, className = 'w-11 h-11' }) => {
  const palettes = {
    user: { bg: '#D9C5AD', shirt: '#596146', hair: '#271A13', skin: '#E9C3A3', accent: '#382418' },
    arsen: { bg: '#E3D5C3', shirt: '#D8CFC2', hair: '#2B1D16', skin: '#E4BA98', accent: '#4C3628' },
    aizat: { bg: '#E8D5BE', shirt: '#687353', hair: '#231710', skin: '#ECC6A8', accent: '#382418' },
    dinara: { bg: '#D6CEBF', shirt: '#4B5548', hair: '#291B13', skin: '#E7BF9D', accent: '#1F140E' },
    kamila: { bg: '#E6D9C7', shirt: '#7A5E48', hair: '#2B1D14', skin: '#EAC3A4', accent: '#382418' },
  };
  const p = palettes[variant];
  const isMale = variant === 'arsen';

  return (
    <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
      <rect width="64" height="64" rx="32" fill={p.bg} />
      {/* Warm cafe background window light */}
      <circle cx="14" cy="14" r="6" fill="#FFF7EA" fillOpacity="0.45" />
      <circle cx="52" cy="18" r="4" fill="#FFF7EA" fillOpacity="0.35" />
      {/* Shoulders */}
      <path d="M12 64C12 51 21 44 32 44C43 44 52 51 52 64H12Z" fill={p.shirt} />
      {/* Collar / Shirt */}
      <path d="M26 44L32 52L38 44" fill="#FAF6EE" fillOpacity="0.85" />
      {/* Hair back for female avatars */}
      {!isMale && (
        <path
          d="M17 30C17 19 23.5 12 32 12C40.5 12 47 19 47 30V45C47 47 43 48 41 46V35H23V46C21 48 17 47 17 45V30Z"
          fill={p.hair}
        />
      )}
      {/* Neck */}
      <rect x="28" y="36" width="8" height="10" rx="4" fill={p.skin} />
      {/* Face */}
      <circle cx="32" cy="28" r="11.5" fill={p.skin} />
      {/* Hair front */}
      {isMale ? (
        <path
          d="M20.5 26C20.5 18.5 25.5 14 32 14C38.5 14 43.5 18.5 43.5 25C41 21.5 36.5 20.5 32 21C27.5 21.5 23 22.5 20.5 26Z"
          fill={p.hair}
        />
      ) : (
        <path
          d="M20.5 27C21 19 26 14 32 14C38 14 43 19 43.5 27C40 22 36 20 32 22.5C28 20 24 22 20.5 27Z"
          fill={p.hair}
        />
      )}
      {/* Eyes & friendly smile */}
      <circle cx="27.8" cy="28" r="1.4" fill="#2A1B12" />
      <circle cx="36.2" cy="28" r="1.4" fill="#2A1B12" />
      <path d="M28.5 33.2C30 35 34 35 35.5 33.2" stroke="#9B664A" strokeWidth="1.6" strokeLinecap="round" />
      {/* Headphones for Dinara */}
      {variant === 'dinara' && (
        <>
          <path d="M19 28C19 19.5 24.8 13.5 32 13.5C39.2 13.5 45 19.5 45 28" stroke="#2D241E" strokeWidth="2.4" />
          <rect x="17" y="25" width="4" height="8" rx="2" fill="#2D241E" />
          <rect x="43" y="25" width="4" height="8" rx="2" fill="#2D241E" />
        </>
      )}
    </svg>
  );
};

export const CafePhotoThumb: React.FC<{
  variant: 'warm-latte' | 'sunlit-corner' | 'roastery' | 'bakery';
  className?: string;
}> = ({ variant, className = 'w-16 h-16' }) => {
  const themes = {
    'warm-latte': { wall: '#E6D4BC', table: '#A9784E', accent: '#6B4226', glow: '#FFF3DC' },
    'sunlit-corner': { wall: '#DFD2BD', table: '#8F613B', accent: '#3F5D45', glow: '#FFF6E3' },
    roastery: { wall: '#D5C3AC', table: '#71492C', accent: '#2E1D12', glow: '#F7E7CF' },
    bakery: { wall: '#EAD9C3', table: '#B48358', accent: '#8A5226', glow: '#FFF7E8' },
  };
  const t = themes[variant];

  return (
    <svg viewBox="0 0 80 80" fill="none" className={className} aria-hidden="true">
      <rect width="80" height="80" rx="14" fill={t.wall} />
      {/* Sunlit window frame */}
      <rect x="8" y="8" width="26" height="34" rx="4" fill={t.glow} />
      <line x1="21" y1="8" x2="21" y2="42" stroke={t.wall} strokeWidth="2" />
      <line x1="8" y1="25" x2="34" y2="25" stroke={t.wall} strokeWidth="2" />
      {/* Shelf & frames */}
      <rect x="42" y="14" width="28" height="3" rx="1.5" fill={t.accent} fillOpacity="0.65" />
      <rect x="46" y="7" width="8" height="7" rx="1" fill="#F9F2E7" />
      <rect x="58" y="8" width="7" height="6" rx="1" fill="#C79F7B" />
      {/* Table */}
      <rect x="0" y="52" width="80" height="28" fill={t.table} />
      <rect x="0" y="52" width="80" height="4" fill="#C6956B" fillOpacity="0.45" />
      {/* Latte cup */}
      <ellipse cx="44" cy="56" rx="14" ry="4" fill="#EFE8DC" />
      <path d="M33 41H55V51C55 54.5 50 57 44 57C38 57 33 54.5 33 51V41Z" fill="#FAF6EE" />
      <ellipse cx="44" cy="41" rx="11" ry="3.2" fill="#B57B4C" />
      <path d="M40 41C42 39.5 46 39.5 48 41" stroke="#FAF6EE" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M55 43.5H57.5C59 43.5 60 44.5 60 46.2C60 48 59 49 57.5 49H55" stroke="#FAF6EE" strokeWidth="2" />
      {/* Little plant / croissant */}
      <circle cx="20" cy="47" r="6" fill="#4D7852" />
      <rect x="16" y="49" width="8" height="6" rx="1.5" fill="#C68757" />
    </svg>
  );
};
