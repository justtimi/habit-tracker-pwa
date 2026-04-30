"use client";

import { AuthService } from "@/lib/auth";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SplashScreen from "./SplashScreen";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const session = AuthService.getSession();

    if (!session) {
      router.replace("/login");
    } else {
      setFadeOut(true);
      setTimeout(() => setLoading(false), 500);
    }
  }, [router]);

  if (loading) return <SplashScreen fadeOut={fadeOut} />;
  return <>{children}</>;
};

export default ProtectedRoute;
