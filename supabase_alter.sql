-- ALTER TABLE script for adding new HR features to the existing analysis_results table

ALTER TABLE public.analysis_results 
ADD COLUMN IF NOT EXISTS candidate_summary text,
ADD COLUMN IF NOT EXISTS key_achievements jsonb,
ADD COLUMN IF NOT EXISTS culture_fit text,
ADD COLUMN IF NOT EXISTS probing_areas jsonb,
ADD COLUMN IF NOT EXISTS seniority_assessment text,
ADD COLUMN IF NOT EXISTS red_flags jsonb,
ADD COLUMN IF NOT EXISTS interview_questions jsonb;

