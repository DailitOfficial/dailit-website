-- Password Reset Setup for Admin Users
-- This SQL adds password reset tracking and security features

-- Create password_reset_tokens table to track reset attempts
CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_email TEXT NOT NULL,
  token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_address TEXT,
  user_agent TEXT
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_email ON password_reset_tokens(admin_email);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_token ON password_reset_tokens(token);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_expires ON password_reset_tokens(expires_at);

-- Enable RLS for password_reset_tokens
ALTER TABLE password_reset_tokens ENABLE ROW LEVEL SECURITY;

-- Create policy for password reset tokens (only allow reading own tokens)
CREATE POLICY "Users can only access their own reset tokens" ON password_reset_tokens
  FOR SELECT TO authenticated
  USING (admin_email = auth.email());

-- Add password reset tracking to admin_users table
ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS password_reset_count INTEGER DEFAULT 0;
ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS last_password_reset TIMESTAMP WITH TIME ZONE;
ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS password_reset_locked_until TIMESTAMP WITH TIME ZONE;

-- Function to clean up expired reset tokens (run this periodically)
CREATE OR REPLACE FUNCTION cleanup_expired_reset_tokens()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM password_reset_tokens 
  WHERE expires_at < NOW() - INTERVAL '1 day';
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Function to check if admin can request password reset (rate limiting)
CREATE OR REPLACE FUNCTION can_request_password_reset(user_email TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  admin_record RECORD;
  recent_requests INTEGER;
BEGIN
  -- Check if admin exists and is active
  SELECT * INTO admin_record 
  FROM admin_users 
  WHERE email = user_email AND is_active = true;
  
  IF NOT FOUND THEN
    RETURN FALSE;
  END IF;
  
  -- Check if account is temporarily locked
  IF admin_record.password_reset_locked_until IS NOT NULL 
     AND admin_record.password_reset_locked_until > NOW() THEN
    RETURN FALSE;
  END IF;
  
  -- Check rate limiting (max 3 requests per hour)
  SELECT COUNT(*) INTO recent_requests
  FROM password_reset_tokens
  WHERE admin_email = user_email 
    AND created_at > NOW() - INTERVAL '1 hour';
  
  IF recent_requests >= 3 THEN
    -- Lock account for 1 hour
    UPDATE admin_users 
    SET password_reset_locked_until = NOW() + INTERVAL '1 hour'
    WHERE email = user_email;
    
    RETURN FALSE;
  END IF;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Function to log password reset attempt
CREATE OR REPLACE FUNCTION log_password_reset_attempt(
  user_email TEXT,
  reset_token TEXT DEFAULT NULL,
  client_ip TEXT DEFAULT NULL,
  client_user_agent TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
BEGIN
  -- Only log if admin can request reset
  IF NOT can_request_password_reset(user_email) THEN
    RETURN FALSE;
  END IF;
  
  -- Insert reset token record
  INSERT INTO password_reset_tokens (
    admin_email, 
    token, 
    expires_at, 
    ip_address, 
    user_agent
  ) VALUES (
    user_email,
    COALESCE(reset_token, gen_random_uuid()::TEXT),
    NOW() + INTERVAL '1 hour',
    client_ip,
    client_user_agent
  );
  
  -- Update admin user reset count
  UPDATE admin_users 
  SET 
    password_reset_count = COALESCE(password_reset_count, 0) + 1,
    last_password_reset = NOW()
  WHERE email = user_email;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically clean up old tokens
CREATE OR REPLACE FUNCTION auto_cleanup_reset_tokens()
RETURNS TRIGGER AS $$
BEGIN
  -- Clean up expired tokens when new ones are created
  PERFORM cleanup_expired_reset_tokens();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_auto_cleanup_reset_tokens
  AFTER INSERT ON password_reset_tokens
  EXECUTE FUNCTION auto_cleanup_reset_tokens();

-- Grant necessary permissions
GRANT SELECT, INSERT ON password_reset_tokens TO authenticated;
GRANT EXECUTE ON FUNCTION can_request_password_reset(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION log_password_reset_attempt(TEXT, TEXT, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION cleanup_expired_reset_tokens() TO authenticated;

-- Insert some example data for testing (optional)
-- Uncomment these lines if you want to test the system

/*
-- Example: Test the rate limiting function
SELECT can_request_password_reset('admin@yourdomain.com');

-- Example: Log a password reset attempt
SELECT log_password_reset_attempt(
  'admin@yourdomain.com',
  'test-token-123',
  '127.0.0.1',
  'Mozilla/5.0 Test Browser'
);

-- Example: Check reset tokens for a user
SELECT * FROM password_reset_tokens WHERE admin_email = 'admin@yourdomain.com';

-- Example: Clean up expired tokens manually
SELECT cleanup_expired_reset_tokens();
*/

-- Security Notes:
-- 1. Rate limiting: Max 3 reset requests per hour per admin
-- 2. Token expiry: Reset tokens expire after 1 hour
-- 3. Account locking: Account locked for 1 hour after too many requests
-- 4. Automatic cleanup: Expired tokens are automatically removed
-- 5. Audit trail: All reset attempts are logged with IP and user agent

-- To run this setup:
-- 1. Copy this entire SQL
-- 2. Go to Supabase Dashboard → SQL Editor
-- 3. Paste and run the SQL
-- 4. Verify tables and functions were created successfully 