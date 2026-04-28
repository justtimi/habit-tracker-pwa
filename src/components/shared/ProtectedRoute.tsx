"use client";

import { AuthService } from "@/lib/auth";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = AuthService.getSession();

    if (!session) {
      router.replace("/login");
      return;
    }
    setLoading(false);
  }, [router]);

  if (loading) return <div>Loading...</div>;
  return <>{children}</>;
};

export default ProtectedRoute;
