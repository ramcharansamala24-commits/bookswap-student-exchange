CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT SELECT ON public.profiles TO anon;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE TABLE public.books (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  author text NOT NULL,
  category text NOT NULL,
  description text NOT NULL DEFAULT '',
  condition text NOT NULL,
  year_sem text NOT NULL DEFAULT '',
  price numeric NOT NULL DEFAULT 0,
  type text NOT NULL DEFAULT 'Sell',
  seller_name text NOT NULL DEFAULT '',
  seller_email text NOT NULL DEFAULT '',
  image text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.books TO authenticated;
GRANT SELECT ON public.books TO anon;
GRANT ALL ON public.books TO service_role;
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Books are viewable by everyone" ON public.books FOR SELECT USING (true);
CREATE POLICY "Users can add their own books" ON public.books FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own books" ON public.books FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own books" ON public.books FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_books_updated_at BEFORE UPDATE ON public.books FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''), COALESCE(NEW.email, ''))
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

INSERT INTO public.books (title, author, category, description, condition, year_sem, price, type, seller_name, seller_email) VALUES
('Python Programming','Reema Thareja','Computer Science','Complete beginner friendly Python book with programs and exercises. Used for one semester only, no torn pages.','Like New','1st Year / Semester 2',260,'Sell','Ananya Rao','ananya.rao@example.com'),
('Data Structures and Algorithms','Narasimha Karumanchi','Computer Science','Very useful for placement preparation and lab exams. Contains solved problems for every chapter.','Good','2nd Year / Semester 3',320,'Sell','Rahul Verma','rahul.verma@example.com'),
('Engineering Mathematics - I','B. S. Grewal','Mathematics','Standard mathematics textbook covering calculus, matrices and differential equations. Willing to exchange for a Physics book.','Good','1st Year / Semester 1',0,'Exchange','Sneha Patil','sneha.patil@example.com'),
('Digital Electronics','R. P. Jain','Electronics','Covers logic gates, flip flops, counters and registers. Some pages have pencil notes which are easy to erase.','Used','2nd Year / Semester 4',180,'Sell','Imran Shaikh','imran.shaikh@example.com'),
('Computer Fundamentals','P. K. Sinha','Computer Science','Basic computer concepts book for first year students. Giving it away free to any junior who needs it.','Good','1st Year / Semester 1',0,'Free','Karthik Menon','karthik.menon@example.com'),
('Engineering Physics','H. K. Malik','Physics','Theory plus numerical problems on optics, lasers and semiconductors. Cover is slightly bent but inside is clean.','Good','1st Year / Semester 2',210,'Sell','Divya Nair','divya.nair@example.com'),
('Engineering Chemistry','Jain and Jain','Chemistry','First year chemistry textbook with water treatment, polymers and fuels chapters. Almost new condition.','New','1st Year / Semester 1',240,'Sell','Aditya Kulkarni','aditya.kulkarni@example.com'),
('Java Programming','E. Balagurusamy','Computer Science','Programming with Java, useful for OOP subject and lab record work. Free to exchange with a DBMS book.','Like New','2nd Year / Semester 3',0,'Exchange','Meera Joshi','meera.joshi@example.com');