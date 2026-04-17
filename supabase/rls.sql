-- âââââââââââââââââââââââââââââââââââââââââââââââ
-- PrioriTracker â Row Level Security
-- Run AFTER schema.sql
-- âââââââââââââââââââââââââââââââââââââââââââââââ

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE priorities ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE links ENABLE ROW LEVEL SECURITY;

-- âââ PROFILES âââ
-- Everyone in the org can see all profiles
CREATE POLICY "Profiles viewable by authenticated users"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (id = auth.uid());

-- âââ PRIORITIES âââ
-- All authenticated users can view all priorities (team tool)
CREATE POLICY "Priorities viewable by team"
  ON priorities FOR SELECT
  TO authenticated
  USING (true);

-- All authenticated users can create priorities
CREATE POLICY "Authenticated users can create priorities"
  ON priorities FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- All authenticated users can update priorities
CREATE POLICY "Authenticated users can update priorities"
  ON priorities FOR UPDATE
  TO authenticated
  USING (true);

-- All authenticated users can delete priorities
CREATE POLICY "Authenticated users can delete priorities"
  ON priorities FOR DELETE
  TO authenticated
  USING (true);

-- âââ TASKS âââ
CREATE POLICY "Tasks viewable by team"
  ON tasks FOR SELECT TO authenticated USING (true);

CREATE POLICY "Tasks insertable by team"
  ON tasks FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Tasks updatable by team"
  ON tasks FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Tasks deletable by team"
  ON tasks FOR DELETE TO authenticated USING (true);

-- âââ COMMENTS âââ
CREATE POLICY "Comments viewable by team"
  ON comments FOR SELECT TO authenticated USING (true);

CREATE POLICY "Comments insertable by team"
  ON comments FOR INSERT TO authenticated WITH CHECK (true);

-- âââ LINKS âââ
CREATE POLICY "Links viewable by team"
  ON links FOR SELECT TO authenticated USING (true);

CREATE POLICY "Links insertable by team"
  ON links FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Links deletable by team"
  ON links FOR DELETE TO authenticated USING (true);
