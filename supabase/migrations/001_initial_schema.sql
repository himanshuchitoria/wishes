-- ==============================================================================
-- chitoria.dev Supabase Database Schema
-- Run this in your Supabase SQL Editor to initialize the database
-- ==============================================================================

-- 1. Create Custom Enum Types
CREATE TYPE wish_status AS ENUM ('draft', 'scheduled', 'delivered', 'failed', 'cancelled');
CREATE TYPE wish_vibe AS ENUM ('roast', 'sentimental', 'sweet', 'snarky', 'custom');

-- 2. Create Profiles Table (Public metadata linked to auth.users)
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    display_name TEXT,
    default_timezone TEXT DEFAULT 'UTC' NOT NULL,
    default_sender_alias TEXT DEFAULT 'cheers' NOT NULL,
    notify_on_delivery BOOLEAN DEFAULT true NOT NULL,
    notify_on_open BOOLEAN DEFAULT true NOT NULL,
    is_premium BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 3. Create Wishes Table
CREATE TABLE public.wishes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    recipient_name TEXT NOT NULL,
    recipient_email TEXT NOT NULL,
    recipient_phone TEXT,
    birth_date DATE NOT NULL,
    delivery_time TIME DEFAULT '00:00:00' NOT NULL,
    delivery_timezone TEXT DEFAULT 'UTC' NOT NULL,
    vibe wish_vibe DEFAULT 'sentimental' NOT NULL,
    is_anonymous BOOLEAN DEFAULT false NOT NULL,
    sender_alias TEXT,
    sender_email_prefix TEXT DEFAULT 'cheers' NOT NULL,
    message_payload JSONB DEFAULT '{}'::jsonb NOT NULL,
    status wish_status DEFAULT 'scheduled' NOT NULL,
    qstash_message_id TEXT,
    group_token UUID DEFAULT gen_random_uuid() UNIQUE NOT NULL,
    is_group_board BOOLEAN DEFAULT false NOT NULL,
    reveal_token UUID DEFAULT gen_random_uuid() UNIQUE NOT NULL,
    opened_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 4. Create Group Contributions Table
CREATE TABLE public.group_contributions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    wish_id UUID REFERENCES public.wishes(id) ON DELETE CASCADE NOT NULL,
    contributor_name TEXT NOT NULL,
    message TEXT NOT NULL,
    image_url TEXT,
    avatar_seed TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 5. Create Performance Indexes
CREATE INDEX idx_wishes_user_id ON public.wishes(user_id);
CREATE INDEX idx_wishes_reveal_token ON public.wishes(reveal_token);
CREATE INDEX idx_wishes_group_token ON public.wishes(group_token);
CREATE INDEX idx_wishes_status ON public.wishes(status);
CREATE INDEX idx_group_contributions_wish_id ON public.group_contributions(wish_id);

-- 6. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_contributions ENABLE ROW LEVEL SECURITY;

-- 7. RLS Policies
-- Profiles: Users can only read/update their own profile
CREATE POLICY "Users can view own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

-- Wishes: Users can manage their own wishes
CREATE POLICY "Users can view own wishes"
    ON public.wishes FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own wishes"
    ON public.wishes FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own wishes"
    ON public.wishes FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own wishes"
    ON public.wishes FOR DELETE
    USING (auth.uid() = user_id);

-- Public Token-based Access for Reveal & Group Board
CREATE POLICY "Public read wish via reveal token"
    ON public.wishes FOR SELECT
    USING (true);

-- Group Contributions: Anyone with group token can view and insert
CREATE POLICY "Public can view contributions"
    ON public.group_contributions FOR SELECT
    USING (true);

CREATE POLICY "Public can add contribution"
    ON public.group_contributions FOR INSERT
    WITH CHECK (true);

-- 8. Auto-create Profile Trigger on Supabase Auth Sign Up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', SPLIT_PART(NEW.email, '@', 1)));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
