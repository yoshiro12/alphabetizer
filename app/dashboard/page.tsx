"use client";

import Header from "@/components/Header";
import Loading from "@/components/Loading"; // ✅ Import the Loading component
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loadingSignOut, setLoadingSignOut] = useState(false);

  // ✅ Redirect if unauthenticated (but only after session has finished loading)
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, router]);

  // ✅ Show loading spinner while checking session
  if (status === "loading") {
    return <Loading />;
  }

  // ✅ Ensure session is fully loaded before accessing user data
  if (!session) {
    return <p className="text-center mt-10 text-red-500">Failed to load session.</p>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="flex flex-col items-center justify-center flex-grow">
        <h1 className="text-2xl font-bold">Welcome to Your Dashboard</h1>
        <p className="mt-2">Name: {session.user?.name || "N/A"}</p>
        <p className="mt-2">Your email: {session.user?.email}</p>

        <button
          onClick={async () => {
            setLoadingSignOut(true);
            await signOut();
            setLoadingSignOut(false);
          }}
          disabled={loadingSignOut}
          className={`mt-4 px-4 py-2 rounded ${
            loadingSignOut ? "bg-gray-400 cursor-not-allowed" : "bg-red-500 hover:bg-red-600 text-white"
          }`}
        >
          {loadingSignOut ? "Signing Out..." : "Sign Out"}
        </button>
      </div>
    </div>
  );
}
