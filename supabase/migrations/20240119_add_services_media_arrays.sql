-- Migration to add support for multiple images and videos in services table
alter table services 
add column if not exists images jsonb default '[]'::jsonb,
add column if not exists videos jsonb default '[]'::jsonb;
