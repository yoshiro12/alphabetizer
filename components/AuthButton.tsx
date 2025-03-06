"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

export default function AuthForm() {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return alert("Please enter your email");

    await signIn("email", { email, redirect: false });
    alert("Check your email for the magic link!");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2 rounded w-full"
        required
      />
      <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full">
        Sign in with Magic Link
      </button>


      <button
        onClick={() => signIn("discord")}
        className="px-4 py-2 bg-purple-600 text-white rounded"
      >
        Sign in with Discord
      </button>
    </form>
  );
}
