import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import "@fontsource-variable/jetbrains-mono/wght.css";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://cvalenciat.dev"),
  title: "Carlos Valencia — AI & Automation Engineer",
  description:
    "AI & Automation Engineer building agents, workflow automation and ERP integrations that run real operations. Guadalajara, Mexico.",
  keywords: [
    "AI Engineer",
    "Automation Engineer",
    "n8n",
    "Odoo",
    "ERP integration",
    "AI agents",
    "Guadalajara",
  ],
  authors: [{ name: "Carlos Alexander Valencia Tapia" }],
  openGraph: {
    title: "Carlos Valencia — AI & Automation Engineer",
    description:
      "Agents, workflow automation and ERP integrations that run real operations.",
    type: "website",
    locale: "en_US",
    alternateLocale: "es_MX",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#08090c",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={GeistSans.variable}>
      <head>
        {/* Without JS the scroll-reveal system never runs, so every
            .gs-reveal would stay at opacity 0. Reverse it here rather
            than defaulting to visible, which would flash before hiding. */}
        <noscript>
          <style>{`.gs-reveal{opacity:1 !important;transform:none !important}`}</style>
        </noscript>
      </head>
      <body>{children}</body>
    </html>
  );
}
