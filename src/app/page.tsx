"use client";

import SplashScreen from "@/components/shared/SplashScreen";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthService } from "@/lib/auth";

const RootPage = () => {
  const [fadeOut, setFadeOut] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);

      setTimeout(() => {
        const session = AuthService.getSession();
        if (session) {
          router.replace("/dashboard");
        } else {
          router.replace("/login");
        }
      }, 500);
    }, 1500);

    return () => clearTimeout(timer);
  }, [router]);
  return (
    <div>
      <SplashScreen fadeOut={fadeOut} />
    </div>
  );
};

export default RootPage;
