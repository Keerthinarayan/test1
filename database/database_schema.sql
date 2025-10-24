-- Finatics.AI Application Database Schema
-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

-- AI Insights Table
CREATE TABLE public.aiinsights (
  insight_id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  req_id uuid,
  category text,
  message text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT aiinsights_pkey PRIMARY KEY (insight_id),
  CONSTRAINT aiinsights_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id),
  CONSTRAINT aiinsights_req_id_fkey FOREIGN KEY (req_id) REFERENCES public.airequests(req_id)
);

-- AI Requests Table
CREATE TABLE public.airequests (
  req_id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  request_type text,
  prompt text,
  response json,
  model text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT airequests_pkey PRIMARY KEY (req_id),
  CONSTRAINT airequests_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id)
);

-- Alerts Table
CREATE TABLE public.alerts (
  alert_id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  alert_type text,
  channel text,
  message text,
  due_date timestamp with time zone,
  is_sent boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT alerts_pkey PRIMARY KEY (alert_id),
  CONSTRAINT alerts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id)
);

-- Authentication Users Table (Supabase Auth)
CREATE TABLE public.auth_users (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  email character varying NOT NULL UNIQUE,
  first_name character varying NOT NULL,
  last_name character varying NOT NULL,
  email_verified boolean DEFAULT false,
  profile_completed boolean DEFAULT false,
  pin_created boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT auth_users_pkey PRIMARY KEY (id)
);

-- Finance Teacher Categories Table
CREATE TABLE public.financeteachercategories (
  category_id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  CONSTRAINT financeteachercategories_pkey PRIMARY KEY (category_id)
);

-- Finance Teacher Videos Table
CREATE TABLE public.financeteachervideos (
  video_id uuid NOT NULL DEFAULT gen_random_uuid(),
  category_id uuid NOT NULL,
  title text NOT NULL,
  description text,
  media_url text,
  duration text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT financeteachervideos_pkey PRIMARY KEY (video_id),
  CONSTRAINT financeteachervideos_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.financeteachercategories(category_id)
);

-- Financial Goals Table
CREATE TABLE public.financialgoals (
  goal_id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title text NOT NULL,
  description text,
  target_amount numeric,
  current_saved numeric DEFAULT 0,
  target_date date,
  status text DEFAULT 'pending'::text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT financialgoals_pkey PRIMARY KEY (goal_id),
  CONSTRAINT financialgoals_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id)
);

-- Linked Bank Accounts Table
CREATE TABLE public.linkedbankaccounts (
  link_id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  bank_name character varying,
  account_number character varying NOT NULL,
  ifsc_code character varying,
  account_type character varying,
  account_holder_name character varying,
  is_primary boolean DEFAULT false,
  balance numeric DEFAULT 0,
  status character varying DEFAULT 'active',
  linked_at timestamp with time zone DEFAULT now(),
  last_sync timestamp with time zone,
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT linkedbankaccounts_pkey PRIMARY KEY (link_id),
  CONSTRAINT linkedbankaccounts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id)
);

-- Subscriptions Table
CREATE TABLE public.subscriptions (
  sub_id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  type text,
  provider text,
  amount numeric,
  frequency text,
  next_due_date date,
  category text,
  status text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT subscriptions_pkey PRIMARY KEY (sub_id),
  CONSTRAINT subscriptions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id)
);

-- User PINs Table
CREATE TABLE public.user_pins (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE,
  pin_hash character varying NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT user_pins_pkey PRIMARY KEY (id),
  CONSTRAINT user_pins_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.auth_users(id)
);

-- User Profiles Table
CREATE TABLE public.user_profiles (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE,
  phone character varying,
  date_of_birth date,
  occupation character varying,
  monthly_income numeric,
  financial_goals ARRAY,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  secret_pin text,
  pin_created_at timestamp with time zone DEFAULT now(),
  full_name text,
  CONSTRAINT user_profiles_pkey PRIMARY KEY (id),
  CONSTRAINT user_profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);

-- Users Table
CREATE TABLE public.users (
  user_id uuid NOT NULL,
  full_name text,
  phone text,
  pin_hash text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT users_pkey PRIMARY KEY (user_id),
  CONSTRAINT users_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);

-- Additional Notes:
-- 1. This schema includes tables for AI insights, requests, alerts, financial goals, and educational content
-- 2. The linkedbankaccounts table is the main table for storing bank account information
-- 3. User authentication is handled through Supabase auth with additional profile information
-- 4. The schema supports financial goal tracking, subscription management, and AI-powered insights
-- 5. All tables use UUID primary keys for better security and scalability