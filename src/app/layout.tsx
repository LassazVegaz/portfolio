import { CssBaseline } from "@mui/material";
import type { Metadata } from "next";
import { Roboto } from "next/font/google";

const roboto = Roboto({
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Lasindu the SSE",
  description: "Portfolio of Lasindu Nuwanga Weerasinghe",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={roboto.className}>
        <CssBaseline />
        {children}
      </body>
    </html>
  );
}
