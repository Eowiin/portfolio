import type { Metadata, Viewport } from "next";
import "./globals.css";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: {
    default: siteConfig.title,
    template: "%s — Ethan Saux",
  },
  description: siteConfig.description,
  applicationName: "Portfolio d’Ethan Saux",
  authors: [{ name: "Ethan Saux" }],
  creator: "Ethan Saux",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: "Ethan Saux",
  },
};

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#0a0908",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>
        <a className="skip-link" href="#contenu">
          Aller au contenu
        </a>
        {children}
      </body>
    </html>
  );
}
