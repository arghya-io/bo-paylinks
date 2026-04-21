import { useNavigate } from "react-router-dom";
import { Zap } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6">
      {/* Public use notice */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 w-full max-w-lg px-6">
        <p className="text-[10px] leading-relaxed text-muted-foreground text-center tracking-wide">
          This link provider is currently available for public use. It can be
          used as a simple starter solution for startups to accept payments
          without complex payment gateway integration, while ensuring no
          personal IDs or sensitive information are displayed.
        </p>
      </div>

      <div className="text-center max-w-md">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full border border-border bg-secondary/40 text-xs text-muted-foreground">
          <Zap className="w-3.5 h-3.5 text-primary" />
          UPI Payment Link Generator
        </div>

        <h1 className="text-3xl font-bold tracking-tight mb-3 glow-text">
          BlueOrbit Pay
        </h1>
        <p className="text-sm text-muted-foreground mb-10 leading-relaxed max-w-xs mx-auto">
          Generate secure UPI payment links and QR codes in seconds. No
          gateway. No KYC. Just links.
        </p>

        <button
          onClick={() => navigate("/create")}
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-lg text-sm font-semibold btn-glow transition-all duration-200 hover:brightness-110"
        >
          <Zap className="w-4 h-4" />
          Create Payment Link
        </button>
      </div>

      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-64 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
    </div>
  );
};

export default Index;
