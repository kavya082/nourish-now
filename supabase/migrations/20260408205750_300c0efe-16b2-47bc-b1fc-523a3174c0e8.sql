
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _role app_role;
BEGIN
  _role := COALESCE(
    NULLIF(NEW.raw_user_meta_data->>'role', '')::app_role,
    'buyer'
  );
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, _role);
  RETURN NEW;
END;
$$;
