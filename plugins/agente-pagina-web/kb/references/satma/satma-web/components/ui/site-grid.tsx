/**
 * Site-wide grid mesh — pure CSS dot grid pattern that fills the viewport,
 * sits behind everything (z=-20), and drifts slowly so the page never feels
 * static. Theme-aware via CSS variables defined in globals.css.
 *
 * Composition: a 56×56 cell grid with hairlines + a periwinkle dot at every
 * intersection. A radial mask softens the edges so the grid fades into the
 * page without looking like wallpaper — the eye reads it as a design
 * element, not a tiled background.
 *
 * Mounted once in the root layout. No props — single source of truth.
 */
export function SiteGrid() {
  return (
    <div
      aria-hidden="true"
      className="site-grid pointer-events-none fixed inset-0 -z-20 overflow-hidden"
    />
  );
}
