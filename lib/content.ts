export type Lang = "en" | "es";

export type Project = {
  id: string;
  title: string;
  kind: string;
  year: string;
  summary: string;
  problem: string;
  built: string[];
  stack: string[];
  role: string;
  metric?: { value: string; label: string };
};

export type Dict = {
  meta: { title: string; description: string };
  nav: { work: string; how: string; stack: string; contact: string };
  hero: {
    eyebrow: string;
    name: string;
    role: string;
    pitch: string;
    location: string;
    languages: string;
    ctaWork: string;
    ctaContact: string;
  };
  stats: { value: string; label: string }[];
  work: { title: string; note: string; roleLabel: string; problemLabel: string; builtLabel: string };
  projects: Project[];
  how: {
    title: string;
    note: string;
    diagramTitle: string;
    diagramCaption: string;
    nodes: { id: string; label: string; sub: string }[];
    principles: { title: string; body: string }[];
  };
  stack: { title: string; note: string; groups: { label: string; items: string[] }[] };
  contact: { title: string; body: string; email: string; github: string; cta: string };
  footer: { built: string; source: string };
};

const projectsEn: Project[] = [
  {
    id: "odoo-erp",
    title: "Odoo ERP Platform",
    kind: "ERP · Backend",
    year: "2025—2026",
    summary:
      "Custom Odoo 18 modules running production, sales, logistics and billing for an ice and cold-chain manufacturer.",
    problem:
      "Production, sales and logistics each kept their own records. Route drivers settled cash and inventory by hand, with no audit trail.",
    built: [
      "Shift and line control, harvest and packing capture, product transformations with correct stock moves, HACCP records and batch posting",
      "End-of-day route liquidations that reconcile cash and inventory, then close and lock the route",
      "WhatsApp operational notifications (route start, delivery + ticket, invoice) with idempotency guards so retries never send twice",
      "A CRM automation bridge relaying Odoo chatter to n8n, with a bot-pause control patched into the chatter UI so a human can take over mid-conversation",
    ],
    stack: ["Odoo 18", "Python", "PostgreSQL", "OWL", "n8n", "WhatsApp Business"],
    role: "Backend/ERP developer on a ~90-module monorepo, and one of its two main contributors (~285 commits). Owned the production-ops and sales-ops domains end to end.",
    metric: { value: "285", label: "commits · 2nd of 10 contributors" },
  },
  {
    id: "koldplant",
    title: "KoldPlant — Production Telemetry",
    kind: "IoT · Data Architecture",
    year: "2026",
    summary:
      "Plant telemetry ingested into the ERP, reconciled against human capture, and surfaced by role.",
    problem:
      "Production was recorded twice by systems that never met: humans capturing shifts in a PWA, and equipment telemetry reporting machine output. Neither could answer, with an audit trail, how much was actually produced.",
    built: [
      "Equipment data posted into the ERP through n8n, landing in an idempotent intake tray treated as technical evidence — not final truth — until reconciled",
      "A canonical equipment model so telemetry from a device resolves to the same entity operators and finance see",
      "Captured → validated → costed production as distinct auditable states rather than one mutable number",
      "A read-only analytics layer on SQL views over a replica, deliberately kept separate from the operational surfaces",
    ],
    stack: ["IoT telemetry", "n8n", "Odoo 18", "PostgreSQL", "SQL views", "Metabase"],
    role: "Owned the production-capture and equipment-data side: the ERP modules that receive and validate plant data, and the mapping of machine data to canonical equipment fields.",
  },
  {
    id: "ops-pwa",
    title: "ERP-Integrated Operations App",
    kind: "PWA · Full-stack",
    year: "2026",
    summary:
      "A React PWA to run and record plant, sales and delivery operations live against the ERP.",
    problem: "Plant operations were tracked manually and disconnected from the ERP.",
    built: [
      "Progressive Web App to run and record plant operations remotely",
      "Real-time integration with Odoo through REST APIs",
      "Role-based access per job function, with dashboards for monitoring",
      "Delivery-route assignment and maps for logistics tracking",
    ],
    stack: ["React 18", "Vite", "Tailwind CSS", "Odoo REST", "PostgreSQL", "Vercel"],
    role: "Full-stack and ERP integration work across modules and shared libraries, second of six contributors (~187 commits).",
    metric: { value: "187", label: "commits · 2nd of 6 contributors" },
  },
  {
    id: "koldhome",
    title: "KoldHome — D2C Ordering PWA",
    kind: "E-commerce · Payments",
    year: "2026",
    summary:
      "Consumer storefront with passwordless login and card payment resolved through the ERP.",
    problem:
      "A consumer channel has no salesperson to key the order in, so the app is the order entry point — the ERP write has to be correct the first time.",
    built: [
      "Passwordless login via WhatsApp magic link — no passwords, no OTP typing, no account-creation friction",
      "Card payment driven through the ERP's own payment-link mechanism with Stripe behind it, embedded in the PWA with a proper return path, so payment and sale order stay tied together",
      "Cart-to-sale-order mapping with tax-exclusive prices rounded at 2 decimals, killing one-cent discrepancies on invoices",
      "Channel-scoped catalog by ERP tag, with a fallback that kept the storefront correct while re-tagging rolled out in production",
    ],
    stack: ["Next.js", "TypeScript", "Odoo REST", "Stripe", "Vercel", "n8n"],
    role: "Owned the passwordless authentication flow and the payment + order-creation path into the ERP (~15 of 46 commits).",
  },
  {
    id: "b2b-pwa",
    title: "B2B Ordering PWA",
    kind: "E-commerce · Frontend",
    year: "2026",
    summary:
      "Self-service ordering for retailers, against a catalog derived live from the ERP category tree.",
    problem:
      "Small retailers ordered by phone and WhatsApp, and a salesperson re-typed each order into the ERP — with the usual transcription errors.",
    built: [
      "Magic-link authentication through WhatsApp, replacing an OTP flow",
      "Detection and handling of WhatsApp's in-app WebView, which does not persist sessions the way the real browser does — token verification is blocked inside it and handed off to the system browser",
      "A full visual overhaul: design tokens, 2-column product grid with inline quantity controls, and a bottom nav with active state — specified before a single component was touched",
    ],
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "Odoo REST", "Vercel"],
    role: "Owned the authentication flow and the visual redesign end to end (~15 of 70 commits).",
  },
  {
    id: "power-platform",
    title: "Inspections & Reporting on Power Platform",
    kind: "Microsoft 365 · Low-code",
    year: "2025",
    summary:
      "A Power Apps canvas app, SharePoint data model and Power Automate flows that turn field inspections into signed PDF reports.",
    problem:
      "Plant inspections were captured on paper. Findings, photos and signatures were transcribed by hand into Word, and consolidated reports took hours to assemble — so they were assembled late, or not at all.",
    built: [
      "A seven-screen canvas app: inspection list, detail editing in place, new-inspection form with auto-generated folio, a filtered view of non-conforming findings, incident capture, report cover sheet, and a photo viewer",
      "A SharePoint data model with parent-child inspections and findings, plus an object catalog that a flow uses to pre-populate every new inspection's line items",
      "Flows that fill Word templates from content controls, substitute signature placeholders with real images, convert to PDF and file the result under a predictable naming convention",
      "A consolidated report that renders several hundred rows as an HTML table, converts it to PDF, injects signatures and merges everything into one document",
    ],
    stack: ["Power Apps", "Power Automate", "SharePoint", "Word/PDF", "Microsoft 365"],
    role: "Built the canvas app, the SharePoint data model and the Power Automate flows, and wrote the technical documentation for handover and maintenance.",
    metric: { value: "~396", label: "rows rendered per consolidated report" },
  },
  {
    id: "ai-agents",
    title: "AI Agents & Business Automations",
    kind: "AI · Automation",
    year: "2024—2026",
    summary: "AI agents and chatbots wired into the systems where the business actually runs.",
    problem: "Manual, repetitive work across sales and operations was slow and error-prone.",
    built: [
      "AI agents and chatbots (OpenAI, Botpress) integrated into business systems",
      "Automations orchestrated in n8n, connecting external services via REST APIs and webhooks",
      "Prompt engineering for reliable, consistent outputs",
      "Documentation of each workflow for maintainability",
    ],
    stack: ["OpenAI", "Claude", "Botpress", "n8n", "Power Automate", "Python"],
    role: "Designed, built, deployed and documented the solutions end to end.",
  },
  {
    id: "ofertin",
    title: "Ofertin — WhatsApp Offers Channel",
    kind: "Own product",
    year: "2025",
    summary: "An API that runs a WhatsApp promotions and referrals channel. Built from scratch.",
    problem: "Distributing promotions and tracking referrals manually was slow and hard to scale.",
    built: [
      "An API automating a WhatsApp offers channel, distributing promotions with discount codes and referral links",
      "Integration via the WhatsApp Business Platform, REST APIs and webhooks",
    ],
    stack: ["WhatsApp Business API", "REST APIs", "Webhooks", "Python", "JavaScript"],
    role: "End to end: idea, build, integration and deployment.",
  },
  {
    id: "marketplace",
    title: "Marketplace Automation",
    kind: "Integration · Automation",
    year: "2024—2025",
    summary: "Listing and catalog data kept current across marketplaces, without manual checks.",
    problem:
      "Keeping product and listing data current across marketplaces required repetitive manual checks.",
    built: [
      "Data extraction and integration with marketplace APIs (Mercado Libre)",
      "Automated n8n workflows for monitoring and updating data via APIs and webhooks",
      "Documentation for monitoring and maintenance",
    ],
    stack: ["Mercado Libre APIs", "Web scraping", "n8n", "Google Sheets", "Python/JS"],
    role: "Built the extraction and automation pipeline end to end, and documented it.",
  },
];

