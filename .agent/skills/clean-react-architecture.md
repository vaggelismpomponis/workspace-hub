# Clean React Architecture & Strict TypeScript

## Core Rules
- **Sub-150-Line Components**: Keep components modular, focused, and under 150 lines. Split complex components into cohesive child subcomponents and custom hooks.
- **Zero Any Policy**: Never use `any`. Use strict TypeScript interfaces, type unions, generics, or `unknown` with type guards.
- **Zero useEffect for Derived State**: Compute derived state during render or with `useMemo`. Never sync props to state or compute totals inside `useEffect`.
- **Zero useEffect for User Event Actions**: Trigger side effects (API mutations, navigation, toast notifications) inside event handlers, not reactively inside `useEffect`.
- **Default to Server Components (Next.js)**: Keep data fetching and static markup in React Server Components. Only add `'use client'` at the boundary where browser interactivity or state is required.
