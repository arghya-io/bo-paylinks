import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Zap,
  User,
  CreditCard,
  Building2,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { validateUpiId, validateBankAccount, validateIfsc } from "@/lib/upi";
import { toast } from "sonner";

type UpiType = "standard" | "bank";

const CreateLink = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Step 1 – Identity
  const [name, setName] = useState("");
  const [upiType, setUpiType] = useState<UpiType>("standard");
  const [upiId, setUpiId] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [ifscCode, setIfscCode] = useState("");

  // Step 2 – Payment details
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");

  const isStep1Valid = () => {
    if (!name.trim()) return false;
    if (upiType === "standard") return validateUpiId(upiId);
    return validateBankAccount(accountNumber) && validateIfsc(ifscCode);
  };

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const payload: Record<string, unknown> = {
        name: name.trim(),
        upi_type: upiType,
        amount: amount ? parseFloat(amount) : null,
        note: note.trim() || null,
      };

      if (upiType === "standard") {
        payload.upi_id = upiId.trim();
      } else {
        payload.bank_account_number = accountNumber.trim();
        payload.ifsc_code = ifscCode.trim().toUpperCase();
      }

      const { data, error } = await supabase
        .from("payment_requests")
        .insert(payload as any)
        .select("unique_token")
        .single();

      if (error) throw error;

      navigate(`/link/${data.unique_token}`);
    } catch (e: any) {
      toast.error(e.message || "Failed to create link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm">
        {/* Back */}
        <button
          onClick={() => (step === 1 ? navigate("/") : setStep(1))}
          className="flex items-center gap-1.5 text-xs text-muted-foreground mb-6 hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          {step === 1 ? "Home" : "Back"}
        </button>

        {/* Step indicator */}
        <div className="flex gap-2 mb-8">
          {[1, 2].map((s) => (
            <div
              key={s}
              className={`h-0.5 flex-1 rounded-full transition-colors ${
                s <= step ? "bg-primary" : "bg-border"
              }`}
            />
          ))}
        </div>

        {step === 1 ? (
          <div className="animate-fade-in-up">
            <h2 className="text-lg font-semibold mb-1">Identity Setup</h2>
            <p className="text-xs text-muted-foreground mb-6">
              Enter your payment details
            </p>

            {/* Name */}
            <label className="text-xs text-muted-foreground mb-1.5 block">
              Full Name
            </label>
            <div className="relative mb-4">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <input
                className="glass-input w-full pl-9"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {/* UPI Type toggle */}
            <label className="text-xs text-muted-foreground mb-1.5 block">
              UPI Type
            </label>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {(
                [
                  { value: "standard" as const, label: "Standard UPI", icon: CreditCard },
                  { value: "bank" as const, label: "Bank Account", icon: Building2 },
                ] as const
              ).map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  onClick={() => setUpiType(value)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs border transition-all duration-200 ${
                    upiType === value
                      ? "border-primary bg-primary/10 text-foreground"
                      : "border-border bg-secondary/30 text-muted-foreground hover:border-primary/40"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </button>
              ))}
            </div>

            {/* Dynamic fields */}
            {upiType === "standard" ? (
              <div className="mb-6">
                <label className="text-xs text-muted-foreground mb-1.5 block">
                  UPI ID
                </label>
                <input
                  className="glass-input w-full"
                  placeholder="example@bank"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                />
                {upiId && !validateUpiId(upiId) && (
                  <p className="text-xs text-destructive mt-1">
                    Invalid UPI ID format
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block">
                    Account Number
                  </label>
                  <input
                    className="glass-input w-full"
                    placeholder="9–18 digit account number"
                    value={accountNumber}
                    onChange={(e) =>
                      setAccountNumber(e.target.value.replace(/\D/g, ""))
                    }
                    maxLength={18}
                  />
                  {accountNumber && !validateBankAccount(accountNumber) && (
                    <p className="text-xs text-destructive mt-1">
                      Must be 9–18 digits
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block">
                    IFSC Code
                  </label>
                  <input
                    className="glass-input w-full uppercase"
                    placeholder="HDFC0001234"
                    value={ifscCode}
                    onChange={(e) =>
                      setIfscCode(e.target.value.toUpperCase().slice(0, 11))
                    }
                    maxLength={11}
                  />
                  {ifscCode && !validateIfsc(ifscCode) && (
                    <p className="text-xs text-destructive mt-1">
                      Invalid IFSC format
                    </p>
                  )}
                </div>
              </div>
            )}

            <button
              disabled={!isStep1Valid()}
              onClick={() => setStep(2)}
              className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-2.5 rounded-lg text-sm font-semibold btn-glow transition-all duration-200 disabled:opacity-40 disabled:pointer-events-none"
            >
              Continue <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="animate-fade-in-up">
            <h2 className="text-lg font-semibold mb-1">Payment Details</h2>
            <p className="text-xs text-muted-foreground mb-6">
              Optional – leave blank for flexible payments
            </p>

            {/* Identity summary */}
            <div className="glass-card p-3 mb-6">
              <p className="text-xs text-muted-foreground">Payee</p>
              <p className="text-sm font-medium">{name}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {upiType === "standard"
                  ? upiId
                  : `${accountNumber}@${ifscCode}.ifsc.npci`}
              </p>
            </div>

            <label className="text-xs text-muted-foreground mb-1.5 block">
              Amount (₹)
            </label>
            <input
              className="glass-input w-full mb-4"
              placeholder="Optional"
              type="number"
              min="0"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />

            <label className="text-xs text-muted-foreground mb-1.5 block">
              Note
            </label>
            <input
              className="glass-input w-full mb-8"
              placeholder="Optional – e.g. Payment for order #123"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              maxLength={100}
            />

            <button
              disabled={loading}
              onClick={handleGenerate}
              className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-2.5 rounded-lg text-sm font-semibold btn-glow transition-all duration-200 disabled:opacity-60"
            >
              {loading ? (
                <span className="animate-pulse">Generating…</span>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  Generate Link
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateLink;
