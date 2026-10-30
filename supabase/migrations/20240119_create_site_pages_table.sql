-- Table to store page-specific content (cms style)
create table if not exists site_pages (
    id uuid primary key default gen_random_uuid(),
    slug text not null, -- e.g., 'home', 'services', 'about'
    section text not null default 'main', -- e.g., 'hero', 'features', or just 'main'
    content jsonb default '{}'::jsonb,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(slug, section)
);

-- Enable RLS
alter table site_pages enable row level security;

-- Policies
create policy "Public pages are viewable by everyone" on site_pages
    for select using (true);

create policy "Pages are updateable by authenticated users" on site_pages
    for update using (auth.role() = 'authenticated');

create policy "Pages are insertable by authenticated users" on site_pages
    for insert with check (auth.role() = 'authenticated');
