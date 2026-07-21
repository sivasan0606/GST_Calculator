import React from 'react';

interface LogoProps {
  variant?: 'horizontal' | 'vertical' | 'mark';
  className?: string;
  size?: number; // Used for mark variant, or overall scaling
}

export default function Logo({ variant = 'horizontal', className = '', size = 40 }: LogoProps) {
  // Brand Colors: 
  // Gear: Deep Slate Blue (#0f2e54)
  // Arrow: Emerald Green (#10b981 / #00b060)

  const renderMark = (customSize: number) => (
    <svg
      width={customSize}
      height={customSize}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="inline-block shrink-0"
    >
      <defs>
        <mask id="simplytools-logo-mask">
          {/* Keep everything inside white */}
          <rect x="0" y="0" width="100" height="100" fill="white" />
          
          {/* Gear Teeth (cutout in black) */}
          <rect x="45" y="14" width="10" height="12" rx="2" transform="rotate(0 50 50)" fill="black" />
          <rect x="45" y="14" width="10" height="12" rx="2" transform="rotate(-45 50 50)" fill="black" />
          <rect x="45" y="14" width="10" height="12" rx="2" transform="rotate(-90 50 50)" fill="black" />
          <rect x="45" y="14" width="10" height="12" rx="2" transform="rotate(-135 50 50)" fill="black" />
          <rect x="45" y="14" width="10" height="12" rx="2" transform="rotate(-180 50 50)" fill="black" />

          {/* Outer gear ring (cutout in black) */}
          <circle cx="50" cy="50" r="24" fill="black" />
          
          {/* Wrench handle (cutout in black) */}
          <rect x="45" y="50" width="10" height="34" rx="5" transform="rotate(135 50 50)" fill="black" />
          
          {/* Wrench jaw opening (cutout in black) */}
          <rect x="45" y="24" width="10" height="26" rx="2" transform="rotate(-45 50 50)" fill="black" />

          {/* Inner center circle (re-fill with white to keep the color of the inner C) */}
          <circle cx="50" cy="50" r="14" fill="white" />

          {/* Wrench inner nut cutout (black) */}
          <circle cx="50" cy="50" r="8" fill="black" />
        </mask>
      </defs>

      <g mask="url(#simplytools-logo-mask)">
        {/* Left half - Purple */}
        <path d="M 50 6 L 12 28 L 12 72 L 50 94 Z" fill="#5A39D0" />
        {/* Right half - Mint Green */}
        <path d="M 50 6 L 88 28 L 88 72 L 50 94 Z" fill="#A2EDD0" />
      </g>
    </svg>
  );

  if (variant === 'mark') {
    return renderMark(size);
  }

  if (variant === 'vertical') {
    return (
      <div className={`flex flex-col items-center text-center ${className}`}>
        {renderMark(size * 1.5)}
        <div className="mt-3">
          <span className="font-display font-bold text-[#5A39D0] text-2xl tracking-tight block leading-none">
            simply<span className="relative inline-block">tools<span className="absolute left-0 -bottom-1 w-full h-[3px] bg-[#A2EDD0] rounded-full"></span></span>
          </span>
          <span className="text-xs text-[#357255] font-semibold tracking-tight block mt-2 font-mono">
            Smarter Math. Zero Noise
          </span>
        </div>
      </div>
    );
  }

  // Default: horizontal (perfect for header bar)
  return (
    <div className={`flex items-center gap-3.5 ${className}`}>
      {renderMark(size)}
      <div className="flex flex-col justify-center">
        <span className="font-display font-bold text-[#5A39D0] text-lg sm:text-xl tracking-tight leading-none">
          simply<span className="relative inline-block">tools<span className="absolute left-0 -bottom-0.5 w-full h-[2.5px] bg-[#A2EDD0] rounded-full"></span></span>
        </span>
        <span className="text-[10px] sm:text-xs text-[#357255] font-semibold tracking-tight mt-1 leading-none">
          Smarter Math. Zero Noise
        </span>
      </div>
    </div>
  );
}
