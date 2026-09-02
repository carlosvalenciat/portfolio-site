const signatures: Record<string, { nodes: string[]; tone: string }> = {
  "odoo-erp": { nodes: ["ORDER", "API", "RECORD", "STOCK", "CONFIRMED"], tone: "cyan" },
  koldplant: { nodes: ["SENSOR", "INTAKE", "VALIDATE", "RECONCILE", "PRODUCTION"], tone: "amber" },
  "conversational-commerce": { nodes: ["WHATSAPP", "AGENT", "N8N", "ODOO", "PICKING"], tone: "violet" },
  "ai-agents": { nodes: ["INPUT", "AGENT", "TOOL", "SYSTEM", "RESPONSE"], tone: "violet" },
  "ops-pwa": { nodes: ["OPERATOR", "PWA", "API", "ERP", "DASHBOARD"], tone: "green" },
};

export default function ProjectSignature({ projectId }: { projectId: string }) {
  const signature = signatures[projectId];
  if (!signature) return null;

  return (
    <div className={`project-signature project-signature--${signature.tone}`} aria-hidden="true">
      {signature.nodes.map((node, index) => (
        <div className="project-signature__step" key={node}>
          <span>{node}</span>
          {index < signature.nodes.length - 1 && <i />}
        </div>
      ))}
    </div>
  );
}
