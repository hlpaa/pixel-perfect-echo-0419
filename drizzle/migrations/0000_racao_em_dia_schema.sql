
-- Roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');
CREATE TYPE public.species AS ENUM ('cachorro', 'gato');
CREATE TYPE public.plan_status AS ENUM ('ativo', 'pausado', 'cancelado');
CREATE TYPE public.order_status AS ENUM ('aguardando_confirmacao', 'confirmado', 'em_preparacao', 'saiu_para_entrega', 'entregue', 'cancelado');

-- Profiles
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  phone text,
  status text NOT NULL DEFAULT 'ativo',
  onboarding_completed boolean NOT NULL DEFAULT false,
  replenishment_frequency_days integer,
  reminder_days_before integer NOT NULL DEFAULT 7,
  replenishment_mode text NOT NULL DEFAULT 'manual',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.profiles TO authenticated;
GRANT UPDATE (full_name, phone, onboarding_completed, replenishment_frequency_days, reminder_days_before, replenishment_mode) ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL,
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "own roles read" ON public.user_roles FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "profiles own read" ON public.profiles FOR SELECT TO authenticated
  USING (id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "profiles own update" ON public.profiles FOR UPDATE TO authenticated
  USING (id = auth.uid()) WITH CHECK (id = auth.uid());

-- New user trigger: profile + role. First account becomes admin.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, phone)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', ''), COALESCE(NEW.email, ''), NEW.raw_user_meta_data->>'phone');
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user');
  IF NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin');
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Settings (single row)
CREATE TABLE public.app_settings (
  id integer PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  company_name text NOT NULL DEFAULT 'Ração em Dia',
  support_phone text,
  service_region text,
  default_reminder_days integer NOT NULL DEFAULT 7,
  contact_info text,
  operational_notes text,
  timezone text NOT NULL DEFAULT 'America/Recife',
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.app_settings TO authenticated, anon;
GRANT UPDATE ON public.app_settings TO authenticated;
GRANT ALL ON public.app_settings TO service_role;
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "settings read" ON public.app_settings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "settings admin update" ON public.app_settings FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
INSERT INTO public.app_settings (id) VALUES (1);

-- Pets
CREATE TABLE public.pets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  name text NOT NULL,
  species public.species NOT NULL,
  breed text,
  age_years numeric,
  weight_kg numeric,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX pets_user_idx ON public.pets(user_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.pets TO authenticated;
GRANT ALL ON public.pets TO service_role;
ALTER TABLE public.pets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "pets own" ON public.pets FOR ALL TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))
  WITH CHECK (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

-- Products
CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  brand text NOT NULL,
  species public.species,
  food_type text,
  package_weight_kg numeric NOT NULL CHECK (package_weight_kg > 0),
  price numeric CHECK (price >= 0),
  available boolean NOT NULL DEFAULT true,
  active boolean NOT NULL DEFAULT true,
  is_demo boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.products TO authenticated;
GRANT ALL ON public.products TO service_role;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "products read active" ON public.products FOR SELECT TO authenticated
  USING (active OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "products admin insert" ON public.products FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "products admin update" ON public.products FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "products admin delete" ON public.products FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

INSERT INTO public.products (name, brand, species, food_type, package_weight_kg, price, available, is_demo) VALUES
 ('Ração Adulto Frango (Demonstração)', 'Marca Exemplo', 'cachorro', 'Seca', 10, NULL, true, true),
 ('Ração Filhote Carne (Demonstração)', 'Marca Exemplo', 'cachorro', 'Seca', 3, NULL, true, true),
 ('Ração Gato Adulto Peixe (Demonstração)', 'Marca Exemplo', 'gato', 'Seca', 3, NULL, true, true),
 ('Ração Gato Castrado (Demonstração)', 'Marca Exemplo', 'gato', 'Seca', 1, NULL, true, true);

-- Pet foods
CREATE TABLE public.pet_foods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id uuid NOT NULL REFERENCES public.pets(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  product_id uuid REFERENCES public.products(id) ON DELETE SET NULL,
  food_name text NOT NULL,
  brand text,
  food_type text,
  package_weight_grams integer NOT NULL CHECK (package_weight_grams > 0),
  daily_consumption_grams integer CHECK (daily_consumption_grams > 0),
  package_opened_at date NOT NULL DEFAULT CURRENT_DATE,
  manual_end_date date,
  estimated_end_date date,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX pet_foods_pet_idx ON public.pet_foods(pet_id);
CREATE INDEX pet_foods_user_idx ON public.pet_foods(user_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.pet_foods TO authenticated;
GRANT ALL ON public.pet_foods TO service_role;
ALTER TABLE public.pet_foods ENABLE ROW LEVEL SECURITY;
CREATE POLICY "pet_foods own" ON public.pet_foods FOR ALL TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))
  WITH CHECK ((user_id = auth.uid() AND EXISTS (SELECT 1 FROM public.pets p WHERE p.id = pet_id AND p.user_id = auth.uid())) OR public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.compute_pet_food_end()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF NEW.manual_end_date IS NOT NULL THEN
    NEW.estimated_end_date := NEW.manual_end_date;
  ELSIF NEW.daily_consumption_grams IS NOT NULL AND NEW.daily_consumption_grams > 0 THEN
    NEW.estimated_end_date := NEW.package_opened_at + floor(NEW.package_weight_grams::numeric / NEW.daily_consumption_grams)::int;
  ELSE
    NEW.estimated_end_date := NULL;
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER pet_foods_compute BEFORE INSERT OR UPDATE ON public.pet_foods
  FOR EACH ROW EXECUTE FUNCTION public.compute_pet_food_end();

-- Addresses
CREATE TABLE public.addresses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  postal_code text NOT NULL,
  street text NOT NULL,
  number text NOT NULL,
  complement text,
  neighborhood text NOT NULL,
  city text NOT NULL,
  state text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX addresses_user_idx ON public.addresses(user_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.addresses TO authenticated;
GRANT ALL ON public.addresses TO service_role;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "addresses own" ON public.addresses FOR ALL TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))
  WITH CHECK (user_id = auth.uid());

-- Plans
CREATE TABLE public.replenishment_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  pet_id uuid NOT NULL REFERENCES public.pets(id) ON DELETE CASCADE,
  pet_food_id uuid REFERENCES public.pet_foods(id) ON DELETE SET NULL,
  product_id uuid REFERENCES public.products(id) ON DELETE SET NULL,
  quantity integer NOT NULL DEFAULT 1 CHECK (quantity > 0),
  frequency_days integer NOT NULL CHECK (frequency_days > 0),
  next_replenishment_date date NOT NULL,
  reminder_days_before integer NOT NULL DEFAULT 7,
  status public.plan_status NOT NULL DEFAULT 'ativo',
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX plans_user_idx ON public.replenishment_plans(user_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.replenishment_plans TO authenticated;
GRANT ALL ON public.replenishment_plans TO service_role;
ALTER TABLE public.replenishment_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "plans own" ON public.replenishment_plans FOR ALL TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))
  WITH CHECK ((user_id = auth.uid() AND EXISTS (SELECT 1 FROM public.pets p WHERE p.id = pet_id AND p.user_id = auth.uid())) OR public.has_role(auth.uid(), 'admin'));

-- Orders
CREATE SEQUENCE public.order_number_seq START 1001;
CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  pet_id uuid REFERENCES public.pets(id) ON DELETE SET NULL,
  address_id uuid REFERENCES public.addresses(id) ON DELETE SET NULL,
  plan_id uuid REFERENCES public.replenishment_plans(id) ON DELETE SET NULL,
  order_number integer NOT NULL UNIQUE DEFAULT nextval('public.order_number_seq'),
  total_amount numeric,
  status public.order_status NOT NULL DEFAULT 'aguardando_confirmacao',
  estimated_delivery_date date,
  internal_notes text,
  customer_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX orders_user_idx ON public.orders(user_id);
CREATE INDEX orders_status_idx ON public.orders(status);
GRANT SELECT, UPDATE ON public.orders TO authenticated;
GRANT ALL ON public.orders TO service_role;
GRANT USAGE ON SEQUENCE public.order_number_seq TO service_role;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "orders read" ON public.orders FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "orders admin update" ON public.orders FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES public.products(id) ON DELETE SET NULL,
  product_name text NOT NULL,
  quantity integer NOT NULL CHECK (quantity > 0),
  unit_price numeric,
  subtotal numeric
);
CREATE INDEX order_items_order_idx ON public.order_items(order_id);
GRANT SELECT, UPDATE ON public.order_items TO authenticated;
GRANT ALL ON public.order_items TO service_role;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "items read" ON public.order_items FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND (o.user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))));
CREATE POLICY "items admin update" ON public.order_items FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.order_status_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  status public.order_status NOT NULL,
  changed_by uuid,
  note text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX osh_order_idx ON public.order_status_history(order_id);
