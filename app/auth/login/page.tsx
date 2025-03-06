"use client";

import { useSession, signIn } from "next-auth/react";
import AuthForm from "@/components/AuthButton";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Login() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  if (status === "loading") {
    return <p className="text-center mt-10">Checking authentication...</p>;
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow">
    <h1 className="text-xl font-bold mb-4 text-center">Sign in</h1>
    <AuthForm />
  </div>
  );
}
