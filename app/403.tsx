"use client";

import { useRouter } from "next/navigation";

export default function Forbidden() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold text-red-500">403 - Access Denied</h1>
      <p className="mt-2 text-gray-600">You do not have permission to view this page.</p>
      <button
        onClick={() => router.push("/")}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Go Home
      </button>
    </div>
  );
}
