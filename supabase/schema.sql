-- âââââââââââââââââââââââââââââââââââââââââââââââ
-- PrioriTracker â Supabase Schema
-- Run this in Supabase SQL Editor (Dashboard â SQL)
-- âââââââââââââââââââââââââââââââââââââââââââââââ

-- 1. PROFILES (auto-created on first login)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  display_name TEXT NOT NULL,       -- e.g. "BGN", "Cristi", "Alexandra"
  initials TEXT NOT NULL DEFAULT '',
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. PRIORITIES
CREATE TABLE priorities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  modul TEXT NOT NULL DEFAULT 'Core â Conta',
  name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'AnalizÄ',  -- AnalizÄ, Implementare, Review, Done
  description TEXT DEFAULT '',
  -- Roles
  role_owner TEXT NOT NULL,
  role_design TEXT DEFAULT '',
  role_implementare TEXT DEFAULT '',
  role_review TEXT NOT NULL,
  -- Meta
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. TASKS
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  priority_id UUID NOT NULL REFERENCES priorities(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  owner TEXT NOT NULL,           -- display_name of assignee
  hours NUMERIC(4,1) DEFAULT 2,
  status TEXT NOT NULL DEFAULT 'todo',  -- todo, inlucru, done
  phase TEXT DEFAULT 'Planificare AnalizÄ',
  week TEXT,                     -- ISO date of Monday, e.g. "2026-04-13"
  description TEXT DEFAULT '',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. COMMENTS (polymorphic: can belong to priority OR task)
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  priority_id UUID REFERENCES priorities(id) ON DELETE CASCADE,
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  author TEXT NOT NULL,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  -- Must belong to exactly one parent
  CONSTRAINT comments_one_parent CHECK (
    (priority_id IS NOT NULL AND task_id IS NULL) OR
    (priority_id IS NULL AND task_id IS NOT NULL)
  )
);

-- 5. LINKS / ATTACHMENTS (polymorphic)
CREATE TABLE links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  priority_id UUID REFERENCES priorities(id) ON DELETE CASCADE,
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  label TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT links_one_parent CHECK (
    (priority_id IS NOT NULL AND task_id IS NULL) OR
    (priority_id IS NULL AND task_id IS NOT NULL)
  )
);

-- âââ INDEXES âââ
CREATE INDEX idx_tasks_priority ON tasks(priority_id);
CREATE INDEX idx_tasks_owner ON tasks(owner);
CREATE INDEX idx_tasks_week ON tasks(week);
CREATE INDEX idx_comments_priority ON comments(priority_id);
CREATE INDEX idx_comments_task ON comments(task_id);
CREATE INDEX idx_links_priority ON links(priority_id);
CREATE INDEX idx_links_task ON links(task_id);

-- âââ AUTO-UPDATE updated_at âââ
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER priorities_updated_at
  BEFORE UPDATE ON priorities
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tasks_updated_at
  BEFORE UPDATE ON tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- âââ AUTO-CREATE PROFILE ON FIRST LOGIN âââ
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  _email TEXT;
  _prefix TEXT;
  _name TEXT;
  _initials TEXT;
BEGIN
  _email := NEW.raw_user_meta_data->>'email';
  IF _email IS NULL THEN
    _email := NEW.email;
  END IF;

  -- Extract display name from Google profile or email
  _name := COALESCE(
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'name',
    initcap(split_part(_email, '@', 1))
  );

  _initials := upper(left(_name, 2));

  INSERT INTO profiles (id, email, display_name, initials, avatar_url)
  VALUES (
    NEW.id,
    _email,
    _name,
    _initials,
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    display_name = EXCLUDED.display_name,
    avatar_url = EXCLUDED.avatar_url;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
