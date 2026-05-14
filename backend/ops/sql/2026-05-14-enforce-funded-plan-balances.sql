-- Enforce allowed funded challenge account balances at the database level.
-- Allowed plans:
-- instant-10k => 10000
-- instant-25k => 25000
-- instant-50k => 50000

ALTER TABLE challenge_accounts
DROP CONSTRAINT IF EXISTS challenge_accounts_allowed_initial_balance_chk;

ALTER TABLE challenge_accounts
ADD CONSTRAINT challenge_accounts_allowed_initial_balance_chk
CHECK (initial_balance IN (10000, 25000, 50000));
