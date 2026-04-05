-- =============================================
-- FOUNDRY DATABASE SCHEMA
-- Run this in Supabase → SQL Editor → New Query
-- =============================================

-- STARTUPS TABLE
create table startups (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  headline text,
  story text,
  category text,
  stage text,
  arr text,
  growth text,
  funding text,
  team_size text,
  investors text,
  founded_year text,
  founder_names text,
  status text default 'draft',
  color text default 'orange',
  views integer default 0,
  created_at timestamp with time zone default now()
);

-- FOUNDERS TABLE
create table founders (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  role text,
  company text,
  bio text,
  linkedin text,
  twitter text,
  tags text[],
  avatar_initials text,
  status text default 'draft',
  created_at timestamp with time zone default now()
);

-- JOBS TABLE
create table jobs (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  startup_name text,
  category text,
  salary text,
  type text default 'Full-time',
  location text default 'Remote',
  experience text,
  description text,
  apply_link text,
  status text default 'draft',
  created_at timestamp with time zone default now()
);

-- ENABLE ROW LEVEL SECURITY
alter table startups enable row level security;
alter table founders enable row level security;
alter table jobs enable row level security;

-- PUBLIC READ POLICY (anyone can read live entries)
create policy "Public can read live startups"
  on startups for select
  using (status = 'live');

create policy "Public can read live founders"
  on founders for select
  using (status = 'live');

create policy "Public can read live jobs"
  on jobs for select
  using (status = 'live');

-- ADMIN FULL ACCESS (authenticated users can do everything)
create policy "Authenticated users have full access to startups"
  on startups for all
  using (auth.role() = 'authenticated');

create policy "Authenticated users have full access to founders"
  on founders for all
  using (auth.role() = 'authenticated');

create policy "Authenticated users have full access to jobs"
  on jobs for all
  using (auth.role() = 'authenticated');

-- SAMPLE DATA (optional - remove if you want to start fresh)
insert into startups (name, headline, category, stage, arr, growth, founded_year, founder_names, status, color)
values
  ('Dukaan', 'Built Shopify for India in 48 hours', 'E-Commerce', 'Series B', '₹80Cr', '300% YoY', '2020', 'Suumit Shah', 'live', 'teal'),
  ('Zeta', 'From a Bangalore apartment to $40M ARR', 'Fintech', 'Series C', '$40M', '420% YoY', '2019', 'Bhavin Turakhia', 'live', 'orange'),
  ('Setu', 'Making banking programmable with APIs', 'Fintech', 'Series A', '$8M', '8x revenue', '2018', 'Sahil Kini', 'live', 'purple');

insert into jobs (title, startup_name, category, salary, type, location, experience, status)
values
  ('Frontend Engineer (React)', 'Dukaan', 'Engineering', '₹18–28 LPA', 'Full-time', 'Remote', '1–3 years', 'live'),
  ('Full Stack Dev (Next.js)', 'Setu', 'Engineering', '₹12–20 LPA', 'Full-time', 'Remote', 'Fresher ok', 'live'),
  ('Product Designer', 'Zeta', 'Design', '₹22–35 LPA', 'Full-time', 'Hybrid', '2+ years', 'live');
