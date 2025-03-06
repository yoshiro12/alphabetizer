"use client";

import Header from "@/components/Header";
import Loading from "@/components/Loading"; // ✅ Import the Loading component
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login"); // ✅ Redirect to login if not authenticated
    }
  }, [status, router]);

  if (status === "loading") {
    return <Loading />; // ✅ Show loading spinner
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="flex flex-col items-center justify-center flex-grow">
        <h1 className="text-2xl font-bold">Welcome to Your Dashboard</h1>
        {session ? (
          <>
            <p className="mt-2">Your email: {session.user?.email}</p>
            <button
              onClick={() => signOut()}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
            >
              Sign Out
            </button>
          </>
        ) : null}
      </div>
    </div>
  );
}
