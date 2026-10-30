-- Migration to add support for multiple images and videos in timeline events
alter table project_timeline_events 
add column if not exists images jsonb default '[]'::jsonb,
add column if not exists videos jsonb default '[]'::jsonb;
