import React from "react";

/**
 * Renders a "Ver sitio público" CTA at the bottom of Payload's left nav.
 * Registered via `admin.components.afterNavLinks` in payload.config.ts.
 */
export function ViewSiteLink() {
  return (
    <a
      href="/"
      target="_blank"
      rel="noreferrer"
      className="satma-view-site"
      aria-label="Abrir el sitio público en una nueva pestaña"
    >
      <span className="satma-view-site__dot" aria-hidden />
      <span className="satma-view-site__label">
        <span className="satma-view-site__top">Ver sitio público</span>
        <span className="satma-view-site__sub">satma.mx</span>
      </span>
      <span className="satma-view-site__arrow" aria-hidden>
        ↗
      </span>
    </a>
  );
}

export default ViewSiteLink;
