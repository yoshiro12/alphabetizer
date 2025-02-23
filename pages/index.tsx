import { ThemeToggle } from "../components/theme-toggle"
import { Alphabetizer } from "../components/alphabetizer"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Text Alphabetizer</h1>
          <ThemeToggle />
        </div>
      </header>
      <main className="container mx-auto p-4 max-w-5xl">
        <Alphabetizer />
      </main>
    </div>
  )
}

