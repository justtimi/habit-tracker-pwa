"use client";
import { AuthService } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Header = () => {
  const router = useRouter();
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const updateTime = () => setNow(new Date());
    const nowDate = new Date();
    const seconds = nowDate.getSeconds();
    const milliseconds = nowDate.getMilliseconds();

    const delay = (60 - seconds) * 1000 - milliseconds || 60000;
    let interval: NodeJS.Timeout | undefined;

    const timeout = setTimeout(() => {
      updateTime();
      interval = setInterval(updateTime, 60000);
    }, delay);

    return () => {
      clearTimeout(timeout);
      if (interval) clearInterval(interval);
    };
  }, []);

  const todayName = now.toLocaleDateString(undefined, {
    weekday: "long",
  });

  const hours = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, "0");

  const hour12 = hours % 12 || 12;
  const ampm = hours >= 12 ? "PM" : "AM";

  const formattedTime = `${hour12.toString().padStart(2, "0")}:${minutes} ${ampm}`;

  const handleLogout = () => {
    AuthService.logout();
    router.replace("/");
  };
  return (
    <nav className="w-full ">
      <h1>Happy {todayName}</h1>
      <h3>
        {now.toLocaleDateString(undefined, {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
        , {formattedTime}
      </h3>
      <button onClick={handleLogout}>Logout</button>
    </nav>
  );
};

export default Header;
