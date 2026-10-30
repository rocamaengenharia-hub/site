CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT,
  main_image TEXT,
  author_name TEXT DEFAULT 'Rocama Engenharia',
  category_id UUID REFERENCES services(id),
  published_at TIMESTAMPTZ DEFAULT NOW(),
  is_published BOOLEAN DEFAULT false,
  seo_title TEXT,
  seo_description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for SEO slugs
CREATE INDEX idx_posts_slug ON posts(slug);

-- Enable RLS
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public posts are viewable by everyone" ON posts
  FOR SELECT USING (is_published = true);

-- Admin full access
CREATE POLICY "Admins have full access to posts" ON posts
  FOR ALL TO authenticated USING (true);
