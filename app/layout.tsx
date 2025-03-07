import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "@/styles/globals.css";
import ThemeProviderWrapper from "@/components/ThemeProviderWrapper"; 
import { Providers } from "@/components/Providers"; // ✅ Import SessionProvider

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Alphabetize Text Tool",
  description: "A simple tool to alphabetize your text",
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers> {/* ✅ Wrap everything inside SessionProvider */}
          <ThemeProviderWrapper>{children}</ThemeProviderWrapper>
        </Providers>
      </body>
    </html>
  );
}
