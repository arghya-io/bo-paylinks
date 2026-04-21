export const UPI_ID_REGEX = /^[a-zA-Z0-9._-]+@[a-zA-Z][a-zA-Z0-9]*$/;
export const ACCOUNT_REGEX = /^\d{9,18}$/;
export const IFSC_REGEX = /^[A-Z]{4}0[A-Z0-9]{6}$/;

export function validateUpiId(upi: string): boolean {
  return UPI_ID_REGEX.test(upi.trim());
}

export function validateBankAccount(acc: string): boolean {
  return ACCOUNT_REGEX.test(acc.trim());
}

export function validateIfsc(ifsc: string): boolean {
  return IFSC_REGEX.test(ifsc.trim().toUpperCase());
}

export function buildUpiDeepLink(params: {
  upiId: string;
  name: string;
  amount?: number | null;
  note?: string | null;
}): string {
  const url = new URL("upi://pay");
  url.searchParams.set("pa", params.upiId);
  url.searchParams.set("pn", params.name);
  if (params.amount) url.searchParams.set("am", String(params.amount));
  if (params.note) url.searchParams.set("tn", params.note);
  return url.toString();
}

export function constructBankUpiId(accountNumber: string, ifsc: string): string {
  return `${accountNumber}@${ifsc.toUpperCase()}.ifsc.npci`;
}
