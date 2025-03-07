// components/ProtectedRoute.tsx
"use client";  // ✅ Mark this as a client component
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Loading from "./Loading";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  requireAuth?: boolean;
}
import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string;
    }
  }

  interface User {
    id: string;
    role?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  }
}

export default function ProtectedRoute({ 
  children, 
  allowedRoles = [], 
  requireAuth = true 
}: ProtectedRouteProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    // Check authentication
    if (requireAuth && status === "unauthenticated") {
      router.push("/auth/login");
      return;
    }

    // Check role-based access
    if (
      status === "authenticated" && 
      allowedRoles.length > 0 && 
      !allowedRoles.includes(session?.user?.role as string)
    ) {
      router.push("/unauthorized");
    }
  }, [status, router, allowedRoles, requireAuth, session]);

  if (status === "loading") {
    return <Loading />; // Your loading component
  }

  // Check if user is authenticated (when required)
  if (requireAuth && status === "unauthenticated") {
    return <Loading />; // Show loading while redirecting
  }

  // Check if user has appropriate role
  if (
    status === "authenticated" && 
    allowedRoles.length > 0 && 
    !allowedRoles.includes(session?.user?.role || "")
  ) {
    return <Loading />; // Show loading while redirecting
  }

  return <>{children}</>;
}