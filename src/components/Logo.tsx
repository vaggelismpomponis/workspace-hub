import type { HTMLAttributes } from "react";

interface LogoProps extends HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

export function Logo({ size = "md", showText = false, className = "", ...props }: LogoProps) {
  const dimension = size === "sm" ? 24 : size === "md" ? 32 : 44;

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`} {...props}>
      <svg
        width={dimension}
        height={dimension}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
        aria-hidden="true"
      >
        <rect
          width="64"
          height="64"
          rx="14"
          className="fill-zinc-950 dark:fill-zinc-900 stroke-zinc-800"
          strokeWidth="1.5"
        />
        <path
          d="M15 34H49"
          className="stroke-zinc-800"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeDasharray="2 3"
        />
        <path
          d="M16 22L24 43L32 26L40 43L48 22"
          className="stroke-zinc-100"
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M20 34H44"
          className="stroke-zinc-500"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="2 2"
        />
        <circle cx="32" cy="26" r="4.5" className="fill-emerald-500" />
        <circle cx="32" cy="26" r="2" fill="#ffffff" />
      </svg>

      {showText && (
        <div className="min-w-0">
          <h2 className="text-sm font-bold tracking-tight text-zinc-900 dark:text-zinc-100 truncate leading-tight">
            Workspace Hub
          </h2>
          <p className="text-[10px] font-mono tracking-widest uppercase text-zinc-500 truncate">
            Command Center
          </p>
        </div>
      )}
    </div>
  );
}
