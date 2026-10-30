-- ============================================================
-- ROCAMA ENGENHARIA - Setup completo de um banco Supabase novo
-- ============================================================
-- Rode este arquivo inteiro uma vez no SQL Editor do projeto.
-- Pode rodar de novo sem problema: tudo é "if not exists" ou
-- "drop ... if exists" antes de criar.
--
-- Regra de acesso: leitura pública só do que aparece no site;
-- escrita e dados de clientes só para quem está na tabela admins.
-- Um usuário logado que não seja admin NÃO tem acesso a nada,
-- mesmo que alguém consiga criar conta pela API.
-- ============================================================


-- ============================================================
-- 1. TABELAS
-- ============================================================

CREATE TABLE IF NOT EXISTS public.admins (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    description TEXT,
    short_description TEXT,
    seo_title TEXT,
    seo_description TEXT,
    images JSONB DEFAULT '[]'::JSONB,
    videos JSONB DEFAULT '[]'::JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_services_display_order ON public.services(display_order);

CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    service_id UUID REFERENCES public.services(id) ON DELETE SET NULL,
    main_image TEXT,
    gallery TEXT[] DEFAULT '{}',
    gallery_project TEXT[] DEFAULT '{}',
    gallery_process TEXT[] DEFAULT '{}',
    show_gallery_project BOOLEAN DEFAULT false,
    show_gallery_process BOOLEAN DEFAULT false,
    location TEXT,
    completion_date DATE,
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_projects_service_id ON public.projects(service_id);

CREATE TABLE IF NOT EXISTS public.project_timeline_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    video_url TEXT,
    images JSONB DEFAULT '[]'::JSONB,
    videos JSONB DEFAULT '[]'::JSONB,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_timeline_project_id ON public.project_timeline_events(project_id);

CREATE TABLE IF NOT EXISTS public.clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT UNIQUE,
    phone TEXT,
    company TEXT,
    client_type TEXT DEFAULT 'PF' CHECK (client_type IN ('PF', 'PJ')),
    document TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.budgets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
    service_interest TEXT,
    message TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'viewed', 'negotiating', 'accepted', 'rejected')),
    estimated_value NUMERIC(12,2),
    attachments TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_budgets_client_id ON public.budgets(client_id);
CREATE INDEX IF NOT EXISTS idx_budgets_status ON public.budgets(status);

CREATE TABLE IF NOT EXISTS public.posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT,
    main_image TEXT,
    author_name TEXT DEFAULT 'Rocama Engenharia',
    category_id UUID REFERENCES public.services(id) ON DELETE SET NULL,
    published_at TIMESTAMPTZ DEFAULT NOW(),
    is_published BOOLEAN DEFAULT false,
    seo_title TEXT,
    seo_description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_posts_published ON public.posts(is_published, published_at);
CREATE INDEX IF NOT EXISTS idx_posts_category_id ON public.posts(category_id);

CREATE TABLE IF NOT EXISTS public.organization_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_name TEXT NOT NULL DEFAULT 'Rocama Engenharia',
    logo_url TEXT,
    contact_email TEXT,
    whatsapp TEXT,
    instagram_url TEXT,
    facebook_url TEXT,
    linkedin_url TEXT,
    address TEXT,
    navbar_bg_color TEXT,
    navbar_text_color TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
-- Garante uma linha só de configurações
CREATE UNIQUE INDEX IF NOT EXISTS only_one_row ON public.organization_settings ((true));

CREATE TABLE IF NOT EXISTS public.site_pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT NOT NULL,
    section TEXT NOT NULL DEFAULT 'main',
    content JSONB DEFAULT '{}'::JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE (slug, section)
);


-- ============================================================
-- 2. QUEM É ADMIN
-- ============================================================
-- security definer: lê admins sem depender da RLS da própria tabela.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.admins WHERE user_id = (SELECT auth.uid())
    );
$$;

REVOKE EXECUTE ON FUNCTION public.is_admin() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;


-- ============================================================
-- 3. RLS
-- ============================================================
ALTER TABLE public.admins                  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services                ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects                ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_timeline_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budgets                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts                   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_settings   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_pages              ENABLE ROW LEVEL SECURITY;

-- admins: cada um só enxerga a própria linha (o app usa isso para saber se é admin).
-- Não há policy de escrita: novos admins só entram via SQL Editor.
DROP POLICY IF EXISTS "admins_select_self" ON public.admins;
CREATE POLICY "admins_select_self" ON public.admins
    FOR SELECT TO authenticated
    USING (user_id = (SELECT auth.uid()));

