-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- MODULE A: BLOG YOUINC
-- ============================================

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Posts table
CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT NOT NULL,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Comments table
CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Comment likes table
CREATE TABLE IF NOT EXISTS comment_likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  comment_id UUID NOT NULL REFERENCES comments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(comment_id, user_id)
);

-- Newsletter subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL UNIQUE,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  subscribed_at TIMESTAMPTZ DEFAULT NOW(),
  active BOOLEAN DEFAULT TRUE
);

-- ============================================
-- MODULE B: MUSLIMDAY LIFE SYSTEM
-- ============================================

-- Missions table
CREATE TABLE IF NOT EXISTS missions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  success_vision TEXT,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Objectives table
CREATE TABLE IF NOT EXISTS objectives (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mission_id UUID NOT NULL REFERENCES missions(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  term_type TEXT NOT NULL CHECK (term_type IN ('court', 'moyen', 'long')),
  deadline TIMESTAMPTZ,
  success_criteria JSONB,
  active BOOLEAN DEFAULT FALSE,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Key Results table
CREATE TABLE IF NOT EXISTS key_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  objective_id UUID NOT NULL REFERENCES objectives(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  target_value NUMERIC NOT NULL,
  current_value NUMERIC DEFAULT 0,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  kr_type TEXT NOT NULL CHECK (kr_type IN ('completion_rate', 'streak')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Actions table
CREATE TABLE IF NOT EXISTS actions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  objective_id UUID REFERENCES objectives(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  date DATE,
  start_time TIME,
  duration INTEGER, -- in minutes
  recurrence TEXT DEFAULT 'none' CHECK (recurrence IN ('none', 'daily', 'weekly', 'monthly', 'yearly')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Action-KeyResult junction table (many-to-many)
CREATE TABLE IF NOT EXISTS action_key_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  action_id UUID NOT NULL REFERENCES actions(id) ON DELETE CASCADE,
  key_result_id UUID NOT NULL REFERENCES key_results(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(action_id, key_result_id)
);

-- Occurrences table (for recurring actions)
CREATE TABLE IF NOT EXISTS occurrences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  action_id UUID NOT NULL REFERENCES actions(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(action_id, date)
);

-- ============================================
-- INDEXES
-- ============================================

-- Blog indexes
CREATE INDEX IF NOT EXISTS idx_posts_author_id ON posts(author_id);
CREATE INDEX IF NOT EXISTS idx_posts_published_at ON posts(published_at) WHERE published_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_author_id ON comments(author_id);
CREATE INDEX IF NOT EXISTS idx_comment_likes_comment_id ON comment_likes(comment_id);
CREATE INDEX IF NOT EXISTS idx_comment_likes_user_id ON comment_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_email ON subscriptions(email);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);

-- Life System indexes
CREATE INDEX IF NOT EXISTS idx_missions_user_id ON missions(user_id);
CREATE INDEX IF NOT EXISTS idx_missions_active ON missions(active);
CREATE INDEX IF NOT EXISTS idx_objectives_mission_id ON objectives(mission_id);
CREATE INDEX IF NOT EXISTS idx_objectives_active ON objectives(active);
CREATE INDEX IF NOT EXISTS idx_objectives_completed ON objectives(completed);
CREATE INDEX IF NOT EXISTS idx_key_results_objective_id ON key_results(objective_id);
CREATE INDEX IF NOT EXISTS idx_actions_user_id ON actions(user_id);
CREATE INDEX IF NOT EXISTS idx_actions_objective_id ON actions(objective_id);
CREATE INDEX IF NOT EXISTS idx_actions_date ON actions(date);
CREATE INDEX IF NOT EXISTS idx_action_key_results_action_id ON action_key_results(action_id);
CREATE INDEX IF NOT EXISTS idx_action_key_results_key_result_id ON action_key_results(key_result_id);
CREATE INDEX IF NOT EXISTS idx_occurrences_action_id ON occurrences(action_id);
CREATE INDEX IF NOT EXISTS idx_occurrences_date ON occurrences(date);
CREATE INDEX IF NOT EXISTS idx_occurrences_status ON occurrences(status);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE comment_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE objectives ENABLE ROW LEVEL SECURITY;
ALTER TABLE key_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE action_key_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE occurrences ENABLE ROW LEVEL SECURITY;

-- Profiles RLS
CREATE POLICY "Users can view all profiles"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Posts RLS
CREATE POLICY "Anyone can view published posts"
  ON posts FOR SELECT
  USING (published_at IS NOT NULL);

CREATE POLICY "Authors can view own posts"
  ON posts FOR SELECT
  USING (auth.uid() = author_id);

CREATE POLICY "Authors can create posts"
  ON posts FOR INSERT
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors can update own posts"
  ON posts FOR UPDATE
  USING (auth.uid() = author_id);

CREATE POLICY "Authors can delete own posts"
  ON posts FOR DELETE
  USING (auth.uid() = author_id);

-- Comments RLS
CREATE POLICY "Anyone can view comments on published posts"
  ON comments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM posts
      WHERE posts.id = comments.post_id
      AND posts.published_at IS NOT NULL
    )
  );

CREATE POLICY "Authors can view own comments"
  ON comments FOR SELECT
  USING (auth.uid() = author_id);

CREATE POLICY "Authenticated users can create comments"
  ON comments FOR INSERT
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can delete own comments"
  ON comments FOR DELETE
  USING (auth.uid() = author_id);

-- Comment Likes RLS
CREATE POLICY "Anyone can view comment likes"
  ON comment_likes FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can like comments"
  ON comment_likes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike own likes"
  ON comment_likes FOR DELETE
  USING (auth.uid() = user_id);

-- Subscriptions RLS
CREATE POLICY "Anyone can subscribe"
  ON subscriptions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can view own subscriptions"
  ON subscriptions FOR SELECT
  USING (auth.uid() = user_id OR email = (SELECT email FROM auth.users WHERE id = auth.uid()));

-- Missions RLS
CREATE POLICY "Users can view own missions"
  ON missions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own missions"
  ON missions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own missions"
  ON missions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own missions"
  ON missions FOR DELETE
  USING (auth.uid() = user_id);

-- Objectives RLS
CREATE POLICY "Users can view objectives from own missions"
  ON objectives FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM missions
      WHERE missions.id = objectives.mission_id
      AND missions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create objectives in own missions"
  ON objectives FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM missions
      WHERE missions.id = objectives.mission_id
      AND missions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update objectives in own missions"
  ON objectives FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM missions
      WHERE missions.id = objectives.mission_id
      AND missions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete objectives in own missions"
  ON objectives FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM missions
      WHERE missions.id = objectives.mission_id
      AND missions.user_id = auth.uid()
    )
  );

-- Key Results RLS
CREATE POLICY "Users can view key results from own objectives"
  ON key_results FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM objectives
      JOIN missions ON missions.id = objectives.mission_id
      WHERE objectives.id = key_results.objective_id
      AND missions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create key results in own objectives"
  ON key_results FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM objectives
      JOIN missions ON missions.id = objectives.mission_id
      WHERE objectives.id = key_results.objective_id
      AND missions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update key results in own objectives"
  ON key_results FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM objectives
      JOIN missions ON missions.id = objectives.mission_id
      WHERE objectives.id = key_results.objective_id
      AND missions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete key results in own objectives"
  ON key_results FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM objectives
      JOIN missions ON missions.id = objectives.mission_id
      WHERE objectives.id = key_results.objective_id
      AND missions.user_id = auth.uid()
    )
  );

