# Mobile-First CSS & Layout Architecture

## Layout & Responsive Rules
- **Strict Mobile-First Breakpoints**: Unprefixed Tailwind classes MUST target mobile devices (<640px). Only introduce `sm:`, `md:`, `lg:`, and `xl:` modifiers progressively for wider viewports.
- **Dynamic Viewport Heights**: Never use fixed `h-screen` or `100vh` on mobile containers, as mobile browser address bars collapse and cause overflow jitter. Always use `min-h-dvh` or `h-dvh`.
- **Fluid Containers**: Never set fixed pixel widths on parent containers (e.g. `w-[400px]` or `w-[800px]`). Use fluid constraints: `w-full max-w-lg mx-auto`.
- **Touch-Friendly Tap Targets**: Ensure interactive targets (buttons, links, form inputs) are at least 44x44px on mobile screens with appropriate touch padding.
- **Horizontal Overflow Prevention**: Ensure no tables, wide images, or code blocks trigger unintended horizontal page scrolling. Use `overflow-x-auto` strictly scoped to child containers.
