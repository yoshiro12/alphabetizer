"use client";

import Header from "@/components/Header";
import Loading from "@/components/Loading";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface CustomUser {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string; // ✅ Define role explicitly
}

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loadingSignOut, setLoadingSignOut] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return <Loading />;
  }

  if (!session) {
    return <p className="text-center mt-10 text-red-500">Failed to load session.</p>;
  }

  // ✅ Cast `session.user` to `CustomUser` type
  const user = session.user as CustomUser;

  if (user.role !== "ADMIN") {
    return <p className="text-center mt-10 text-red-500">Access Denied: Admins Only</p>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="flex flex-col items-center justify-center flex-grow">
        <h1 className="text-2xl font-bold">Welcome to Your Dashboard</h1>
        <p className="mt-2">Name: {user.name || "N/A"}</p>
        <p className="mt-2">Your email: {user.email}</p>
        <p className="mt-2">Role: {user.role}</p>

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