-- Actions RLS
CREATE POLICY "Users can view own actions"
  ON actions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own actions"
  ON actions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own actions"
  ON actions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own actions"
  ON actions FOR DELETE
  USING (auth.uid() = user_id);

-- Action-KeyResult RLS
CREATE POLICY "Users can view action-keyresult links"
  ON action_key_results FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM actions
      WHERE actions.id = action_key_results.action_id
      AND actions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create action-keyresult links for own actions"
  ON action_key_results FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM actions
      WHERE actions.id = action_key_results.action_id
      AND actions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete action-keyresult links for own actions"
  ON action_key_results FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM actions
      WHERE actions.id = action_key_results.action_id
      AND actions.user_id = auth.uid()
    )
  );

-- Occurrences RLS
CREATE POLICY "Users can view occurrences from own actions"
  ON occurrences FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM actions
      WHERE actions.id = occurrences.action_id
      AND actions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create occurrences for own actions"
  ON occurrences FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM actions
      WHERE actions.id = occurrences.action_id
      AND actions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update occurrences for own actions"
  ON occurrences FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM actions
      WHERE actions.id = occurrences.action_id
      AND actions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete occurrences for own actions"
  ON occurrences FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM actions
      WHERE actions.id = occurrences.action_id
      AND actions.user_id = auth.uid()
    )
  );

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  
  -- Auto-subscribe to newsletter if user signs up
  INSERT INTO public.subscriptions (email, user_id)
  VALUES (NEW.email, NEW.id)
  ON CONFLICT (email) DO UPDATE SET user_id = NEW.id, active = TRUE;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON comments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_missions_updated_at BEFORE UPDATE ON missions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_objectives_updated_at BEFORE UPDATE ON objectives
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_key_results_updated_at BEFORE UPDATE ON key_results
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_actions_updated_at BEFORE UPDATE ON actions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_occurrences_updated_at BEFORE UPDATE ON occurrences
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to calculate Key Result completion_rate
CREATE OR REPLACE FUNCTION calculate_completion_rate(kr_id UUID)
RETURNS NUMERIC AS $$
DECLARE
  total_occurrences INTEGER;
  completed_occurrences INTEGER;
  result NUMERIC;
