import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL ?? "https://lassi.vercel.app"),
  title: "Lasindu Weerasinghe — Senior Software Engineer",
  description:
    "Senior Software Engineer building reliable cloud platforms, AI products, and full-stack applications with .NET and TypeScript.",
  applicationName: "Lasindu Nuwanga Portfolio",
  creator: "Lasindu Nuwanga Weerasinghe",
  authors: [{ name: "Lasindu Nuwanga Weerasinghe" }],
  keywords: ["Lasindu Weerasinghe", "Senior Software Engineer", ".NET", "TypeScript", "AWS", "Microservices"],
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
