import "@/styles/global.scss";
import type { Metadata } from "next";
import { Roboto } from "next/font/google";

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={roboto.className}>{children}</body>
    </html>
  );
}
