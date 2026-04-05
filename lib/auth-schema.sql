-- Run this in Supabase SQL Editor

-- SUBSCRIBERS TABLE (newsletter)
create table subscribers (
  id uuid default gen_random_uuid() primary key,
  email text not null unique,
  name text,
  source text default 'footer',
  created_at timestamp with time zone default now()
);

alter table subscribers enable row level security;

-- Anyone can subscribe (insert)
create policy "Anyone can subscribe"
  on subscribers for insert
  with check (true);

-- Only authenticated admin can read subscriber list
create policy "Admin can read subscribers"
  on subscribers for select
  using (auth.role() = 'authenticated');

-- USER PROFILES TABLE
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  full_name text,
  avatar_url text,
  bio text,
  role text default 'user',
  saved_startups uuid[] default '{}',
  created_at timestamp with time zone default now()
);

alter table profiles enable row level security;

-- Users can read their own profile
create policy "Users can read own profile"
  on profiles for select
  using (auth.uid() = id);

-- Users can update their own profile
create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
