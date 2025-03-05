import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Alphabetize Text Tool",
  description: "A simple tool to alphabetize your text",
  viewport: "width=device-width, initial-scale=1",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
