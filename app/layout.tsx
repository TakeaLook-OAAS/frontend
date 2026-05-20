import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OAAS — 광고관심도분석 서비스",
  description: "Offline Advertisement Analysis System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="scroll-smooth">
      <body className="antialiased overflow-hidden">
        {children}
      </body>
    </html>
  );
}
