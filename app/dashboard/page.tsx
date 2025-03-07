"use client";
import ProtectedRoute from "@/components/ProtectedRoute"; // Import the protected route component
import Header from "@/components/Header";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import Loading from "@/components/Loading";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [loadingSignOut, setLoadingSignOut] = useState(false);

  if (status === "loading") return <Loading />;

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col">
        <Header />

        <div className="flex flex-col items-center justify-center flex-grow">
          <h1 className="text-2xl font-bold">Welcome to Your Dashboard</h1>
          <p className="mt-2">Name: {session?.user?.name || "N/A"}</p>
          <p className="mt-2">Your email: {session?.user?.email}</p>

          <button
            onClick={async () => {
              setLoadingSignOut(true);
              await signOut();
              setLoadingSignOut(false);
            }}
            disabled={loadingSignOut}
            className={`mt-4 px-4 py-2 rounded ${loadingSignOut ? "bg-gray-400 cursor-not-allowed" : "bg-red-500 hover:bg-red-600 text-white"}`}
          >
            {loadingSignOut ? "Signing Out..." : "Sign Out"}
          </button>
        </div>
      </div>
    </ProtectedRoute>
  );
}
