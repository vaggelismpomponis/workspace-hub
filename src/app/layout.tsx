import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Production Architecture | Scaffolded via create-forge",
  description: "Enterprise-grade Next.js application built with strict engineering directives and anti-slop design standards.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-dvh flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
