"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Loading from "@/components/loading-screen";
import DashboardSkeleton from "./layout-skeleton";
import ErrorMessage from "@/components/error-message";
import { useUser } from "@/hooks/useUser";
import { User } from "@/types/user";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const { user, loading, error } = useUser();
  const userProfile: User | null = user ? { ...user } : null;

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", { method: "GET" });
      if (response.ok) {
        router.push("/");
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (loading) return <Loading />;
  if (error) return <ErrorMessage>{error}</ErrorMessage>;

  return (
    <DashboardSkeleton user={userProfile} handleLogout={handleLogout}>
      {children}
    </DashboardSkeleton>
  );
}