GRANT SELECT ON public.order_status_history TO authenticated;
GRANT ALL ON public.order_status_history TO service_role;
ALTER TABLE public.order_status_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "history read" ON public.order_status_history FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND (o.user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))));

-- Notifications
CREATE TABLE public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  link text,
  read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX notif_user_idx ON public.notifications(user_id, created_at DESC);
GRANT SELECT, UPDATE, DELETE ON public.notifications TO authenticated;
GRANT ALL ON public.notifications TO service_role;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "notif own read" ON public.notifications FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "notif own update" ON public.notifications FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "notif own delete" ON public.notifications FOR DELETE TO authenticated USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.order_status_label(s public.order_status)
RETURNS text LANGUAGE sql IMMUTABLE AS $$
  SELECT CASE s
    WHEN 'aguardando_confirmacao' THEN 'Aguardando confirmação'
    WHEN 'confirmado' THEN 'Confirmado'
    WHEN 'em_preparacao' THEN 'Em preparação'
    WHEN 'saiu_para_entrega' THEN 'Saiu para entrega'
    WHEN 'entregue' THEN 'Entregue'
    WHEN 'cancelado' THEN 'Cancelado' END
$$;

CREATE OR REPLACE FUNCTION public.on_order_change()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.order_status_history (order_id, status, changed_by) VALUES (NEW.id, NEW.status, auth.uid());
    INSERT INTO public.notifications (user_id, title, message, link)
      VALUES (NEW.user_id, 'Pedido #' || NEW.order_number || ' recebido', 'Seu pedido está aguardando confirmação da nossa equipe.', '/pedidos/' || NEW.id);
  ELSIF NEW.status IS DISTINCT FROM OLD.status THEN
    NEW.updated_at := now();
    INSERT INTO public.order_status_history (order_id, status, changed_by) VALUES (NEW.id, NEW.status, auth.uid());
    INSERT INTO public.notifications (user_id, title, message, link)
      VALUES (NEW.user_id, 'Pedido #' || NEW.order_number || ' atualizado', 'Novo status: ' || public.order_status_label(NEW.status) || '.', '/pedidos/' || NEW.id);
  ELSIF NEW.estimated_delivery_date IS DISTINCT FROM OLD.estimated_delivery_date AND NEW.estimated_delivery_date IS NOT NULL THEN
    NEW.updated_at := now();
    INSERT INTO public.notifications (user_id, title, message, link)
      VALUES (NEW.user_id, 'Pedido #' || NEW.order_number || ': previsão de entrega', 'Previsão de entrega: ' || to_char(NEW.estimated_delivery_date, 'DD/MM/YYYY') || '.', '/pedidos/' || NEW.id);
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER orders_after_insert AFTER INSERT ON public.orders FOR EACH ROW EXECUTE FUNCTION public.on_order_change();
CREATE TRIGGER orders_before_update BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.on_order_change();

