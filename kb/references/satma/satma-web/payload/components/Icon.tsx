import React from "react";

/**
 * Icon shown in Payload's admin chrome (nav header / collapsed sidebar).
 *
 * Why a SQUARE crop of just the "s" letterform: Payload's icon slot is
 * narrow (~30px). The full SATMA wordmark (1878×256, ~7.34:1 aspect)
 * gets clipped to show only the first letter. So instead of fighting
 * the slot, we render a proper square monogram — the same "s" path
 * from the brand book, with a square viewBox, sized 24×24.
 *
 * The "s" path lives at viewBox(341..637, 666..922) within the original
 * wordmark — that's a ~296×257 box (1.15:1 aspect, near-square). We
 * pad the viewBox slightly so the letter has breathing room.
 */
export function Icon() {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: 24,
        height: 24,
        lineHeight: 0,
        color: "currentColor",
      }}
      aria-label="satma"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="320 650 336 290"
        width={24}
        height={24}
        fill="currentColor"
        role="img"
        aria-hidden="true"
        style={{
          display: "block",
          width: 24,
          height: 24,
          color: "currentColor",
        }}
      >
        <path d="M 394.234375 921.855469 L 583.675781 921.855469 C 612.984375 921.855469 636.742188 898.097656 636.742188 868.789062 L 636.742188 830 C 636.742188 800.691406 612.984375 776.929688 583.675781 776.929688 L 390.960938 776.929688 L 375.121094 810.882812 L 375.121094 726.871094 C 375.121094 719.425781 378.136719 712.6875 383.015625 707.804688 C 387.898438 702.925781 394.636719 699.910156 402.082031 699.910156 L 575.828125 699.910156 C 590.71875 699.910156 602.789062 711.980469 602.789062 726.871094 L 636.742188 726.871094 L 636.742188 719.023438 C 636.742188 689.714844 612.984375 665.957031 583.675781 665.957031 L 394.234375 665.957031 C 364.925781 665.957031 341.167969 689.714844 341.167969 719.023438 L 341.167969 810.882812 L 575.828125 810.882812 C 590.71875 810.882812 602.789062 822.957031 602.789062 837.847656 L 602.789062 860.941406 C 602.789062 875.832031 590.71875 887.90625 575.828125 887.90625 L 402.082031 887.90625 C 387.191406 887.90625 375.121094 875.832031 375.121094 860.941406 L 341.167969 860.941406 L 341.167969 868.789062 C 341.167969 898.097656 364.925781 921.855469 394.234375 921.855469" />
      </svg>
    </span>
  );
}

export default Icon;
