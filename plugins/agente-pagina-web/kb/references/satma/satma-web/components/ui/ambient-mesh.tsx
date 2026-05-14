/**
 * Site-wide ambient mesh — large soft color blobs that drift slowly across
 * the viewport in a wave-like motion. Sits behind all content (z=-10),
 * fixed so it's the same atmosphere whether you're on the home or a deep
 * subpage.
 *
 * Each blob uses theme-aware brand alphas (set in `--tone-blob-*` below)
 * so the mesh is clearly visible without overpowering content. Drift
 * keyframes (`ambient-drift-{a..e}`) at 60–140s cycles keep the page
 * alive without distracting.
 */
export function AmbientMesh() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* Top-right periwinkle */}
      <div
        className="ambient-blob ambient-drift-a absolute rounded-full blur-[110px]"
        style={{
          width: 920,
          height: 920,
          top: "-12%",
          right: "-10%",
          background:
            "radial-gradient(circle at center, var(--tone-blob-periwinkle), transparent 70%)",
        }}
      />
      {/* Center-left lilac */}
      <div
        className="ambient-blob ambient-drift-b absolute rounded-full blur-[120px]"
        style={{
          width: 880,
          height: 880,
          top: "32%",
          left: "-15%",
          background:
            "radial-gradient(circle at center, var(--tone-blob-lilac), transparent 70%)",
        }}
      />
      {/* Bottom-right mist */}
      <div
        className="ambient-blob ambient-drift-c absolute rounded-full blur-[110px]"
        style={{
          width: 760,
          height: 760,
          bottom: "-10%",
          right: "-8%",
          background:
            "radial-gradient(circle at center, var(--tone-blob-mist), transparent 70%)",
        }}
      />
      {/* Mid-low periwinkle (smaller, faster pace) */}
      <div
        className="ambient-blob ambient-drift-d absolute rounded-full blur-[90px]"
        style={{
          width: 560,
          height: 560,
          top: "62%",
          left: "38%",
          background:
            "radial-gradient(circle at center, var(--tone-blob-periwinkle), transparent 65%)",
        }}
      />
      {/* High-center lilac */}
      <div
        className="ambient-blob ambient-drift-e absolute rounded-full blur-[100px]"
        style={{
          width: 640,
          height: 640,
          top: "5%",
          left: "32%",
          background:
            "radial-gradient(circle at center, var(--tone-blob-lilac), transparent 70%)",
        }}
      />
    </div>
  );
}
