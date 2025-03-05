import type React from "react"
import type { Metadata } from "next";
import { Inter } from "next/font/google"
import "./globals.css";


import { ThemeProvider } from "@/providers/theme-provider";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Alphabetize Text Tool",
  description: "A simple tool to alphabetize your text",
  icons: { icon: "/favicon.ico" },
};

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
