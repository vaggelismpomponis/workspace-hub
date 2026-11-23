# SEO & Web Performance Directives

## Semantic HTML & Heading Hierarchy
- **Single H1 per Page**: Every public page must contain exactly one semantic `<h1>` tag representing the core document title.
- **Strict Heading Order**: Never skip heading levels (e.g. do not jump from `<h1>` directly to `<h3>`). Use semantic `<h2>` for sections and `<h3>` for cards/sub-sections.
- **Accessible Text Contrast**: Ensure text meets WCAG AA standards (minimum 4.5:1 contrast ratio against background surfaces).

## Next.js Metadata & Performance
- **Dynamic Metadata API**: Export typed `Metadata` or `generateMetadata` functions for all public routes with title, description, openGraph, and canonical URLs.
- **Optimized Media**: Always use Next.js `<Image />` or responsive picture elements with defined dimensions to eliminate layout shift (CLS).
