import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { Zap, QrCode, User, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { buildUpiDeepLink, constructBankUpiId } from "@/lib/upi";

const PublicPay = () => {
  const { token } = useParams();
  const [data, setData] = useState<any>(null);
  const [showQr, setShowQr] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const load = async () => {
      const { data: row, error: err } = await supabase
        .from("payment_requests")
        .select("*")
        .eq("unique_token", token)
        .single();

      if (err || !row) {
        setError(true);
        return;
      }

      if (row.expires_at && new Date(row.expires_at) < new Date()) {
        setError(true);
        return;
      }

      setData(row);
    };

    load();
  }, [token]);

  if (error) {
    return (
      <div className="relative z-10 flex min-h-screen items-center justify-center px-6">
        <p className="text-sm text-muted-foreground">
          Payment link not found or expired.
        </p>
      </div>
    );
  }

  if (!data) return null;

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

  return (
    <div className="relative z-10 flex min-h-screen flex-col items-center px-6 pt-[18vh] pb-12">
      <div className="w-full max-w-sm animate-fade-in-up">
        {/* Brand */}
        <div className="flex items-center gap-2 mb-8 justify-center">
          <Zap className="w-4 h-4 text-primary" />
          <span className="text-xs font-semibold tracking-wide text-muted-foreground">
            BlueOrbit Pay
          </span>
        </div>

        {/* Payee card */}
        <div className="glass-card p-6 text-center mb-6">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
            <User className="w-5 h-5 text-primary" />
          </div>

          <p className="text-xs text-muted-foreground">
            You're transferring money to:
          </p>
          <p className="text-lg font-bold mt-1">{data.name}</p>

          {data.amount && (
            <p className="text-2xl font-bold text-primary mt-4">
              ₹{Number(data.amount).toFixed(2)}
            </p>
          )}

          {data.note && (
            <p className="text-xs text-muted-foreground mt-2 italic">
              "{data.note}"
            </p>
          )}

          {showQr && (
            <div className="mt-6 flex justify-center animate-fade-in-up">
              <div className="bg-foreground p-3 rounded-xl">
                <QRCodeSVG
                  value={deepLink}
                  size={180}
                  bgColor="hsl(210,40%,92%)"
                  fgColor="hsl(222,47%,6%)"
                />
              </div>
            </div>
          )}
        </div>

        {/* CTA buttons */}
        <div className="space-y-3 mb-8">
          <a
            href={deepLink}
            className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 rounded-lg text-sm font-semibold btn-glow transition-all"
          >
            <Zap className="w-4 h-4" />
            Pay Now
          </a>

          <button
            onClick={() => setShowQr(!showQr)}
            className="w-full flex items-center justify-center gap-2 bg-secondary text-secondary-foreground py-2.5 rounded-lg text-xs font-medium transition-all hover:bg-secondary/80"
          >
            <QrCode className="w-3.5 h-3.5" />
            {showQr ? "Hide QR Code" : "View QR Code"}
          </button>
        </div>

        {/* Disclaimer */}
        <div className="flex gap-2.5 items-start p-3 rounded-lg border border-border/40 bg-card/30">
          <AlertTriangle className="w-3.5 h-3.5 text-red-500 mt-0.5 shrink-0" />
          <p className="text-[10px] leading-relaxed text-muted-foreground">
            All payments are processed only through official UPI apps. We do
            not handle, store, or interfere with banking or UPI transactions.
            In case of payment failure or issues, we are not responsible.
            Always verify the recipient's official name shown inside your UPI
            app before completing payment.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PublicPay;
