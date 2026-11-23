# Forms & Asynchronous UX

## Modal Viewport Isolation & Highest Z-Index (MANDATORY)
- **Direct Body Portal**: ALL modals, dialogs, drawers, and overlay sheets MUST be portaled directly to `document.body` (using `ReactDOM.createPortal`) with `z-[99999]` (the absolute highest z-index across the application).
- **No Parent Stacking Traps**: Never render modal backdrops inside nested view containers where parent CSS stacking contexts (`overflow-hidden`, `transform`, `filter`, `backdrop-blur`) trap and clip the backdrop, leaving sidebars or topbars un-dimmed.
- **Accessibility & Focus Lock**: When open, modals must trap focus strictly inside the window (`role="dialog"`, `aria-modal="true"`), disable background scrolling (`document.body.style.overflow = 'hidden'`), close on `Escape`, and completely isolate focus so no background elements can be clicked or tabbed.

## Forms & Mutation States
- **Explicit Loading & Pending Feedback**: Disable submit buttons during pending mutations and display an inline spinner or loading label.
- **Inline Field Validation**: Display validation errors directly adjacent to the relevant input field, connected via `aria-describedby`.
- **Keyboard Navigation**: Form inputs must support logical tab progression and submit on `Enter` where appropriate.
