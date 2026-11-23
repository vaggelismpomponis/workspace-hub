# Anti-Slop UI Design Directive

## Non-Negotiable Visual Standards
- **Zero AI Gradients**: Never use purple-to-indigo, pink, or multi-stop pastel gradients on backgrounds, headers, or text. Use solid, high-contrast, purposeful color surfaces.
- **No Floating Blurred Blobs**: Forbid ambient radial gradient background blur circles (`blur-3xl`, `bg-purple-500/20`). They degrade text contrast and look unpolished.
- **Pure Unboxed Icons**: Icons (Lucide or SVG) must never sit inside a boxed background container (e.g. `bg-emerald-50 rounded-lg p-2`). Icons must be pure elements inline with text, aligned using flexbox.
- **No Pill Badges for Section Titles**: Category overlines and section headers must never be pill badges (`border bg-emerald-50 rounded-full px-3 py-1`). Use crisp uppercase typography: `text-xs font-semibold uppercase tracking-widest text-zinc-500`.
- **No Boxed Step Numbers**: Never wrap step counters or numbers inside boxed badges (`border bg-white rounded px-2.5 py-1`). Render numbers as pure typographic elements.
- **Subtle Surface Elevation**: Replace heavy drop shadows (`shadow-xl`, `shadow-2xl`) with crisp 1px borders (`border border-zinc-200 dark:border-zinc-800`) and minimal elevation (`shadow-sm`).
- **Interactive Radius Consistency**: Interactive elements (buttons, inputs) must use `rounded-md` or `rounded-lg`. Never use full pill buttons (`rounded-full`) for primary call-to-actions.
