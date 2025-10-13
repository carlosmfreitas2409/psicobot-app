import type { ComponentProps } from "react";

export function GlobResMark(props: ComponentProps<"svg">) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <title>GlobRes Mark</title>
      <path
        d="M23 13.603h-6.002v6c0 .57.525 1.187 1.149 1.187h.22c1.186 0 4.633-4.4 4.633-7.187zM23 10.397h-6.002v-6c0-.57.525-1.187 1.149-1.187h.22c1.186 0 4.633 4.4 4.633 7.187zM13.764 13.603H9.48v2.89c0 2.003-3.231 1.918-3.231 0v-2.89H1C1.698 18.544 5.846 22.49 11.01 23h.306c1.273 0 2.448-1.263 2.448-2.367v-7.03zM13.764 10.397H9.48v-2.89c0-2.003-3.231-1.918-3.231 0v2.89H1C1.698 5.456 5.846 1.51 11.01 1h.306c1.273 0 2.448 1.263 2.448 2.368v7.03z"
        fill="#CA003A"
      />
    </svg>
  );
}
