"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function CallbackPage() {
  const router = useRouter();
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const handleCallback = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error || !data.session) {
        setStatus("error");
        setTimeout(() => router.push("/auth"), 2000);
        return;
      }

      setStatus("success");
      router.push("/dashboard");
    };

    handleCallback();
  }, [router]);

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