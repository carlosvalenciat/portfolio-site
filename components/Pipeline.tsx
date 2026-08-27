type Node = { id: string; label: string; sub: string };

/**
 * The KoldPlant intake path as a left-to-right flow.
 *
 * Node 3 is dashed on purpose — it holds evidence, not truth. Node 5 is
 * where data becomes a business number, so it carries the only accent.
 * The numbering is kept here because this genuinely is a sequence:
 * telemetry precedes intake, intake precedes reconciliation.
 */
export default function Pipeline({
  nodes,
  title,
}: {
  nodes: Node[];
  title: string;
}) {
  const W = 158;
  const STEP = 190;
  const Y = 46;
  const H = 84;
  const MID = Y + H / 2;

  return (
    <div
      className="overflow-x-auto rounded-chip"
      tabIndex={0}
      role="group"
      aria-label={title}
    >
      <svg viewBox="0 0 1140 184" role="img" className="h-auto w-full min-w-[880px]">
        <title>{title}</title>
        <desc>{nodes.map((n) => `${n.label} (${n.sub})`).join(" → ")}</desc>

        <defs>
          <marker
            id="pl-arrow"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M0 0 L10 5 L0 10 z" fill="var(--p-fg-dim)" opacity="0.65" />
          </marker>
          <linearGradient id="pl-truth" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--p-accent)" stopOpacity="0.14" />
            <stop offset="100%" stopColor="var(--p-accent)" stopOpacity="0.04" />
          </linearGradient>
        </defs>

        {nodes.map((node, i) => {
          const x = 10 + i * STEP;
          const isEvidence = i === 2;
          const isTruth = i === 4;

          return (
            <g key={node.id}>
              <rect
                x={x}
                y={Y}
                width={W}
                height={H}
                rx="10"
                fill={isTruth ? "url(#pl-truth)" : "var(--p-surface)"}
                stroke={
                  isTruth
                    ? "var(--p-accent-deep)"
                    : isEvidence
                      ? "var(--p-signal-pending)"
                      : "var(--p-border-bright)"
                }
                strokeWidth="1"
                strokeDasharray={isEvidence ? "5 4" : undefined}
                strokeOpacity={isEvidence ? 0.75 : 1}
              />

              <text
                x={x + 11}
                y={Y + 17}
                fill="var(--p-fg-dim)"
                fontSize="9.5"
                fontFamily="var(--font-mono)"
              >
                {String(i + 1).padStart(2, "0")}
              </text>

              <text
                x={x + W / 2}
                y={Y + 36}
                textAnchor="middle"
                fill={isTruth ? "var(--p-accent)" : "var(--p-fg)"}
                fontSize="13"
                fontWeight="600"
                fontFamily="var(--font-sans)"
              >
                {node.label}
              </text>

              <text
                x={x + W / 2}
                y={Y + 57}
                textAnchor="middle"
                fill="var(--p-fg-dim)"
                fontSize="10.5"
                fontFamily="var(--font-mono)"
              >
                {node.sub}
              </text>

              {i < nodes.length - 1 && (
                <line
                    x1={x + W + 5}
                    y1={MID}
                    x2={x + STEP - 5}
                    y2={MID}
                    stroke="var(--p-fg-dim)"
                    strokeOpacity="0.45"
                    strokeWidth="1.25"
                    markerEnd="url(#pl-arrow)"
                  />
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
