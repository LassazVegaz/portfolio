import "@/styles/global.scss";
import type { Metadata, Viewport } from "next";
import { Roboto } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";

const roboto = Roboto({
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL!),
  title: "Lasindu the SSE",
  description: "Portfolio of Lasindu Nuwanga Weerasinghe",
  applicationName: "Lasindu Nuwanga Portfolio",
  creator: "Lasindu Nuwanga Weerasinghe",
  authors: [{ name: "Lasindu Nuwanga Weerasinghe" }],
  keywords: [
    "Lasindu",
    "Nuwanga",
    "Weerasinghe",
    "Senior Software Engineer",
    "Portfolio",
  ],
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
      <body className={`${roboto.className} dark:bg-black dark:text-white`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
