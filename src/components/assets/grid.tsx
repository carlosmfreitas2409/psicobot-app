import type { SVGProps } from "react";

export function Grid(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="100%" height="100%" {...props}>
      <title>Grid</title>
      <defs>
        <pattern
          id="grid-_r_19_"
          x="-0.25"
          y="-1"
          width="60"
          height="60"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M 60 0 L 0 0 0 60"
            fill="transparent"
            stroke="currentColor"
            strokeWidth="1"
          ></path>
        </pattern>
      </defs>
      <rect fill="url(#grid-_r_19_)" width="100%" height="100%"></rect>
    </svg>
  );
}
