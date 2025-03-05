import type React from "react"
import type { Metadata } from "next";
import { Inter } from "next/font/google"
import { ThemeProvider } from "./providers/theme-provider"

export const metadata: Metadata = {
  title: "Alphabetize Text Tool",
  description: "A simple tool to alphabetize your text",
  viewport: "width=device-width, initial-scale=1",
  icons: {
    icon: "/favicon.ico",
  },
};

const inter = Inter({ subsets: ["latin"] })



export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}

