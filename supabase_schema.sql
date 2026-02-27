-- Create a table for storing analysis results
create table if not exists public.analysis_results (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  -- Input Data
  job_description text,
  file_name text,
  
  -- Analysis Output (JSONB for flexibility)
  fit_score integer,
  matched_skills jsonb,
  missing_skills jsonb,
  unrelated_skills jsonb,
  suggestions jsonb
);

-- Set up Row Level Security (RLS)
alter table public.analysis_results enable row level security;

-- Policy: Users can only see their own results
create policy "Users can view their own analysis results"
  on public.analysis_results for select
  using (auth.uid() = user_id);

-- Policy: Users can insert their own results
create policy "Users can insert their own analysis results"
  on public.analysis_results for insert
  with check (auth.uid() = user_id);
