create table if not exists organization_settings (
    id uuid primary key default gen_random_uuid(),
    company_name text not null default 'Rocama Engenharia',
    logo_url text,
    contact_email text,
    whatsapp text,
    instagram_url text,
    facebook_url text,
    linkedin_url text,
    address text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Ensure only one row exists (optional but good practice)
create unique index if not exists only_one_row on organization_settings ((true));

-- Enable RLS
alter table organization_settings enable row level security;

-- Policy for reading (public)
create policy "Public settings are viewable by everyone" on organization_settings
    for select using (true);

-- Policy for updating (authenticated users only)
create policy "Settings are updateable by authenticated users" on organization_settings
    for update using (auth.role() = 'authenticated');

-- Policy for insert (only if empty)
create policy "Settings are insertable by authenticated users" on organization_settings
    for insert with check (auth.role() = 'authenticated');
