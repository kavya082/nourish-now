
-- Role enum
CREATE TYPE public.app_role AS ENUM ('donor', 'buyer');

-- User roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'buyer',
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own role" ON public.user_roles
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- Auto-assign buyer role on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'buyer');
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Security definer function for role checks
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

-- Food items table
CREATE TABLE public.food_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  food TEXT NOT NULL,
  source TEXT NOT NULL CHECK (source IN ('hotel', 'event', 'function', 'party')),
  quantity TEXT NOT NULL,
  expires_in INTEGER NOT NULL,
  nearby_ngo TEXT NOT NULL,
  price NUMERIC NOT NULL DEFAULT 0,
  purchased BOOLEAN NOT NULL DEFAULT false,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL DEFAULT auth.uid(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.food_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone authenticated can view food items" ON public.food_items
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Donors can add food items" ON public.food_items
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'donor'));

CREATE POLICY "Buyers can purchase food items" ON public.food_items
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'buyer'))
  WITH CHECK (purchased = true);
