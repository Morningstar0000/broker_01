-- Add avatar_url column to profiles table
ALTER TABLE profiles
ADD COLUMN avatar_url TEXT;

-- Optional: Set a default avatar URL if you have one
-- ALTER TABLE profiles
-- ALTER COLUMN avatar_url SET DEFAULT 'https://your-domain.com/default-avatar.png';

-- Verify the table structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'profiles'
ORDER BY ordinal_position;
