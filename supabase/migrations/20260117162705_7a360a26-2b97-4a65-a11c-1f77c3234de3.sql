-- Create role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'pharmacy_manager', 'store_manager');

-- Create alert type enum
CREATE TYPE public.alert_type AS ENUM ('low_stock', 'expiry_warning', 'overstock', 'stockout');

-- Create medicine category enum
CREATE TYPE public.medicine_category AS ENUM ('tablets', 'capsules', 'injections', 'syrups', 'ointments', 'drops', 'surgical', 'equipment', 'other');

-- User roles table (separate from profiles for security)
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL DEFAULT 'store_manager',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- User profiles table
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Medicines master table
CREATE TABLE public.medicines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    generic_name TEXT,
    category medicine_category NOT NULL DEFAULT 'other',
    manufacturer TEXT,
    unit TEXT NOT NULL DEFAULT 'units',
    reorder_level INTEGER NOT NULL DEFAULT 100,
    safety_stock INTEGER NOT NULL DEFAULT 50,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Inventory items table (batch-level tracking)
CREATE TABLE public.inventory_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    medicine_id UUID REFERENCES public.medicines(id) ON DELETE CASCADE NOT NULL,
    batch_number TEXT NOT NULL,
    supplier TEXT,
    quantity INTEGER NOT NULL DEFAULT 0,
    unit_price DECIMAL(10,2),
    expiry_date DATE NOT NULL,
    location TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Consumption history for forecasting
CREATE TABLE public.consumption_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    medicine_id UUID REFERENCES public.medicines(id) ON DELETE CASCADE NOT NULL,
    quantity_consumed INTEGER NOT NULL,
    consumption_date DATE NOT NULL DEFAULT CURRENT_DATE,
    recorded_by UUID REFERENCES auth.users(id),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Alerts table
CREATE TABLE public.alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    medicine_id UUID REFERENCES public.medicines(id) ON DELETE CASCADE NOT NULL,
    alert_type alert_type NOT NULL,
    severity TEXT NOT NULL DEFAULT 'medium',
    message TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT false,
    is_resolved BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    resolved_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS on all tables
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medicines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consumption_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(_user_id, 'admin')
$$;

-- Helper function to check if user is pharmacy manager
CREATE OR REPLACE FUNCTION public.is_pharmacy_manager(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(_user_id, 'pharmacy_manager')
$$;

-- Helper function to check if user is store manager
CREATE OR REPLACE FUNCTION public.is_store_manager(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(_user_id, 'store_manager')
$$;

-- Helper function to check if user has any valid role
CREATE OR REPLACE FUNCTION public.has_any_role(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
  )
$$;

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own roles" ON public.user_roles
    FOR SELECT USING (auth.uid() = user_id OR public.is_admin(auth.uid()));

CREATE POLICY "Only admins can insert roles" ON public.user_roles
    FOR INSERT WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Only admins can update roles" ON public.user_roles
    FOR UPDATE USING (public.is_admin(auth.uid()));

CREATE POLICY "Only admins can delete roles" ON public.user_roles
    FOR DELETE USING (public.is_admin(auth.uid()));

-- RLS Policies for profiles
CREATE POLICY "Profiles are viewable by authenticated users" ON public.profiles
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for medicines
CREATE POLICY "Medicines viewable by all staff" ON public.medicines
    FOR SELECT USING (public.has_any_role(auth.uid()));

CREATE POLICY "Admin and pharmacy manager can insert medicines" ON public.medicines
    FOR INSERT WITH CHECK (public.is_admin(auth.uid()) OR public.is_pharmacy_manager(auth.uid()));

CREATE POLICY "Admin and pharmacy manager can update medicines" ON public.medicines
    FOR UPDATE USING (public.is_admin(auth.uid()) OR public.is_pharmacy_manager(auth.uid()));

CREATE POLICY "Only admin can delete medicines" ON public.medicines
    FOR DELETE USING (public.is_admin(auth.uid()));

-- RLS Policies for inventory_items
CREATE POLICY "Inventory viewable by all staff" ON public.inventory_items
    FOR SELECT USING (public.has_any_role(auth.uid()));

CREATE POLICY "All staff can insert inventory items" ON public.inventory_items
    FOR INSERT WITH CHECK (public.has_any_role(auth.uid()));

CREATE POLICY "All staff can update inventory items" ON public.inventory_items
    FOR UPDATE USING (public.has_any_role(auth.uid()));

CREATE POLICY "Admin and pharmacy manager can delete inventory" ON public.inventory_items
    FOR DELETE USING (public.is_admin(auth.uid()) OR public.is_pharmacy_manager(auth.uid()));

-- RLS Policies for consumption_history
CREATE POLICY "Consumption history viewable by all staff" ON public.consumption_history
    FOR SELECT USING (public.has_any_role(auth.uid()));

CREATE POLICY "Admin and pharmacy manager can insert consumption" ON public.consumption_history
    FOR INSERT WITH CHECK (public.is_admin(auth.uid()) OR public.is_pharmacy_manager(auth.uid()));

CREATE POLICY "Only admin can update consumption history" ON public.consumption_history
    FOR UPDATE USING (public.is_admin(auth.uid()));

CREATE POLICY "Only admin can delete consumption history" ON public.consumption_history
    FOR DELETE USING (public.is_admin(auth.uid()));

-- RLS Policies for alerts
CREATE POLICY "Alerts viewable by all staff" ON public.alerts
    FOR SELECT USING (public.has_any_role(auth.uid()));

CREATE POLICY "Admin and pharmacy manager can insert alerts" ON public.alerts
    FOR INSERT WITH CHECK (public.is_admin(auth.uid()) OR public.is_pharmacy_manager(auth.uid()));

CREATE POLICY "All staff can update alerts (mark as read)" ON public.alerts
    FOR UPDATE USING (public.has_any_role(auth.uid()));

CREATE POLICY "Only admin can delete alerts" ON public.alerts
    FOR DELETE USING (public.is_admin(auth.uid()));

-- Create indexes for performance
CREATE INDEX idx_inventory_medicine ON public.inventory_items(medicine_id);
CREATE INDEX idx_inventory_expiry ON public.inventory_items(expiry_date);
CREATE INDEX idx_consumption_medicine ON public.consumption_history(medicine_id);
CREATE INDEX idx_consumption_date ON public.consumption_history(consumption_date);
CREATE INDEX idx_alerts_medicine ON public.alerts(medicine_id);
CREATE INDEX idx_alerts_unread ON public.alerts(is_read) WHERE is_read = false;
CREATE INDEX idx_user_roles_user ON public.user_roles(user_id);

-- Function to handle new user signup - creates profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_medicines_updated_at
  BEFORE UPDATE ON public.medicines
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_inventory_updated_at
  BEFORE UPDATE ON public.inventory_items
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();