-- Finatics.AI Banking Database Schema
-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

-- Customers Table
CREATE TABLE public.customers (
  customer_id integer NOT NULL DEFAULT nextval('customers_customer_id_seq'::regclass),
  full_name character varying NOT NULL,
  email character varying NOT NULL,
  phone character varying NOT NULL,
  address text,
  dob date,
  aadhar_number character varying NOT NULL,
  pan_number character varying NOT NULL,
  credit_score numeric,
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT customers_pkey PRIMARY KEY (customer_id)
);

-- Bank Accounts Table
CREATE TABLE public.bank_accounts (
  account_id integer NOT NULL DEFAULT nextval('bank_accounts_account_id_seq'::regclass),
  customer_id integer,
  bank_name character varying NOT NULL,
  masked_account character varying,
  account_number character varying NOT NULL UNIQUE,
  ifsc_code character varying,
  account_type character varying,
  account_holder character varying,
  currency character varying,
  balance numeric DEFAULT 0,
  status character varying,
  created_at timestamp without time zone DEFAULT now(),
  close_date timestamp without time zone,
  CONSTRAINT bank_accounts_pkey PRIMARY KEY (account_id),
  CONSTRAINT bank_accounts_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(customer_id)
);

-- Card Details Table
CREATE TABLE public.card_details (
  card_id integer NOT NULL DEFAULT nextval('card_details_card_id_seq'::regclass),
  account_id integer,
  card_type character varying NOT NULL,
  card_number character varying NOT NULL UNIQUE,
  card_network character varying,
  expiry_date date,
  cvv character varying,
  issued_date timestamp without time zone,
  close_date timestamp without time zone,
  status character varying,
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT card_details_pkey PRIMARY KEY (card_id),
  CONSTRAINT card_details_account_id_fkey FOREIGN KEY (account_id) REFERENCES public.bank_accounts(account_id)
);

-- Transactions Table
CREATE TABLE public.transactions (
  txn_id integer NOT NULL DEFAULT nextval('transactions_txn_id_seq'::regclass),
  account_id integer,
  txn_date timestamp without time zone NOT NULL,
  amount numeric NOT NULL,
  txn_type character varying,
  description text,
  category character varying,
  balance_after numeric,
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT transactions_pkey PRIMARY KEY (txn_id),
  CONSTRAINT transactions_account_id_fkey FOREIGN KEY (account_id) REFERENCES public.bank_accounts(account_id)
);

-- Demat Accounts Table
CREATE TABLE public.demat_accounts (
  demat_id integer NOT NULL DEFAULT nextval('demat_accounts_demat_id_seq'::regclass),
  customer_id integer,
  broker_name character varying NOT NULL,
  masked_demat character varying,
  total_value numeric,
  last_synced timestamp without time zone,
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT demat_accounts_pkey PRIMARY KEY (demat_id),
  CONSTRAINT demat_accounts_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(customer_id)
);

-- Holdings Table (Stock Holdings)
CREATE TABLE public.holdings (
  holding_id integer NOT NULL DEFAULT nextval('holdings_holding_id_seq'::regclass),
  demat_id integer,
  name character varying NOT NULL,
  quantity numeric,
  bought_price numeric,
  current_price numeric,
  selling_price numeric,
  selling_date date,
  status character varying,
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT holdings_pkey PRIMARY KEY (holding_id),
  CONSTRAINT holdings_demat_id_fkey FOREIGN KEY (demat_id) REFERENCES public.demat_accounts(demat_id)
);

-- Mutual Funds Table
CREATE TABLE public.mutual_funds (
  mf_id integer NOT NULL DEFAULT nextval('mutual_funds_mf_id_seq'::regclass),
  customer_id integer,
  fund_name character varying NOT NULL,
  fund_type character varying,
  units numeric,
  nav numeric,
  invested_amount numeric,
  current_value numeric,
  status character varying,
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT mutual_funds_pkey PRIMARY KEY (mf_id),
  CONSTRAINT mutual_funds_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(customer_id)
);

-- SIPs Table (Systematic Investment Plans)
CREATE TABLE public.sips (
  sip_id integer NOT NULL DEFAULT nextval('sips_sip_id_seq'::regclass),
  mf_id integer,
  customer_id integer,
  amount numeric,
  frequency character varying,
  start_date date,
  end_date date,
  status character varying,
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT sips_pkey PRIMARY KEY (sip_id),
  CONSTRAINT sips_mf_id_fkey FOREIGN KEY (mf_id) REFERENCES public.mutual_funds(mf_id),
  CONSTRAINT sips_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(customer_id)
);

-- SWPs Table (Systematic Withdrawal Plans)
CREATE TABLE public.swps (
  swp_id integer NOT NULL DEFAULT nextval('swps_swp_id_seq'::regclass),
  mf_id integer,
  customer_id integer,
  amount numeric,
  frequency character varying,
  start_date date,
  end_date date,
  status character varying,
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT swps_pkey PRIMARY KEY (swp_id),
  CONSTRAINT swps_mf_id_fkey FOREIGN KEY (mf_id) REFERENCES public.mutual_funds(mf_id),
  CONSTRAINT swps_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(customer_id)
);

-- Fixed Deposits Table
CREATE TABLE public.fixed_deposits (
  fd_id integer NOT NULL DEFAULT nextval('fixed_deposits_fd_id_seq'::regclass),
  customer_id integer,
  account_id integer,
  deposit_amount numeric,
  interest_rate numeric,
  tenure_months integer,
  start_date date,
  maturity_date date,
  maturity_amount numeric,
  status character varying,
  created_at timestamp without time zone DEFAULT now(),
  updated_at timestamp without time zone DEFAULT now(),
  CONSTRAINT fixed_deposits_pkey PRIMARY KEY (fd_id),
  CONSTRAINT fixed_deposits_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(customer_id),
  CONSTRAINT fixed_deposits_account_id_fkey FOREIGN KEY (account_id) REFERENCES public.bank_accounts(account_id)
);

-- Loans Table
CREATE TABLE public.loans (
  loan_id integer NOT NULL DEFAULT nextval('loans_loan_id_seq'::regclass),
  customer_id integer,
  account_id integer,
  loan_type character varying,
  principal numeric,
  interest_rate numeric,
  tenure_months integer,
  emi_amount numeric,
  outstanding_amount numeric,
  start_date date,
  end_date date,
  bank_name character varying,
  merchant_name character varying,
  status character varying,
  created_at timestamp without time zone DEFAULT now(),
  updated_at timestamp without time zone DEFAULT now(),
  CONSTRAINT loans_pkey PRIMARY KEY (loan_id),
  CONSTRAINT loans_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(customer_id),
  CONSTRAINT loans_account_id_fkey FOREIGN KEY (account_id) REFERENCES public.bank_accounts(account_id)
);

-- Additional Notes:
-- 1. This schema represents the banking system database with comprehensive financial data
-- 2. The customers table links to the main application via email/phone matching
-- 3. Supports full banking operations including accounts, transactions, cards
-- 4. Investment tracking through demat accounts, holdings, mutual funds
-- 5. SIP/SWP management for systematic investment/withdrawal plans
-- 6. Fixed deposits and loans management
-- 7. All tables use integer primary keys with sequences for better performance
-- 8. Comprehensive transaction tracking with balance_after for audit trails