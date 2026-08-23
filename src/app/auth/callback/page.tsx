"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function CallbackPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // After Google login, user is logged in
    // Redirect to dashboard or home
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  return null;
}