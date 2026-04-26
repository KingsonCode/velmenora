CREATE TABLE IF NOT EXISTS broker_accounts (
  id TEXT PRIMARY KEY,
  challenge_account_id TEXT NOT NULL,
  broker_name TEXT NOT NULL,
  account_type TEXT NOT NULL,
  platform_type TEXT NOT NULL,
  account_login TEXT NOT NULL,
  server_name TEXT NOT NULL,
  investor_password_enc TEXT NOT NULL,
  verification_status TEXT NOT NULL DEFAULT 'pending',
  verification_notes TEXT,
  verified_at TIMESTAMP(3),
  created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT broker_accounts_challenge_account_id_fkey
    FOREIGN KEY (challenge_account_id)
    REFERENCES challenge_accounts(id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS broker_accounts_challenge_account_id_idx
ON broker_accounts(challenge_account_id);
