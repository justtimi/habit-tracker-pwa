import Splash from "@/assets/splash.png";
import Image from "next/image";

const SplashScreen = ({fadeOut}:{fadeOut: boolean}) => {
  return (
    <div className={`flex flex-col items-center justify-center min-h-screen gap-6 ${fadeOut ? "animate-fade-out" : "animate-fade-in"}`} data-testid="splash-screen">
      <div className="w-36">
        <Image src={Splash} alt="Habitify logo" className="" priority />
      </div>

      <h2 className="text-2xl font-semibold">Habitify</h2>
    </div>
  );
};

export default SplashScreen;
