import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Workspace Hub | Central Developer Command Center",
  description:
    "Unified developer portal and launchpad for local workspace projects and daily SaaS apps.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-dvh flex flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
        {children}
      </body>
    </html>
  );
}
