import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Metric callout — displays a result number with the supporting
 * context that makes it credible (period, baseline, source). Pairs
 * with E-E-A-T signals: a number alone reads as marketing fluff;
 * the same number with "in 12 months vs. 2024 baseline" reads as
 * audited evidence. Google + AI engines pick this up too.
 *
 * Two visual variants:
 *   - `compact` (default): used inside grids/cards. 2 lines max.
 *   - `full`: used on dedicated pages with room to breathe.
 */

export type MetricCalloutData = {
  /** The headline number, e.g. "+312%", "Top 3", "$47M". */
  metric: string;
  /** What the number measures, e.g. "leads calificados". */
  label?: string;
  /** Time window over which the result was achieved. */
  period?: string;
  /** What it's compared to. Optional — sometimes the metric is absolute. */
  baseline?: string;
  /** Source / methodology note. Adds credibility for AI citation. */
  source?: string;
};

type Props = MetricCalloutData & {
  variant?: "compact" | "full";
  className?: string;
};

export function MetricCallout({
  metric,
  label,
  period,
  baseline,
  source,
  variant = "compact",
  className,
}: Props) {
  if (variant === "compact") {
    return (
      <div className={cn("flex flex-col gap-1", className)}>
        <div className="flex flex-wrap items-baseline gap-2">
          <span className="font-display text-base font-medium text-periwinkle">
            {metric}
          </span>
          {label && (
            <span className="text-xs text-off/85 leading-snug">{label}</span>
          )}
        </div>
        {(period || baseline) && (
          <span className="text-[11px] text-muted leading-snug">
            {[period, baseline].filter(Boolean).join(" · ")}
          </span>
        )}
      </div>
    );
  }

  // Full variant — used on dedicated pages.
  return (
    <figure
      className={cn(
        "flex flex-col gap-3 rounded-2xl border border-line bg-ink-soft/60 p-6 lg:p-8",
        className,
      )}
    >
      <div className="font-display text-4xl font-medium tracking-tight text-periwinkle lg:text-5xl">
        {metric}
      </div>
      {label && (
        <div className="font-display text-base font-medium text-off lg:text-lg">
          {label}
        </div>
      )}
      <dl className="mt-2 flex flex-col gap-2 text-sm text-muted">
        {period && (
          <div className="flex justify-between gap-4 border-t border-line pt-2">
            <dt className="text-[11px] uppercase tracking-[0.18em]">Periodo</dt>
            <dd className="text-right text-off/90">{period}</dd>
          </div>
        )}
        {baseline && (
          <div className="flex justify-between gap-4 border-t border-line pt-2">
            <dt className="text-[11px] uppercase tracking-[0.18em]">
              Baseline
            </dt>
            <dd className="text-right text-off/90">{baseline}</dd>
          </div>
        )}
        {source && (
          <figcaption className="mt-2 border-t border-line pt-2 text-xs leading-relaxed">
            <span className="text-[11px] uppercase tracking-[0.18em] text-muted/80">
              Metodología
            </span>
            <span className="mt-1 block text-muted">{source}</span>
          </figcaption>
        )}
      </dl>
    </figure>
  );
}

// Methodology data now lives directly on each Case document in Payload
// (fields: metricLabel, metricPeriod, metricBaseline, metricSource).
// Editors maintain it from /admin → Cases. The previous CASE_METHODOLOGY
// hardcoded lookup was removed once the migration backfill ran.
