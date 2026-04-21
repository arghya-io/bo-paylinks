export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      payment_requests: {
        Row: {
          amount: number | null;
          bank_account_number: string | null;
          created_at: string;
          expires_at: string | null;
          id: string;
          ifsc_code: string | null;
          name: string;
          note: string | null;
          unique_token: string;
          upi_id: string | null;
          upi_type: "standard" | "bank";
        };
        Insert: {
          amount?: number | null;
          bank_account_number?: string | null;
          created_at?: string;
          expires_at?: string | null;
          id?: string;
          ifsc_code?: string | null;
          name: string;
          note?: string | null;
          unique_token?: string;
          upi_id?: string | null;
          upi_type: "standard" | "bank";
        };
        Update: {
          amount?: number | null;
          bank_account_number?: string | null;
          created_at?: string;
          expires_at?: string | null;
          id?: string;
          ifsc_code?: string | null;
          name?: string;
          note?: string | null;
          unique_token?: string;
          upi_id?: string | null;
          upi_type?: "standard" | "bank";
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      upi_type: "standard" | "bank";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];

export type TablesInsert<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];

export type TablesUpdate<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];

export type Enums<T extends keyof Database["public"]["Enums"]> =
  Database["public"]["Enums"][T];
