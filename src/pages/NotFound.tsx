import { useNavigate } from "react-router-dom";
import { Zap } from "lucide-react";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6">
      <div className="text-center max-w-sm">
        <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full border border-border bg-secondary/40 text-xs text-muted-foreground">
          <Zap className="w-3.5 h-3.5 text-primary" />
          BlueOrbit Pay
        </div>

        <h1 className="text-6xl font-bold tracking-tight mb-4 glow-text">
          404
        </h1>
        <p className="text-sm text-muted-foreground mb-8">
          This page doesn't exist or the link has expired.
        </p>

        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-lg text-sm font-semibold btn-glow transition-all duration-200 hover:brightness-110"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default NotFound;