-- Conteúdo público do site (leitura para todos, escrita só admin)
DO $$
DECLARE
    t TEXT;
BEGIN
    FOREACH t IN ARRAY ARRAY['services', 'projects', 'project_timeline_events', 'organization_settings', 'site_pages']
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS "public_read" ON public.%I', t);
        EXECUTE format('CREATE POLICY "public_read" ON public.%I FOR SELECT TO anon, authenticated USING (true)', t);

        EXECUTE format('DROP POLICY IF EXISTS "admin_insert" ON public.%I', t);
        EXECUTE format('CREATE POLICY "admin_insert" ON public.%I FOR INSERT TO authenticated WITH CHECK ((SELECT public.is_admin()))', t);

        EXECUTE format('DROP POLICY IF EXISTS "admin_update" ON public.%I', t);
        EXECUTE format('CREATE POLICY "admin_update" ON public.%I FOR UPDATE TO authenticated USING ((SELECT public.is_admin())) WITH CHECK ((SELECT public.is_admin()))', t);

        EXECUTE format('DROP POLICY IF EXISTS "admin_delete" ON public.%I', t);
        EXECUTE format('CREATE POLICY "admin_delete" ON public.%I FOR DELETE TO authenticated USING ((SELECT public.is_admin()))', t);
    END LOOP;
END $$;

-- Posts: público vê só publicados; admin vê todos
DROP POLICY IF EXISTS "posts_read" ON public.posts;
CREATE POLICY "posts_read" ON public.posts
    FOR SELECT TO anon, authenticated
    USING (is_published = true OR (SELECT public.is_admin()));

DROP POLICY IF EXISTS "admin_insert" ON public.posts;
CREATE POLICY "admin_insert" ON public.posts
    FOR INSERT TO authenticated WITH CHECK ((SELECT public.is_admin()));

DROP POLICY IF EXISTS "admin_update" ON public.posts;
CREATE POLICY "admin_update" ON public.posts
    FOR UPDATE TO authenticated USING ((SELECT public.is_admin())) WITH CHECK ((SELECT public.is_admin()));

DROP POLICY IF EXISTS "admin_delete" ON public.posts;
CREATE POLICY "admin_delete" ON public.posts
    FOR DELETE TO authenticated USING ((SELECT public.is_admin()));

-- Clientes e orçamentos: dados pessoais, só admin.
-- O formulário público NÃO escreve direto nessas tabelas; usa a função
-- submit_budget_request (seção 4), que só insere e nunca devolve dados.
DO $$
DECLARE
    t TEXT;
BEGIN
    FOREACH t IN ARRAY ARRAY['clients', 'budgets']
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS "admin_all" ON public.%I', t);
        EXECUTE format('CREATE POLICY "admin_all" ON public.%I FOR ALL TO authenticated USING ((SELECT public.is_admin())) WITH CHECK ((SELECT public.is_admin()))', t);
    END LOOP;
END $$;


