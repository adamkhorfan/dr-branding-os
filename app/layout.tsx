import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DR Branding OS",
  description:
    "The premium AI marketing operating system for DR Branding — clients, workflows, content, campaigns, reports.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
