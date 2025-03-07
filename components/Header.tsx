import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "@/components/ui/button";

export default function Header() {
  return (
    <header className="border-b bg-background">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Text Alphabetizer</h1>
        <div className="flex items-center space-x-4">
          <Link href="/">
            <Button variant="outline">Home</Button>
          </Link>
          <Link href="/alphabetizer">
            <Button variant="outline">Alphabetizer</Button>
          </Link>
          <Link href="/mongodb">
            <Button variant="outline">MongoDB Page</Button>
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
