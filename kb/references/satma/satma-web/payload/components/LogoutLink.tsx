import React from "react";
import Link from "next/link";

/**
 * "Cerrar sesión" link rendered at the bottom of Payload's left nav.
 * Registered via `admin.components.afterNavLinks` in payload.config.ts.
 *
 * Server-rendered (no event handlers — uses CSS :hover via inline style).
 * Payload exposes the logout endpoint at /admin/logout.
 */
export function LogoutLink() {
  return (
    <>
      <style>{`
        .satma-logout-link {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 14px;
          margin-top: 6px;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 500;
          letter-spacing: 0.04em;
          color: var(--theme-elevation-800);
          text-decoration: none;
          border: 1px solid var(--theme-elevation-150);
          background: transparent;
          transition: all 0.2s ease;
        }
        .satma-logout-link:hover {
          background: var(--theme-elevation-100);
          border-color: var(--theme-elevation-300);
          color: var(--theme-elevation-1000);
        }
      `}</style>
      <Link
        href="/admin/logout"
        className="satma-logout-link"
        aria-label="Cerrar sesión"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
        Cerrar sesión
      </Link>
    </>
  );
}

export default LogoutLink;
