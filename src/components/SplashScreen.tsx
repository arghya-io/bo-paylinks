import { useEffect, useState } from "react";

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [phase, setPhase] = useState<"in" | "out">("in");

  useEffect(() => {
    const timer = setTimeout(() => setPhase("out"), 1200);
    const done = setTimeout(onComplete, 1700);
    return () => {
      clearTimeout(timer);
      clearTimeout(done);
    };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background/95 backdrop-blur-xl transition-opacity duration-500 ${
        phase === "out" ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="relative w-20 h-20 mb-8">
        <div className="absolute inset-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-primary animate-pulse-glow" />
        <div className="absolute inset-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 animate-orbit">
          <div className="w-3 h-3 rounded-full bg-primary/80" />
        </div>
      </div>
      <p className="text-sm text-foreground/80 text-center px-8 max-w-xs animate-fade-in-up">
        You're being redirected to Lightning Speed Payments ⚡
      </p>
    </div>
  );
};

export default SplashScreen;