BEGIN
  SELECT COUNT(*)
  INTO total_occurrences
  FROM occurrences o
  JOIN action_key_results akr ON akr.action_id = o.action_id
  WHERE akr.key_result_id = kr_id
  AND o.date BETWEEN (
    SELECT start_date FROM key_results WHERE id = kr_id
  ) AND (
    SELECT end_date FROM key_results WHERE id = kr_id
  );

  SELECT COUNT(*)
  INTO completed_occurrences
  FROM occurrences o
  JOIN action_key_results akr ON akr.action_id = o.action_id
  WHERE akr.key_result_id = kr_id
  AND o.status = 'completed'
  AND o.date BETWEEN (
    SELECT start_date FROM key_results WHERE id = kr_id
  ) AND (
    SELECT end_date FROM key_results WHERE id = kr_id
  );

  IF total_occurrences = 0 THEN
    result := 0;
  ELSE
    result := (completed_occurrences::NUMERIC / total_occurrences::NUMERIC) * 100;
  END IF;

  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate Key Result streak
CREATE OR REPLACE FUNCTION calculate_streak(kr_id UUID)
RETURNS INTEGER AS $$
DECLARE
  streak_count INTEGER := 0;
  check_date DATE;
  end_date DATE;
BEGIN
  SELECT end_date INTO end_date FROM key_results WHERE id = kr_id;
  check_date := CURRENT_DATE;
  
  IF check_date > end_date THEN
    check_date := end_date;
  END IF;

  -- Count consecutive days from end_date backwards
  WHILE check_date >= (
    SELECT start_date FROM key_results WHERE id = kr_id
  ) LOOP
    IF EXISTS (
      SELECT 1
      FROM occurrences o
      JOIN action_key_results akr ON akr.action_id = o.action_id
      WHERE akr.key_result_id = kr_id
      AND o.date = check_date
      AND o.status = 'completed'
    ) THEN
      streak_count := streak_count + 1;
      check_date := check_date - INTERVAL '1 day';
    ELSE
      EXIT;
    END IF;
  END LOOP;

  RETURN streak_count;
END;
$$ LANGUAGE plpgsql;

-- Function to update Key Result current_value when occurrence is updated
CREATE OR REPLACE FUNCTION update_key_result_on_occurrence_change()
RETURNS TRIGGER AS $$
DECLARE
  kr_record RECORD;
BEGIN
  -- Update all related Key Results
  FOR kr_record IN
    SELECT DISTINCT akr.key_result_id
    FROM action_key_results akr
    WHERE akr.action_id = COALESCE(NEW.action_id, OLD.action_id)
  LOOP
    IF (SELECT kr_type FROM key_results WHERE id = kr_record.key_result_id) = 'completion_rate' THEN
      UPDATE key_results
      SET current_value = calculate_completion_rate(kr_record.key_result_id),
          updated_at = NOW()
      WHERE id = kr_record.key_result_id;
    ELSIF (SELECT kr_type FROM key_results WHERE id = kr_record.key_result_id) = 'streak' THEN
      UPDATE key_results
      SET current_value = calculate_streak(kr_record.key_result_id),
          updated_at = NOW()
      WHERE id = kr_record.key_result_id;
    END IF;
  END LOOP;

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger to update KR when occurrence changes
DROP TRIGGER IF EXISTS update_kr_on_occurrence_change ON occurrences;
CREATE TRIGGER update_kr_on_occurrence_change
  AFTER INSERT OR UPDATE OR DELETE ON occurrences
  FOR EACH ROW EXECUTE FUNCTION update_key_result_on_occurrence_change();

-- Function to check if objective is completed (all KR reached target)
CREATE OR REPLACE FUNCTION check_objective_completion(obj_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  all_kr_completed BOOLEAN;
BEGIN
  SELECT COUNT(*) = 0 OR (
    COUNT(*) > 0 AND COUNT(*) = SUM(CASE WHEN current_value >= target_value THEN 1 ELSE 0 END)
  )
  INTO all_kr_completed
  FROM key_results
  WHERE objective_id = obj_id;

  UPDATE objectives
  SET completed = all_kr_completed
  WHERE id = obj_id;

  RETURN all_kr_completed;
END;
$$ LANGUAGE plpgsql;

-- Trigger to check objective completion when KR is updated
CREATE OR REPLACE FUNCTION update_objective_on_kr_change()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM check_objective_completion(COALESCE(NEW.objective_id, OLD.objective_id));
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_objective_on_kr_change ON key_results;
CREATE TRIGGER update_objective_on_kr_change
  AFTER INSERT OR UPDATE ON key_results
  FOR EACH ROW EXECUTE FUNCTION update_objective_on_kr_change();