const projectsEs: Project[] = [
  {
    id: "odoo-erp",
    title: "Plataforma ERP en Odoo",
    kind: "ERP · Backend",
    year: "2025—2026",
    summary:
      "Módulos Odoo 18 a la medida que operan producción, ventas, logística y facturación de una manufacturera de hielo y cadena de frío.",
    problem:
      "Producción, ventas y logística llevaban cada una sus propios registros. Los repartidores liquidaban efectivo e inventario a mano, sin rastro auditable.",
    built: [
      "Control de turno y línea, captura de cosecha y empaque, transformaciones de producto con movimientos de stock correctos, registros HACCP y posting batch",
      "Liquidaciones de fin de día que concilian efectivo e inventario, y luego cierran y bloquean la ruta",
      "Notificaciones operativas por WhatsApp (inicio de ruta, entrega + ticket, factura) con guardas de idempotencia para que un reintento nunca mande dos veces",
      "Un puente de automatización CRM que relaya el chatter de Odoo hacia n8n, con un botón de bot-pause insertado en la UI del chatter para que un humano tome la conversación a media línea",
    ],
    stack: ["Odoo 18", "Python", "PostgreSQL", "OWL", "n8n", "WhatsApp Business"],
    role: "Desarrollador backend/ERP en un monorepo de ~90 módulos, y uno de sus dos contribuidores principales (~285 commits). Dueño de los dominios de producción y ventas de punta a punta.",
    metric: { value: "285", label: "commits · 2º de 10 contribuidores" },
  },
  {
    id: "koldplant",
    title: "KoldPlant — Telemetría de Producción",
    kind: "IoT · Arquitectura de datos",
    year: "2026",
    summary:
      "Telemetría de planta ingerida al ERP, reconciliada contra la captura humana, y expuesta por rol.",
    problem:
      "La producción se registraba dos veces, por sistemas que nunca se encontraban: humanos capturando turnos en una PWA, y telemetría de equipos reportando salida de máquina. Ninguno podía responder, con rastro auditable, cuánto se produjo realmente.",
    built: [
      "Datos de equipo enviados al ERP vía n8n, aterrizando en una bandeja de intake idempotente tratada como evidencia técnica —no como verdad final— hasta reconciliarse",
      "Un modelo canónico de equipos para que la telemetría de un dispositivo resuelva a la misma entidad que ven operadores y finanzas",
      "Producción capturada → validada → costeada como estados auditables distintos, en vez de un solo número mutable",
      "Una capa analítica read-only sobre vistas SQL en réplica, deliberadamente separada de las superficies operativas",
    ],
    stack: ["Telemetría IoT", "n8n", "Odoo 18", "PostgreSQL", "Vistas SQL", "Metabase"],
    role: "Dueño del lado de captura de producción y datos de equipo: los módulos del ERP que reciben y validan datos de planta, y el mapeo de datos de máquina a campos canónicos.",
  },
  {
    id: "ops-pwa",
    title: "App de Operaciones Integrada al ERP",
    kind: "PWA · Full-stack",
    year: "2026",
    summary:
      "Una PWA en React para ejecutar y registrar operaciones de planta, venta y reparto en vivo contra el ERP.",
    problem: "Las operaciones de planta se registraban a mano y desconectadas del ERP.",
    built: [
      "Progressive Web App para ejecutar y registrar operaciones de planta de forma remota",
      "Integración en tiempo real con Odoo vía APIs REST",
      "Acceso por rol según puesto, con dashboards de monitoreo",
      "Asignación de rutas de reparto y mapas para seguimiento logístico",
    ],
    stack: ["React 18", "Vite", "Tailwind CSS", "Odoo REST", "PostgreSQL", "Vercel"],
    role: "Trabajo full-stack e integración con el ERP en módulos y librerías compartidas, segundo de seis contribuidores (~187 commits).",
    metric: { value: "187", label: "commits · 2º de 6 contribuidores" },
  },
  {
    id: "koldhome",
    title: "KoldHome — PWA de Venta al Consumidor",
    kind: "E-commerce · Pagos",
    year: "2026",
    summary:
      "Tienda para consumidor final con login sin contraseña y pago con tarjeta resuelto a través del ERP.",
    problem:
      "Un canal de consumidor no tiene vendedor que capture el pedido, así que la app es el punto de entrada — la escritura al ERP tiene que salir bien a la primera.",
    built: [
      "Login sin contraseña por magic link de WhatsApp — sin contraseñas, sin teclear OTP, sin fricción de crear cuenta",
      "Pago con tarjeta a través del mecanismo de payment link del propio ERP con Stripe detrás, embebido en la PWA con retorno correcto, de modo que pago y pedido quedan ligados",
      "Mapeo de carrito a pedido con precios sin IVA redondeados a 2 decimales, eliminando descuadres de un centavo en facturas",
      "Catálogo filtrado por canal vía tag del ERP, con un fallback que mantuvo la tienda correcta mientras el re-tagging corría en producción",
    ],
    stack: ["Next.js", "TypeScript", "Odoo REST", "Stripe", "Vercel", "n8n"],
    role: "Dueño del flujo de autenticación sin contraseña y de la ruta de pago y creación de pedido hacia el ERP (~15 de 46 commits).",
  },
  {
    id: "b2b-pwa",
    title: "PWA de Pedidos B2B",
    kind: "E-commerce · Frontend",
    year: "2026",
    summary:
      "Pedidos self-service para detallistas, contra un catálogo derivado en vivo del árbol de categorías del ERP.",
    problem:
      "Los detallistas pedían por teléfono y WhatsApp, y un vendedor recapturaba cada pedido en el ERP — con los errores de transcripción de siempre.",
    built: [
      "Autenticación por magic link vía WhatsApp, reemplazando un flujo de OTP",
      "Detección y manejo del WebView in-app de WhatsApp, que no persiste sesión como el navegador real: la verificación del token se bloquea ahí dentro y se delega al navegador del sistema",
      "Un rediseño visual completo: design tokens, grid de producto a 2 columnas con controles de cantidad, y bottom nav con estado activo — especificado antes de tocar un solo componente",
    ],
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "Odoo REST", "Vercel"],
    role: "Dueño del flujo de autenticación y del rediseño visual de punta a punta (~15 de 70 commits).",
  },
  {
    id: "power-platform",
    title: "Inspecciones y Reportes en Power Platform",
    kind: "Microsoft 365 · Low-code",
    year: "2025",
    summary:
      "Una app canvas de Power Apps, un modelo de datos en SharePoint y flujos de Power Automate que convierten inspecciones de campo en reportes PDF firmados.",
    problem:
      "Las inspecciones de planta se capturaban en papel. Hallazgos, fotos y firmas se transcribían a mano en Word, y armar los reportes consolidados tomaba horas — así que se armaban tarde, o no se armaban.",
    built: [
      "Una app de siete pantallas: listado de inspecciones, edición de detalle in place, alta con folio autogenerado, vista filtrada de hallazgos no conformes, captura de incidencias, carátula del reporte y visor de fotos",
      "Un modelo de datos en SharePoint con inspecciones y hallazgos padre-hijo, más un catálogo de objetos que un flujo usa para prellenar las líneas de cada inspección nueva",
      "Flujos que rellenan plantillas de Word desde content controls, sustituyen los marcadores de firma por imágenes reales, convierten a PDF y archivan con una convención de nombres predecible",
      "Un reporte consolidado que renderiza varios cientos de filas como tabla HTML, la convierte a PDF, inyecta las firmas y combina todo en un solo documento",
    ],
    stack: ["Power Apps", "Power Automate", "SharePoint", "Word/PDF", "Microsoft 365"],
    role: "Construí la app canvas, el modelo de datos en SharePoint y los flujos de Power Automate, y escribí la documentación técnica para entrega y mantenimiento.",
    metric: { value: "~396", label: "filas por reporte consolidado" },
  },
  {
    id: "ai-agents",
    title: "Agentes de IA y Automatizaciones",
    kind: "IA · Automatización",
    year: "2024—2026",
    summary: "Agentes de IA y chatbots conectados a los sistemas donde el negocio realmente opera.",
    problem: "El trabajo manual y repetitivo en ventas y operaciones era lento y propenso a error.",
    built: [
      "Agentes de IA y chatbots (OpenAI, Botpress) integrados a sistemas de negocio",
      "Automatizaciones orquestadas en n8n, conectando servicios externos vía APIs REST y webhooks",
      "Prompt engineering para salidas confiables y consistentes",
      "Documentación de cada flujo para mantenibilidad",
    ],
    stack: ["OpenAI", "Claude", "Botpress", "n8n", "Power Automate", "Python"],
    role: "Diseñé, construí, desplegué y documenté las soluciones de punta a punta.",
  },
  {
    id: "ofertin",
    title: "Ofertin — Canal de Ofertas por WhatsApp",
    kind: "Producto propio",
    year: "2025",
    summary:
      "Una API que opera un canal de promociones y referidos por WhatsApp. Construido desde cero.",
    problem: "Distribuir promociones y rastrear referidos a mano era lento y difícil de escalar.",
    built: [
      "Una API que automatiza un canal de ofertas por WhatsApp, distribuyendo promociones con códigos de descuento y links de referido",
      "Integración vía WhatsApp Business Platform, APIs REST y webhooks",
    ],
    stack: ["WhatsApp Business API", "APIs REST", "Webhooks", "Python", "JavaScript"],
    role: "De punta a punta: idea, construcción, integración y despliegue.",
  },
  {
    id: "marketplace",
    title: "Automatización de Marketplaces",
    kind: "Integración · Automatización",
    year: "2024—2025",
    summary:
      "Datos de catálogo y publicaciones actualizados en marketplaces, sin revisiones manuales.",
    problem:
      "Mantener al día los datos de producto y publicaciones en marketplaces exigía revisiones manuales repetitivas.",
    built: [
      "Extracción de datos e integración con APIs de marketplace (Mercado Libre)",
      "Flujos n8n automatizados para monitorear y actualizar datos vía APIs y webhooks",
      "Documentación para monitoreo y mantenimiento",
    ],
    stack: ["APIs de Mercado Libre", "Web scraping", "n8n", "Google Sheets", "Python/JS"],
    role: "Construí el pipeline de extracción y automatización de punta a punta, y lo documenté.",
  },
];

