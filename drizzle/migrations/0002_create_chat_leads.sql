CREATE TABLE public.chat_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text NOT NULL,
  consent boolean NOT NULL DEFAULT false,
  messages jsonb NOT NULL DEFAULT '[]'::jsonb,
  summary text,
  needs_human boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'new',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT, UPDATE, DELETE ON public.chat_leads TO authenticated;
GRANT ALL ON public.chat_leads TO service_role;

ALTER TABLE public.chat_leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage chat leads"
  ON public.chat_leads FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER chat_leads_touch BEFORE UPDATE ON public.chat_leads
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE INDEX chat_leads_created_at_idx ON public.chat_leads (created_at DESC);

INSERT INTO public.site_content (key, value) VALUES ('chat', '{}'::jsonb)
  ON CONFLICT (key) DO NOTHING;