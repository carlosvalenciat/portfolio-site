type Node = { id: string; label: string; sub: string };

type Props = {
  nodes: Node[];
  title: string;
};

/**
 * The KoldPlant intake path, drawn as a left-to-right flow.
 * Node 3 (the intake tray) is dashed on purpose: it holds evidence,
 * not truth. Node 5 is where data becomes a business number.
 */
export default function Pipeline({ nodes, title }: Props) {
  const W = 160;
  const STEP = 190;
  const Y = 44;
  const H = 82;

  return (
    <div className="overflow-x-auto" tabIndex={0} aria-label={title}>
      <svg
        viewBox="0 0 1140 180"
        role="img"
        className="min-w-[900px] w-full h-auto"
      >
        <title>{title}</title>
        <desc>
          {nodes.map((n) => `${n.label} (${n.sub})`).join(" → ")}
        </desc>

        <defs>
          <marker
            id="arrow"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#3a4353" />
          </marker>
        </defs>

        {nodes.map((node, i) => {
          const x = 10 + i * STEP;
          const isEvidence = i === 2;
          const isTruth = i === 4;

          const stroke = isTruth
            ? "var(--color-accent-dim)"
            : isEvidence
              ? "#3a4353"
              : "var(--color-border-bright)";

          return (
            <g key={node.id}>
              <rect
                x={x}
                y={Y}
                width={W}
                height={H}
                rx="8"
                fill={isTruth ? "rgba(34, 211, 238, 0.06)" : "var(--color-surface)"}
                stroke={stroke}
                strokeWidth="1"
                strokeDasharray={isEvidence ? "5 4" : undefined}
              />
              <text
                x={x + W / 2}
                y={Y + 34}
                textAnchor="middle"
                fill={isTruth ? "var(--color-accent)" : "var(--color-fg)"}
                fontSize="13"
                fontWeight="600"
                fontFamily="var(--font-sans)"
              >
                {node.label}
              </text>
              <text
                x={x + W / 2}
                y={Y + 55}
                textAnchor="middle"
                fill="var(--color-fg-dim)"
                fontSize="10.5"
                fontFamily="var(--font-mono)"
              >
                {node.sub}
              </text>

              {/* Step index */}
              <text
                x={x + 11}
                y={Y + 16}
                fill="var(--color-fg-dim)"
                fontSize="9.5"
                fontFamily="var(--font-mono)"
              >
                {String(i + 1).padStart(2, "0")}
              </text>

              {i < nodes.length - 1 && (
                <line
                  x1={x + W + 5}
                  y1={Y + H / 2}
                  x2={x + STEP - 5}
                  y2={Y + H / 2}
                  stroke="#3a4353"
                  strokeWidth="1.25"
                  markerEnd="url(#arrow)"
                />
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