-- ============================================================
-- 4. FORMULÁRIO DE ORÇAMENTO (público)
-- ============================================================
-- Se o e-mail já existe, NÃO sobrescreve os dados do cliente (senão
-- qualquer pessoa trocaria o nome/telefone de um cliente sabendo o e-mail);
-- só preenche campos que estavam vazios.
CREATE OR REPLACE FUNCTION public.submit_budget_request(
    p_name TEXT,
    p_email TEXT,
    -- campos opcionais do formulário: se vierem vazios o JSON nem manda a chave
    p_phone TEXT DEFAULT NULL,
    p_company TEXT DEFAULT NULL,
    p_client_type TEXT DEFAULT NULL,
    p_document TEXT DEFAULT NULL,
    p_service_interest TEXT DEFAULT NULL,
    p_message TEXT DEFAULT NULL,
    p_attachments TEXT[] DEFAULT '{}'
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_client_id UUID;
    v_email TEXT := lower(trim(p_email));
BEGIN
    IF coalesce(trim(p_name), '') = '' OR v_email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' THEN
        RAISE EXCEPTION 'Nome e e-mail válido são obrigatórios';
    END IF;

    IF length(p_name) > 200 OR length(v_email) > 320
       OR length(coalesce(p_phone, '')) > 50 OR length(coalesce(p_company, '')) > 200
       OR length(coalesce(p_document, '')) > 50 OR length(coalesce(p_service_interest, '')) > 500
       OR length(coalesce(p_message, '')) > 5000
       OR coalesce(array_length(p_attachments, 1), 0) > 10 THEN
        RAISE EXCEPTION 'Dados do formulário excedem o tamanho permitido';
    END IF;

    INSERT INTO public.clients AS c (name, email, phone, company, client_type, document)
    VALUES (
        trim(p_name),
        v_email,
        nullif(trim(p_phone), ''),
        nullif(trim(p_company), ''),
        CASE WHEN p_client_type = 'PJ' THEN 'PJ' ELSE 'PF' END,
        nullif(trim(p_document), '')
    )
    ON CONFLICT (email) DO UPDATE SET
        phone      = coalesce(c.phone, EXCLUDED.phone),
        company    = coalesce(c.company, EXCLUDED.company),
        document   = coalesce(c.document, EXCLUDED.document),
        updated_at = now()
    RETURNING id INTO v_client_id;

    INSERT INTO public.budgets (client_id, service_interest, message, status, attachments)
    VALUES (v_client_id, p_service_interest, p_message, 'pending', coalesce(p_attachments, '{}'));
END;
$$;

REVOKE EXECUTE ON FUNCTION public.submit_budget_request(TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT[]) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.submit_budget_request(TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT[]) TO anon, authenticated;


-- ============================================================
-- 5. STORAGE (imagens e anexos)
-- ============================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('services', 'services', true),
       ('projects', 'projects', true),
       ('blog', 'blog', true)
ON CONFLICT (id) DO NOTHING;

-- Bucket público já serve os arquivos pela URL pública; não criamos
-- policy de SELECT para anon, assim ninguém consegue listar os arquivos.
DROP POLICY IF EXISTS "rocama_admin_select" ON storage.objects;
CREATE POLICY "rocama_admin_select" ON storage.objects
    FOR SELECT TO authenticated
    USING (bucket_id IN ('services', 'projects', 'blog') AND (SELECT public.is_admin()));

DROP POLICY IF EXISTS "rocama_admin_insert" ON storage.objects;
CREATE POLICY "rocama_admin_insert" ON storage.objects
    FOR INSERT TO authenticated
    WITH CHECK (bucket_id IN ('services', 'projects', 'blog') AND (SELECT public.is_admin()));

DROP POLICY IF EXISTS "rocama_admin_update" ON storage.objects;
CREATE POLICY "rocama_admin_update" ON storage.objects
    FOR UPDATE TO authenticated
    USING (bucket_id IN ('services', 'projects', 'blog') AND (SELECT public.is_admin()));

DROP POLICY IF EXISTS "rocama_admin_delete" ON storage.objects;
CREATE POLICY "rocama_admin_delete" ON storage.objects
    FOR DELETE TO authenticated
    USING (bucket_id IN ('services', 'projects', 'blog') AND (SELECT public.is_admin()));

-- Anexos do formulário de orçamento: qualquer visitante pode enviar,
-- mas só para projects/budgets/.
DROP POLICY IF EXISTS "rocama_public_budget_upload" ON storage.objects;
CREATE POLICY "rocama_public_budget_upload" ON storage.objects
    FOR INSERT TO anon, authenticated
    WITH CHECK (bucket_id = 'projects' AND (storage.foldername(name))[1] = 'budgets');


-- ============================================================
-- 6. KEEP-ALIVE (evita o Supabase Free pausar o projeto)
-- ============================================================
-- O cron da Vercel (api/keep-alive.ts) chama esta função 1x por dia.
-- Ela grava um evento e apaga logo em seguida: gera atividade real
-- no banco sem acumular nada.
CREATE TABLE IF NOT EXISTS public.keep_alive (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
-- RLS ligada e sem policies: ninguém mexe na tabela pela API, só a função.
ALTER TABLE public.keep_alive ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.keep_alive()
RETURNS TIMESTAMPTZ
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_id BIGINT;
    v_at TIMESTAMPTZ;
BEGIN
    INSERT INTO public.keep_alive DEFAULT VALUES RETURNING id, created_at INTO v_id, v_at;
    -- apaga o evento e qualquer sobra de execuções anteriores
    DELETE FROM public.keep_alive WHERE id <= v_id;
    RETURN v_at;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.keep_alive() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.keep_alive() TO anon, authenticated;


-- ============================================================
-- 7. PRIMEIRO ADMIN
-- ============================================================
-- 1) Crie o usuário em Authentication → Users → Add user → Create new user
--    (marque "Auto Confirm User").
-- 2) Troque o e-mail abaixo, tire o comentário e rode:
--
-- INSERT INTO public.admins (user_id)
-- SELECT id FROM auth.users WHERE email = 'seu-email@rocamaengenharia.com.br'
-- ON CONFLICT DO NOTHING;
