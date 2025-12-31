"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/stores/user-store";
import { auth } from "@/lib/api-client";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, logout } = useUserStore();

  useEffect(() => {
    // Check auth status on mount and when visibility changes
    const checkAuth = () => {
      const hasToken = auth.isAuthenticated();

      if (!hasToken && isAuthenticated) {
        // Token was removed but store still thinks user is authenticated
        logout();
        router.push("/login");
      }
    };

    // Check immediately
    checkAuth();

    // Check when page becomes visible (detects cookie deletion in dev tools)
    document.addEventListener("visibilitychange", checkAuth);

    // Check periodically (every 5 seconds)
    const interval = setInterval(checkAuth, 5000);

    return () => {
      document.removeEventListener("visibilitychange", checkAuth);
      clearInterval(interval);
    };
  }, [isAuthenticated, logout, router]);

  return <>{children}</>;
}
