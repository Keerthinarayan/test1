/*
  # Create Transactions and Payments Schema

  1. New Tables
    - `transactions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `type` (text: 'expense', 'loan', 'subscription')
      - `category` (text)
      - `amount` (numeric)
      - `description` (text)
      - `status` (text: 'pending', 'completed', 'failed')
      - `payment_method` (text)
      - `stripe_payment_id` (text, nullable)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `pending_payments`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `type` (text: 'expense', 'loan', 'subscription')
      - `name` (text)
      - `amount` (numeric)
      - `due_date` (date, nullable)
      - `recurrence` (text: 'none', 'monthly', 'yearly', nullable)
      - `is_paid` (boolean)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

-- Create transactions table
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

-- Create pending_payments table
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

-- Enable RLS
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE pending_payments ENABLE ROW LEVEL SECURITY;

-- Transactions policies
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

-- Pending payments policies
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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_pending_payments_user_id ON pending_payments(user_id);
CREATE INDEX IF NOT EXISTS idx_pending_payments_due_date ON pending_payments(due_date);