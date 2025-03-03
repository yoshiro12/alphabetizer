import Header from "../components/Header";
import { Alphabetizer } from "../components/alphabetizer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto p-4 max-w-5xl">
        <Alphabetizer />
      </main>
    </div>
  );
}