-- Create order RPC (validates ownership, snapshots price)
CREATE OR REPLACE FUNCTION public.create_order(_pet_id uuid, _product_id uuid, _quantity integer, _address_id uuid, _plan_id uuid DEFAULT NULL, _notes text DEFAULT NULL)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  _uid uuid := auth.uid();
  _prod public.products;
  _order_id uuid;
  _total numeric;
BEGIN
  IF _uid IS NULL THEN RAISE EXCEPTION 'Não autenticado'; END IF;
  IF _quantity IS NULL OR _quantity < 1 THEN RAISE EXCEPTION 'Quantidade inválida'; END IF;
  IF NOT EXISTS (SELECT 1 FROM public.pets WHERE id = _pet_id AND user_id = _uid) THEN RAISE EXCEPTION 'Pet inválido'; END IF;
  IF NOT EXISTS (SELECT 1 FROM public.addresses WHERE id = _address_id AND user_id = _uid) THEN RAISE EXCEPTION 'Endereço inválido'; END IF;
  IF _plan_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.replenishment_plans WHERE id = _plan_id AND user_id = _uid) THEN RAISE EXCEPTION 'Plano inválido'; END IF;
  SELECT * INTO _prod FROM public.products WHERE id = _product_id AND active;
  IF NOT FOUND THEN RAISE EXCEPTION 'Produto indisponível'; END IF;
  _total := CASE WHEN _prod.price IS NULL THEN NULL ELSE _prod.price * _quantity END;
  INSERT INTO public.orders (user_id, pet_id, address_id, plan_id, total_amount, customer_notes)
    VALUES (_uid, _pet_id, _address_id, _plan_id, _total, _notes) RETURNING id INTO _order_id;
  INSERT INTO public.order_items (order_id, product_id, product_name, quantity, unit_price, subtotal)
    VALUES (_order_id, _prod.id, _prod.name || ' — ' || _prod.brand || ' (' || _prod.package_weight_kg || ' kg)', _quantity, _prod.price, _total);
  RETURN _order_id;
END $$;
REVOKE ALL ON FUNCTION public.create_order FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.create_order TO authenticated;
