"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Suspense } from "react";

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get("code");

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
          setStatus("error");
          setTimeout(() => router.push("/auth"), 2000);
          return;
        }
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setStatus("error");
        setTimeout(() => router.push("/auth"), 2000);
        return;
      }

      router.push("/dashboard");
    };

    handleCallback();
  }, [router, searchParams]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        {status === "loading" && (
          <>
            <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-navy-500">Connexion en cours...</p>
          </>
        )}
        {status === "error" && (
          <p className="text-red-500">Erreur de connexion. Redirection...</p>
        )}
      </div>
    </div>
  );
}

export default function CallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
      </div>
    }>
      <CallbackContent />
    </Suspense>
  );
}