import { SVGProps } from "react";

export function TsehayLogo({ className, style, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      className={className}
      style={{ display: "block", ...style }}
      {...props}
    >
      {/* 8 Rays of the Sun */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
        <g key={angle} transform={`rotate(${angle} 50 50)`}>
          {/* Left half of ray - Light Orange/Yellow */}
          <path d="M 50 21 L 44 36 L 50 36 Z" fill="#F9B03C" />
          {/* Right half of ray - Shaded Darker Orange */}
          <path d="M 50 21 L 50 36 L 56 36 Z" fill="#E06A1B" />
        </g>
      ))}

      {/* Sun Disk in the center */}
      {/* Left half - Light Orange/Yellow */}
      <path d="M 50 35 A 15 15 0 0 0 50 65 Z" fill="#F9B03C" />
      {/* Right half - Shaded Darker Orange */}
      <path d="M 50 35 A 15 15 0 0 1 50 65 Z" fill="#E06A1B" />

      {/* Outer Blue Circular Arrow */}
      {/* Curved loop going counter-clockwise around the sun */}
      <path
        d="M 76.9 23.1 A 38 38 0 1 0 88 50"
        fill="none"
        stroke="#2E62B9"
        strokeWidth="7"
        strokeLinecap="round"
      />
      {/* Arrowhead at the right end pointing upwards/counter-clockwise */}
      <path
        d="M 78 50 L 88 36 L 98 50 L 88 45 Z"
        fill="#2E62B9"
      />
    </svg>
  );
}
