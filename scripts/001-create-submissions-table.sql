-- Create submissions table to store user project submissions
CREATE TABLE IF NOT EXISTS submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  dapp_day INTEGER NOT NULL CHECK (dapp_day >= 1 AND dapp_day <= 31),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  demo_url TEXT,
  github_url TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, dapp_day)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_submissions_dapp_day ON submissions(dapp_day);
CREATE INDEX IF NOT EXISTS idx_submissions_user_id ON submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_submissions_created_at ON submissions(created_at DESC);

-- Enable Row Level Security
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view submissions
CREATE POLICY "Submissions are viewable by everyone"
  ON submissions FOR SELECT
  USING (true);

-- Policy: Users can insert their own submissions
CREATE POLICY "Users can insert their own submissions"
  ON submissions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own submissions
CREATE POLICY "Users can update their own submissions"
  ON submissions FOR UPDATE
  USING (auth.uid() = user_id);

-- Policy: Users can delete their own submissions
CREATE POLICY "Users can delete their own submissions"
  ON submissions FOR DELETE
  USING (auth.uid() = user_id);
