import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'full' | 'inline' | 'iconOnly';
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export default function Logo({ className = '', variant = 'inline', size = 'md' }: LogoProps) {
  // BENE Green colors:
  // Solid Forest Green: #0b7a44
  
  if (variant === 'inline') {
    // Beautiful horizontal brand logo in the header with B-Building-N-E on green background.
    // Extremely crisp, clean, direct representation of the uploaded image logo!
    return (
      <div className={`flex items-center gap-1 bg-[#0b7a44] py-1.5 px-4 rounded-xl shadow-xs border border-[#085e33] ${className}`}>
        <svg
          viewBox="0 0 360 110"
          style={{ fontFamily: 'Arial' }}
          className="h-9 w-auto select-none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g fill="white">
            {/* Letter B */}
            <path d="M 25,20 H 65 Q 90,20 90,45 Q 90,60 75,65 Q 91,70 91,95 Q 91,120 65,120 H 25 Z M 48,42 V 62 H 60 Q 69,62 69,52 Q 69,42 60,42 H 48 Z M 48,78 V 98 H 63 Q 72,98 72,88 Q 72,78 63,78 H 48 Z" transform="scale(0.85) translate(0, 10)" />
            
            {/* Building E (Isometric building block) with diagonal splits */}
            <g transform="scale(0.85) translate(0, 12)">
              {/* Left facet */}
              <path d="M 110,40 L 155,20 V 120 L 110,136 Z" />
              {/* Right facet */}
              <path d="M 155,20 L 168,34 V 118 L 155,120 Z" opacity="0.82" />
              
              {/* Green cutout lines to make the building floors exactly as in logo */}
              <line x1="110" y1="64" x2="155" y2="44" stroke="#0b7a44" strokeWidth="4.2" />
              <line x1="110" y1="88" x2="155" y2="68" stroke="#0b7a44" strokeWidth="4.2" />
              <line x1="110" y1="112" x2="155" y2="92" stroke="#0b7a44" strokeWidth="4.2" />
            </g>

            {/* Letter N */}
            <path d="M 185,20 H 210 L 238,98 V 20 H 262 V 120 H 238 L 210,48 V 120 H 185 Z" transform="scale(0.85) translate(0, 10)" />

            {/* Letter E */}
            <path d="M 280,20 H 340 V 41 H 310 V 61 H 335 V 82 H 310 V 101 H 340 V 120 H 280 Z" transform="scale(0.85) translate(0, 10)" />
          </g>
        </svg>
      </div>
    );
  }

  // Large rendering for full logo (Default)
  return (
    <div
      className={`bg-[#0b7a44] p-6 flex flex-col items-center justify-center rounded-2xl select-none shadow-md ${className}`}
    >
      <svg
        viewBox="0 0 360 110"
        className="w-full h-auto"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g fill="white">
          {/* Letter B */}
          <path d="M 25,20 H 65 Q 90,20 90,45 Q 90,60 75,65 Q 91,70 91,95 Q 91,120 65,120 H 25 Z M 48,42 V 62 H 60 Q 69,62 69,52 Q 69,42 60,42 H 48 Z M 48,78 V 98 H 63 Q 72,98 72,88 Q 72,78 63,78 H 48 Z" />
          
          {/* Building E */}
          <g>
            {/* Left facet */}
            <path d="M 110,40 L 155,20 V 120 L 110,136 Z" />
            {/* Right facet */}
            <path d="M 155,20 L 168,34 V 118 L 155,120 Z" opacity="0.82" />
            
            {/* Green slits */}
            <line x1="110" y1="64" x2="155" y2="44" stroke="#0b7a44" strokeWidth="4.2" />
            <line x1="110" y1="88" x2="155" y2="68" stroke="#0b7a44" strokeWidth="4.2" />
            <line x1="110" y1="112" x2="155" y2="92" stroke="#0b7a44" strokeWidth="4.2" />
          </g>

          {/* Letter N */}
          <path d="M 185,20 H 210 L 238,98 V 20 H 262 V 120 H 238 L 210,48 V 120 H 185 Z" />

          {/* Letter E */}
          <path d="M 280,20 H 340 V 41 H 310 V 61 H 335 V 82 H 310 V 101 H 340 V 120 H 280 Z" />
        </g>
      </svg>
    </div>
  );
}

