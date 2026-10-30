alter table projects add column if not exists gallery_project text[] default '{}';
alter table projects add column if not exists gallery_process text[] default '{}';
alter table projects add column if not exists show_gallery_project boolean default false;
alter table projects add column if not exists show_gallery_process boolean default false;
