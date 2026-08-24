"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLang } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";

export default function AuthPage() {
  const { user, googleLogin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) router.push("/dashboard");
  }, [user, router]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center">
        <h1>Espace Meknès</h1>
        {user ? (
          <div>
            <p>Logged in as {user.email}</p>
            <button onClick={() => googleLogin()}>Continuer avec Google</button>
            <br />
            <button onClick={() => router.push("/dashboard")}>Go to Dashboard</button>
          </div>
        ) : (
          <div>
            <p>Please log in</p>
            <button onClick={() => googleLogin()}>Continuer avec Google</button>
            <br />
            <button onClick={() => router.push("/dashboard")}>Go to Dashboard</button>
          </div>
        )}
      </div>
    </div>
  );
}