CREATE TABLE public.leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  name text NOT NULL CHECK (char_length(name) BETWEEN 2 AND 120),
  whatsapp text NOT NULL CHECK (char_length(whatsapp) BETWEEN 8 AND 20),
  neighborhood text CHECK (char_length(neighborhood) <= 120),
  pet_name text NOT NULL CHECK (char_length(pet_name) BETWEEN 1 AND 60),
  species public.species NOT NULL,
  pet_weight_kg numeric CHECK (pet_weight_kg > 0 AND pet_weight_kg < 150),
  food_brand text CHECK (char_length(food_brand) <= 120),
  package_kg numeric NOT NULL CHECK (package_kg > 0 AND package_kg <= 50),
  daily_grams integer NOT NULL CHECK (daily_grams > 0 AND daily_grams <= 3000),
  notes text CHECK (char_length(notes) <= 1000),
  status text NOT NULL DEFAULT 'novo' CHECK (status IN ('novo','em_conversa','cliente','perdido')),
  internal_notes text
);
GRANT INSERT ON public.leads TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.leads TO authenticated;
GRANT ALL ON public.leads TO service_role;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "leads public create" ON public.leads FOR INSERT TO anon, authenticated WITH CHECK (status = 'novo' AND internal_notes IS NULL);
CREATE POLICY "leads admin read" ON public.leads FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "leads admin update" ON public.leads FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "leads admin delete" ON public.leads FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.deliveries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  lead_id uuid NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  delivery_date date NOT NULL,
  package_kg numeric NOT NULL CHECK (package_kg > 0),
  amount numeric,
  status text NOT NULL DEFAULT 'agendada' CHECK (status IN ('agendada','entregue','cancelada')),
  notes text
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.deliveries TO authenticated;
GRANT ALL ON public.deliveries TO service_role;
ALTER TABLE public.deliveries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "deliveries admin all" ON public.deliveries FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.reminders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  lead_id uuid NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  remind_on date NOT NULL,
  note text,
  done boolean NOT NULL DEFAULT false
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.reminders TO authenticated;
GRANT ALL ON public.reminders TO service_role;
ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "reminders admin all" ON public.reminders FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));