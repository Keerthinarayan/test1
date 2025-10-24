/*
  # Create Transactions and Payments Schema (Idempotent)

  1. Tables
    - transactions
    - pending_payments

  2. Row Level Security (RLS)
    - Enabled for both tables

  3. Policies
    - Authenticated users can manage only their own data

  4. Indexes
    - Added for user_id, created_at, and due_date
*/

-- ========================================
-- Create transactions table
-- ========================================
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL CHECK (type IN ('expense', 'loan', 'subscription')),
  category text NOT NULL,
  amount numeric(10, 2) NOT NULL CHECK (amount > 0),
  description text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  payment_method text DEFAULT '',
  stripe_payment_id text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ========================================
-- Create pending_payments table
-- ========================================
CREATE TABLE IF NOT EXISTS pending_payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL CHECK (type IN ('expense', 'loan', 'subscription')),
  name text NOT NULL,
  amount numeric(10, 2) NOT NULL CHECK (amount > 0),
  due_date date,
  recurrence text CHECK (recurrence IN ('none', 'monthly', 'yearly')),
  is_paid boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- ========================================
-- Enable Row Level Security (RLS)
-- ========================================
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE pending_payments ENABLE ROW LEVEL SECURITY;

-- ========================================
-- Drop existing policies to avoid conflicts
-- ========================================
-- Transactions policies
DROP POLICY IF EXISTS "Users can view own transactions" ON transactions;
DROP POLICY IF EXISTS "Users can insert own transactions" ON transactions;
DROP POLICY IF EXISTS "Users can update own transactions" ON transactions;
DROP POLICY IF EXISTS "Users can delete own transactions" ON transactions;

-- Pending payments policies
DROP POLICY IF EXISTS "Users can view own pending payments" ON pending_payments;
DROP POLICY IF EXISTS "Users can insert own pending payments" ON pending_payments;
DROP POLICY IF EXISTS "Users can update own pending payments" ON pending_payments;
DROP POLICY IF EXISTS "Users can delete own pending payments" ON pending_payments;

-- ========================================
-- Create policies (recreated cleanly)
-- ========================================
-- Transactions
CREATE POLICY "Users can view own transactions"
  ON transactions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own transactions"
  ON transactions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own transactions"
  ON transactions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own transactions"
  ON transactions FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Pending Payments
CREATE POLICY "Users can view own pending payments"
  ON pending_payments FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own pending payments"
  ON pending_payments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own pending payments"
  ON pending_payments FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own pending payments"
  ON pending_payments FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ========================================
-- Indexes for better query performance
-- ========================================
DROP INDEX IF EXISTS idx_transactions_user_id;
DROP INDEX IF EXISTS idx_transactions_created_at;
DROP INDEX IF EXISTS idx_pending_payments_user_id;
DROP INDEX IF EXISTS idx_pending_payments_due_date;

CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_created_at ON transactions(created_at DESC);
CREATE INDEX idx_pending_payments_user_id ON pending_payments(user_id);
CREATE INDEX idx_pending_payments_due_date ON pending_payments(due_date);
