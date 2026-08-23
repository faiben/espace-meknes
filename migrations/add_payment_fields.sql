-- Migration: Add payment fields
-- Run this in Supabase Dashboard > SQL Editor

-- Add bank columns to app_settings
ALTER TABLE app_settings ADD COLUMN IF NOT EXISTS bank_name text default '';
ALTER TABLE app_settings ADD COLUMN IF NOT EXISTS bank_account_holder text default '';
ALTER TABLE app_settings ADD COLUMN IF NOT EXISTS bank_iban text default '';
ALTER TABLE app_settings ADD COLUMN IF NOT EXISTS bank_rib text default '';

-- Add payment_method to businesses
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS payment_method text default '';

-- Add payment_method to ads
ALTER TABLE ads ADD COLUMN IF NOT EXISTS payment_method text default '';
