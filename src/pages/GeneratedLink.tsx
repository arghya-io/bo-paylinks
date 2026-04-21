import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { Copy, Share2, CheckCircle2, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { buildUpiDeepLink, constructBankUpiId } from "@/lib/upi";
import { toast } from "sonner";

const GeneratedLink = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data: row, error } = await supabase
        .from("payment_requests")
        .select("*")
        .eq("unique_token", token)
        .single();

      if (error || !row) {
        toast.error("Link not found");
        navigate("/");
        return;
      }

      setData(row);
      setLoading(false);
    };

    load();
  }, [token, navigate]);

  if (loading || !data) return null;

  const resolvedUpiId =
    data.upi_type === "standard"
      ? data.upi_id
      : constructBankUpiId(data.bank_account_number!, data.ifsc_code!);

  const deepLink = buildUpiDeepLink({
    upiId: resolvedUpiId,
    name: data.name,
    amount: data.amount,
    note: data.note,
  });

  const payUrl = `${window.location.origin}/pay/${token}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(payUrl);
    setCopied(true);
    toast.success("Link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: `Pay ${data.name}`, url: payUrl });
    } else {
      handleCopy();
    }
  };

  return (
    <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm animate-fade-in-up">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-1.5 text-xs text-muted-foreground mb-6 hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Home
        </button>

        {/* Success badge */}
        <div className="flex items-center gap-2 mb-6">
          <CheckCircle2 className="w-4 h-4 text-green-400" />
          <span className="text-xs text-green-400 font-medium">
            Payment link created
          </span>
        </div>

        {/* QR card */}
        <div className="glass-card p-6 flex flex-col items-center mb-6">
          <div className="bg-foreground p-3 rounded-xl mb-4">
            <QRCodeSVG
              value={deepLink}
              size={160}
              bgColor="hsl(210,40%,92%)"
              fgColor="hsl(222,47%,6%)"
            />
          </div>

          <p className="text-sm font-semibold">{data.name}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{resolvedUpiId}</p>

          {data.amount && (
            <p className="text-lg font-bold text-primary mt-2">
              ₹{Number(data.amount).toFixed(2)}
            </p>
          )}
          {data.note && (
            <p className="text-xs text-muted-foreground mt-1">{data.note}</p>
          )}
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleCopy}
            className="flex items-center justify-center gap-2 bg-secondary text-secondary-foreground py-2.5 rounded-lg text-xs font-medium transition-all hover:bg-secondary/80"
          >
            <Copy className="w-3.5 h-3.5" />
            {copied ? "Copied!" : "Copy Link"}
          </button>
          <button
            onClick={handleShare}
            className="flex items-center justify-center gap-2 bg-primary text-primary-foreground py-2.5 rounded-lg text-xs font-medium btn-glow transition-all"
          >
            <Share2 className="w-3.5 h-3.5" />
            Share
          </button>
        </div>
      </div>
    </div>
  );
};

export default GeneratedLink;
