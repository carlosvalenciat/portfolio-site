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
  return (
    <div className="pipeline" role="img" aria-label={`${title}: ${nodes.map((n) => `${n.label}, ${n.sub}`).join("; ")}`}>
      {nodes.map((node, index) => (
        <div className="pipeline__step" key={node.id}>
          <div className={`pipeline__node ${index === 2 ? "pipeline__node--evidence" : ""} ${index === 4 ? "pipeline__node--truth" : ""}`}>
            <span className="pipeline__index">{String(index + 1).padStart(2, "0")}</span>
            <strong>{node.label}</strong>
            <small>{node.sub}</small>
          </div>
          {index < nodes.length - 1 && <span className="pipeline__connector"><i /></span>}
        </div>
      ))}
    </div>
  );
}
