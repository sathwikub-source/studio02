import type { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      width="40"
      height="40"
      aria-label="StudySpot Logo"
      {...props}
    >
      <g transform="translate(0, 10)">
        {/* Book */}
        <path
          d="M 50 25 C 20 25 10 45 10 75 L 90 75 C 90 45 80 25 50 25 Z"
          fill="hsl(var(--primary))"
        />
        <path
          d="M 10 75 Q 30 65 50 65 Q 70 65 90 75 L 90 78 Q 70 68 50 68 Q 30 68 10 78 Z"
          fill="hsl(var(--background))"
          stroke="hsl(var(--border))"
          strokeWidth="1"
        />

        {/* Location Pin */}
        <g transform="translate(42, 45)">
          <path
            d="M 8 0 C 3.58 0 0 3.58 0 8 C 0 14 8 22 8 22 S 16 14 16 8 C 16 3.58 12.42 0 8 0 Z"
            fill="hsl(var(--accent))"
            stroke="hsl(var(--card))"
            strokeWidth="2"
          />
          <circle cx="8" cy="8" r="3" fill="hsl(var(--card))" />
        </g>

        {/* Graduation Cap */}
        <g transform="translate(50, 20) rotate(-10 0 0)">
          <path
            d="M -25 -5 L 0 -15 L 25 -5 L 0 5 Z"
            fill="hsl(var(--accent))"
          />
          <path
            d="M -15 0 C -15 -10 15 -10 15 0 Z"
            fill="hsl(var(--accent))"
          />
           <path d="M 25 -5 L 30 -5 L 30 5 L 25 5" stroke="hsl(var(--accent))" strokeWidth="2" fill="none" />
        </g>
      </g>
    </svg>
  );
}

export function LogoWithText() {
    return (
        <div className="flex items-center gap-2">
            <Logo />
            <span className="font-bold text-xl text-primary font-headline">StudySpot</span>
        </div>
    )
}
