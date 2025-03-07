"use client";

import { useSession, signOut } from "next-auth/react"; // Import useSession to check authentication
import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "@/components/ui/button";

export default function Header() {
  const { data: session } = useSession(); // Get session data
  const userRole = session?.user?.role || "user";

  return (
    <header className="border-b bg-background">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Text Alphabetizer</h1>
        <div className="flex items-center space-x-4">
          <Link href="/">
            <Button variant="outline">Home</Button>
          </Link>

          {/* Conditionally render buttons based on session */}
          {session ? (
            <>
              <Link href="/alphabetizer">
                <Button variant="outline">Alphabetizer</Button>
              </Link>
              {userRole === "ADMIN" && (
                 <Link href="/mongodb">
                 <Button variant="outline">MongoDB Page</Button>
               </Link>
              )}
             
              <button onClick={() => signOut()}>Sign Out</button>

            </>
            
          ) : (
            <Link href="/auth/login">
              <Button variant="outline">Login</Button>
            </Link>
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
