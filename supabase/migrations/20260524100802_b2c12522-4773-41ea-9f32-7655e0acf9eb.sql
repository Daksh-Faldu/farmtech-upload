
-- Roles enum + table
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "Users view own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins view all roles" ON public.user_roles FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Videos table
CREATE TABLE public.videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  mobile text NOT NULL,
  tractor_model text NOT NULL,
  location text NOT NULL,
  written_review text,
  video_url text NOT NULL,
  video_path text NOT NULL,
  file_size bigint,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view videos" ON public.videos FOR SELECT USING (true);
CREATE POLICY "Anyone can insert videos" ON public.videos FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can delete videos" ON public.videos FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update videos" ON public.videos FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE INDEX videos_created_at_idx ON public.videos (created_at DESC);

-- Storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'customer-videos',
  'customer-videos',
  true,
  5368709120,
  ARRAY['video/mp4','video/quicktime','video/x-msvideo','video/avi','video/webm']
);

CREATE POLICY "Public read videos" ON storage.objects FOR SELECT USING (bucket_id = 'customer-videos');
CREATE POLICY "Anyone can upload videos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'customer-videos');
CREATE POLICY "Admins can delete storage videos" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'customer-videos' AND public.has_role(auth.uid(), 'admin'));

-- Seed admin user
DO $$
DECLARE
  admin_uid uuid := gen_random_uuid();
BEGIN
  INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password,
    email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
    created_at, updated_at, confirmation_token, email_change,
    email_change_token_new, recovery_token
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    admin_uid,
    'authenticated',
    'authenticated',
    'admin@farmaking.com',
    crypt('Farmaking@2025', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{}',
    now(), now(), '', '', '', ''
  );

  INSERT INTO auth.identities (
    id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
  ) VALUES (
    gen_random_uuid(),
    admin_uid,
    jsonb_build_object('sub', admin_uid::text, 'email', 'admin@farmaking.com', 'email_verified', true),
    'email',
    admin_uid::text,
    now(), now(), now()
  );

  INSERT INTO public.user_roles (user_id, role) VALUES (admin_uid, 'admin');
END $$;
