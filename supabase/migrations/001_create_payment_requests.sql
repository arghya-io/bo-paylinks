-- Create enum for UPI type
CREATE TYPE public.upi_type AS ENUM ('standard', 'bank');

-- Create payment_requests table
CREATE TABLE public.payment_requests (
  id                  UUID                     NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name                TEXT                     NOT NULL,
  upi_id              TEXT,
  bank_account_number TEXT,
  ifsc_code           TEXT,
  upi_type            public.upi_type          NOT NULL,
  amount              NUMERIC,
  note                TEXT,
  unique_token        TEXT                     NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(32), 'hex'),
  expires_at          TIMESTAMP WITH TIME ZONE DEFAULT (now() + interval '2 years'),
  created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.payment_requests ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read a payment request (required for /pay/:token public pages)
CREATE POLICY "public_read_payment_requests"
  ON public.payment_requests
  FOR SELECT
  USING (true);

-- Allow anyone to create a payment link
CREATE POLICY "public_insert_payment_requests"
  ON public.payment_requests
  FOR INSERT
  WITH CHECK (true);

-- Index for fast token lookups
CREATE INDEX idx_payment_requests_token ON public.payment_requests (unique_token);