export const dict: Record<Lang, Dict> = {
  en: {
    meta: {
      title: "Carlos Valencia — AI & Automation Engineer",
      description:
        "AI & Automation Engineer building agents, workflow automation and ERP integrations that run real operations. Guadalajara, Mexico.",
    },
    nav: { work: "Work", how: "How I build", stack: "Stack", contact: "Contact" },
    hero: {
      eyebrow: "AI & Automation Engineer",
      name: "Carlos Valencia",
      role: "Integrations · AI Agents · ERP",
      pitch:
        "Mechatronics Engineer building AI and automation that plugs into the enterprise systems where operations actually run. I turn messy business requests into systems that hold up on a bad connection, at 4am, on a delivery truck.",
      location: "Guadalajara, Mexico",
      languages: "Spanish (native) · English (B2)",
      ctaWork: "See the work",
      ctaContact: "Get in touch",
    },
    stats: [
      { value: "3+", label: "years building production systems" },
      { value: "90+", label: "custom ERP modules in the codebase" },
      { value: "285", label: "commits as 2nd contributor on the ERP monorepo" },
      { value: "9", label: "shipped projects documented as case studies" },
    ],
    work: {
      title: "Selected work",
      note: "Source code for employer and client projects is proprietary and not published. These are write-ups: the problem, what I built, the stack, and my actual role — with commit counts where they are verifiable.",
      roleLabel: "My role",
      problemLabel: "The problem",
      builtLabel: "What I built",
    },
    projects: projectsEn,
    how: {
      title: "How I build",
      note: "The same three ideas show up in almost everything above. They are what separate a demo from a system that survives contact with an operation.",
      diagramTitle: "Telemetry → truth: the KoldPlant intake path",
      diagramCaption:
        "Machine data never becomes a business number in one hop. It lands as evidence, gets reconciled against human capture, and only then drives a decision.",
      nodes: [
        { id: "n1", label: "Plant equipment", sub: "telemetry" },
        { id: "n2", label: "n8n", sub: "ingest + map" },
        { id: "n3", label: "Intake tray", sub: "idempotent · evidence" },
        { id: "n4", label: "Reconciliation", sub: "vs. human capture" },
        { id: "n5", label: "Validated production", sub: "auditable state" },
        { id: "n6", label: "Surfaces by role", sub: "PWA · BI · finance" },
      ],
      principles: [
        {
          title: "Idempotency is not optional",
          body: "Field devices retry on bad connectivity. Every write path I build — packing capture, WhatsApp sends, webhook intake — is guarded against double-submission, because in the field a retry is the normal case, not the edge case.",
        },
        {
          title: "One source of truth, several surfaces",
          body: "An operator, a plant manager and finance need different detail and different permissions over the same data. I build one logic and one truth, then present it per role — rather than letting a dashboard quietly become the system of record.",
        },
        {
          title: "Correctness at the source",
          body: "Timezones, tax rounding, company scoping. A daily close that computes 'today' in UTC will be wrong every single day until it is fixed where the data is written, not patched in the report.",
        },
      ],
    },
    stack: {
      title: "Stack",
      note: "What I reach for. Depth varies — the ERP and automation side is where I have the most production mileage.",
      groups: [
        { label: "AI", items: ["OpenAI", "Claude", "Botpress", "Prompt engineering"] },
        { label: "Automation", items: ["n8n", "Power Automate", "Webhooks"] },
        { label: "ERP", items: ["Odoo 18", "Python", "PostgreSQL", "OWL"] },
        { label: "Web", items: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Vite"] },
        { label: "Integration", items: ["REST APIs", "WhatsApp Business", "Stripe", "Mercado Libre"] },
        { label: "Microsoft 365", items: ["Power Apps", "Power Automate", "SharePoint"] },
        { label: "Other", items: ["Git", "MQTT / IoT", "Metabase", "Vercel"] },
      ],
    },
    contact: {
      title: "Let's talk",
      body: "Open to AI engineering, automation and integration roles — remote or in Guadalajara.",
      email: "cvalenciat023@gmail.com",
      github: "github.com/carlosvalenciat",
      cta: "Email me",
    },
    footer: {
      built: "Built with Next.js and Tailwind, deployed on Vercel.",
      source: "Case study write-ups on GitHub",
    },
  },
  es: {
    meta: {
      title: "Carlos Valencia — AI & Automation Engineer",
      description:
        "AI & Automation Engineer: agentes, automatización de flujos e integraciones ERP que operan procesos reales. Guadalajara, México.",
    },
    nav: { work: "Proyectos", how: "Cómo trabajo", stack: "Stack", contact: "Contacto" },
    hero: {
      eyebrow: "AI & Automation Engineer",
      name: "Carlos Valencia",
      role: "Integraciones · Agentes de IA · ERP",
      pitch:
        "Ingeniero Mecatrónico que construye IA y automatización conectadas a los sistemas empresariales donde de verdad ocurre la operación. Convierto pedidos de negocio desordenados en sistemas que aguantan con mala señal, a las 4am, arriba de un camión de reparto.",
      location: "Guadalajara, México",
      languages: "Español (nativo) · Inglés (B2)",
      ctaWork: "Ver proyectos",
      ctaContact: "Contáctame",
    },
    stats: [
      { value: "3+", label: "años construyendo sistemas en producción" },
      { value: "90+", label: "módulos ERP a la medida en el código" },
      { value: "285", label: "commits como 2º contribuidor del monorepo ERP" },
      { value: "9", label: "proyectos documentados como case studies" },
    ],
    work: {
      title: "Proyectos seleccionados",
      note: "El código de proyectos de empleador y cliente es propietario y no está publicado. Esto son write-ups: el problema, qué construí, el stack y mi rol real — con conteo de commits donde es verificable.",
      roleLabel: "Mi rol",
      problemLabel: "El problema",
      builtLabel: "Qué construí",
    },
    projects: projectsEs,
    how: {
      title: "Cómo trabajo",
      note: "Las mismas tres ideas aparecen en casi todo lo de arriba. Son lo que separa un demo de un sistema que sobrevive al contacto con una operación.",
      diagramTitle: "Telemetría → verdad: la ruta de intake de KoldPlant",
      diagramCaption:
        "El dato de máquina nunca se vuelve número de negocio en un solo salto. Aterriza como evidencia, se reconcilia contra la captura humana, y solo entonces mueve una decisión.",
      nodes: [
        { id: "n1", label: "Equipo de planta", sub: "telemetría" },
        { id: "n2", label: "n8n", sub: "ingesta + mapeo" },
        { id: "n3", label: "Bandeja de intake", sub: "idempotente · evidencia" },
        { id: "n4", label: "Reconciliación", sub: "vs. captura humana" },
        { id: "n5", label: "Producción validada", sub: "estado auditable" },
        { id: "n6", label: "Superficies por rol", sub: "PWA · BI · finanzas" },
      ],
      principles: [
        {
          title: "La idempotencia no es opcional",
          body: "Los dispositivos de campo reintentan con mala conectividad. Toda ruta de escritura que construyo —captura de empaque, envíos de WhatsApp, intake de webhooks— va blindada contra doble envío, porque en campo el reintento es el caso normal, no el borde.",
        },
        {
          title: "Una sola verdad, varias superficies",
          body: "Un operador, un gerente de planta y finanzas necesitan distinto detalle y distinto permiso sobre los mismos datos. Construyo una sola lógica y una sola verdad, y la presento por rol — en vez de dejar que un tablero se vuelva, calladito, el sistema de registro.",
        },
        {
          title: "Correcto desde el origen",
          body: "Zonas horarias, redondeo de impuestos, scoping por compañía. Un corte diario que calcula el 'hoy' en UTC va a estar mal todos los días hasta que se arregle donde se escribe el dato, no parchado en el reporte.",
        },
      ],
    },
    stack: {
      title: "Stack",
      note: "Lo que uso. La profundidad varía — el lado de ERP y automatización es donde tengo más kilometraje en producción.",
      groups: [
        { label: "IA", items: ["OpenAI", "Claude", "Botpress", "Prompt engineering"] },
        { label: "Automatización", items: ["n8n", "Power Automate", "Webhooks"] },
        { label: "ERP", items: ["Odoo 18", "Python", "PostgreSQL", "OWL"] },
        { label: "Web", items: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Vite"] },
        { label: "Integración", items: ["APIs REST", "WhatsApp Business", "Stripe", "Mercado Libre"] },
        { label: "Microsoft 365", items: ["Power Apps", "Power Automate", "SharePoint"] },
        { label: "Otros", items: ["Git", "MQTT / IoT", "Metabase", "Vercel"] },
      ],
    },
    contact: {
      title: "Hablemos",
      body: "Abierto a posiciones de ingeniería de IA, automatización e integración — remoto o en Guadalajara.",
      email: "cvalenciat023@gmail.com",
      github: "github.com/carlosvalenciat",
      cta: "Escríbeme",
    },
    footer: {
      built: "Hecho con Next.js y Tailwind, desplegado en Vercel.",
      source: "Case studies en GitHub",
    },
  },
};
