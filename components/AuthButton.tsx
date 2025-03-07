"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

export default function AuthForm() {
  const [email, setEmail] = useState("");
  const [authMethod, setAuthMethod] = useState<"email" | "discord">("email");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return alert("Please enter your email");

    await signIn("email", { email, redirect: false });
    alert("Check your email for the magic link!");
  };

  return (
    <div className="space-y-4">
      {/* Tagged navigation for Magic Link and Discord */}
      <div className="flex justify-center space-x-4 mb-4">
        <button
          onClick={() => setAuthMethod("email")}
          className={`${
            authMethod === "email" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"
          } py-2 px-4 rounded-full font-medium`}
        >
          Magic Link
        </button>
        <button
          onClick={() => setAuthMethod("discord")}
          className={`${
            authMethod === "discord" ? "bg-purple-600 text-white" : "bg-gray-200 text-gray-800"
          } py-2 px-4 rounded-full font-medium`}
        >
          Discord
        </button>
      </div>

      {/* Conditional Rendering for Magic Link or Discord Form */}
      {authMethod === "email" ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2 rounded w-full"
            required
          />
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded w-full"
          >
            Sign in with Magic Link
          </button>
        </form>
      ) : (
        <div className="flex justify-center mt-4">
          <button
            onClick={() => signIn("discord")}
            className="px-4 py-2 bg-purple-600 text-white rounded"
          >
            Sign in with Discord
          </button>
        </div>
      )}
    </div>
  );
}
