/**
 * Inline script that sets the initial theme on the `<html>` element BEFORE
 * React hydrates, so users never see a flash of the wrong theme.
 *
 * Default theme is `light`. The user's previous choice is persisted in
 * localStorage under `satma-theme`.
 */
const SCRIPT = `
(function() {
  try {
    var stored = localStorage.getItem('satma-theme');
    var theme = stored === 'dark' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
  } catch (e) {
    document.documentElement.setAttribute('data-theme', 'light');
  }
})();
`.trim();

export function ThemeInit() {
  return (
    <script
      dangerouslySetInnerHTML={{ __html: SCRIPT }}
    />
  );
}
