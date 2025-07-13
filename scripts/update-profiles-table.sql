-- Update the profiles table to ensure phone column is properly configured
ALTER TABLE profiles ALTER COLUMN phone TYPE TEXT;
ALTER TABLE profiles ALTER COLUMN phone DROP NOT NULL;

-- Update existing profiles to have phone numbers if they don't
-- (This is just for testing - in production you'd handle this differently)
UPDATE profiles SET phone = '+1-555-0000' WHERE phone IS NULL OR phone = '';

-- Verify the table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
ORDER BY ordinal_position;

-- Check current data
SELECT id, email, first_name, last_name, phone, account_balance, created_at 
FROM profiles 
ORDER BY created_at DESC 
LIMIT 5;
