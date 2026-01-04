-- ============================================
-- WORSHIPMARKET DATABASE SCHEMA v1.0
-- Constitution Version: 1.1
-- Date: January 2026
-- ============================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- ENUMS
-- ============================================

CREATE TYPE user_role AS ENUM ('leader', 'partner', 'admin');
CREATE TYPE product_type AS ENUM ('service', 'asset', 'knowledge');
CREATE TYPE order_status AS ENUM ('pending', 'in_progress', 'revision', 'completed', 'cancelled');
CREATE TYPE message_sender AS ENUM ('buyer', 'seller', 'system');

-- ============================================
-- PROFILES TABLE (extends auth.users)
-- ============================================

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role user_role NOT NULL DEFAULT 'leader',
  bio TEXT,
  avatar_url TEXT,
  
  -- Partner-specific fields
  verified BOOLEAN DEFAULT false,
  statement_of_faith_agreed BOOLEAN DEFAULT false,
  statement_of_faith_agreed_at TIMESTAMPTZ,
  stripe_connect_id TEXT UNIQUE,
  stripe_onboarding_complete BOOLEAN DEFAULT false,
  
  -- Stats
  total_earnings DECIMAL(10,2) DEFAULT 0,
  partner_score INTEGER DEFAULT 100,
  total_sales INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- PRODUCTS TABLE (Unified: Services, Assets, Knowledge)
-- ============================================

CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  seller_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Core Fields
  type product_type NOT NULL,
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
  
  -- Media
  image_url TEXT,
  audio_url TEXT, -- for asset previews
  file_url TEXT, -- for downloadable assets
  file_size TEXT,
  
  -- Service-specific
  delivery_time TEXT, -- e.g., "3 Days"
  requirements TEXT, -- what buyer needs to provide
  
  -- Metadata
  tags TEXT[], -- ["Mixing", "Key of D", "BPM 120"]
  key TEXT, -- Musical key (C, D, E, etc.)
  bpm INTEGER, -- Beats per minute
  vibe TEXT, -- "Ambient", "Uplifting", etc.
  
  -- Stats
  views INTEGER DEFAULT 0,
  sales INTEGER DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  
  -- Status
  active BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ORDERS TABLE
-- ============================================

CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT UNIQUE NOT NULL,
  
  -- Parties
  buyer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  seller_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  
  -- Financial
  amount DECIMAL(10,2) NOT NULL,
  platform_fee DECIMAL(10,2) NOT NULL, -- 15% or $0.50 minimum
  seller_payout DECIMAL(10,2) NOT NULL,
  stripe_payment_intent_id TEXT,
  
  -- Status
  status order_status DEFAULT 'pending',
  
  -- Service-specific delivery tracking
  delivered_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- MESSAGES TABLE (Service Workroom Chat)
-- ============================================

CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  sender_type message_sender NOT NULL,
  
  content TEXT NOT NULL,
  attachment_url TEXT,
  
  read BOOLEAN DEFAULT false,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- REVIEWS TABLE
-- ============================================

CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID UNIQUE NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  seller_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  
  flagged BOOLEAN DEFAULT false,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- REQUESTS TABLE (Request Board)
-- ============================================

CREATE TABLE requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  requester_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  budget DECIMAL(10,2),
  deadline TIMESTAMPTZ,
  
  status TEXT DEFAULT 'open', -- open, in_progress, closed
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- REQUEST_REPLIES TABLE
-- ============================================

CREATE TABLE request_replies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_id UUID NOT NULL REFERENCES requests(id) ON DELETE CASCADE,
  partner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  message TEXT NOT NULL,
  proposed_price DECIMAL(10,2),
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- REPORTS TABLE (Moderation)
-- ============================================

CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reporter_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- What's being reported
  reported_type TEXT NOT NULL, -- 'product', 'profile', 'review'
  reported_id UUID NOT NULL,
  
  reason TEXT NOT NULL, -- 'theology', 'copyright', 'quality', 'other'
  details TEXT,
  
  -- Moderation
  status TEXT DEFAULT 'pending', -- pending, reviewed, resolved
  reviewed_by UUID REFERENCES profiles(id),
  reviewed_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX idx_products_seller ON products(seller_id);
CREATE INDEX idx_products_type ON products(type);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_active ON products(active);
CREATE INDEX idx_products_tags ON products USING GIN(tags);

CREATE INDEX idx_orders_buyer ON orders(buyer_id);
CREATE INDEX idx_orders_seller ON orders(seller_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created ON orders(created_at DESC);

CREATE INDEX idx_messages_order ON messages(order_id);
CREATE INDEX idx_messages_created ON messages(created_at);

CREATE INDEX idx_reviews_product ON reviews(product_id);
CREATE INDEX idx_reviews_seller ON reviews(seller_id);

CREATE INDEX idx_requests_status ON requests(status);
CREATE INDEX idx_request_replies_request ON request_replies(request_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE request_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read all, update own
CREATE POLICY "Public profiles viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Products: All can read active, sellers can manage own
CREATE POLICY "Active products viewable by everyone" ON products FOR SELECT USING (active = true OR seller_id = auth.uid());
CREATE POLICY "Sellers can insert own products" ON products FOR INSERT WITH CHECK (auth.uid() = seller_id);
CREATE POLICY "Sellers can update own products" ON products FOR UPDATE USING (auth.uid() = seller_id);
CREATE POLICY "Sellers can delete own products" ON products FOR DELETE USING (auth.uid() = seller_id);

-- Orders: Buyers and sellers can view their own orders
CREATE POLICY "Users can view own orders" ON orders FOR SELECT USING (
  auth.uid() = buyer_id OR auth.uid() = seller_id
);
CREATE POLICY "Buyers can create orders" ON orders FOR INSERT WITH CHECK (auth.uid() = buyer_id);
CREATE POLICY "Sellers can update order status" ON orders FOR UPDATE USING (auth.uid() = seller_id);

-- Messages: Order participants can view and create
CREATE POLICY "Order participants can view messages" ON messages FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM orders 
    WHERE orders.id = messages.order_id 
    AND (orders.buyer_id = auth.uid() OR orders.seller_id = auth.uid())
  )
);
CREATE POLICY "Order participants can send messages" ON messages FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM orders 
    WHERE orders.id = messages.order_id 
    AND (orders.buyer_id = auth.uid() OR orders.seller_id = auth.uid())
  )
);

-- Reviews: All can read, buyers can create for completed orders
CREATE POLICY "Reviews viewable by everyone" ON reviews FOR SELECT USING (true);
CREATE POLICY "Buyers can create reviews" ON reviews FOR INSERT WITH CHECK (
  auth.uid() = reviewer_id AND 
  EXISTS (
    SELECT 1 FROM orders 
    WHERE orders.id = reviews.order_id 
    AND orders.buyer_id = auth.uid()
    AND orders.status = 'completed'
  )
);

-- Requests: All can read, leaders can create
CREATE POLICY "Requests viewable by everyone" ON requests FOR SELECT USING (true);
CREATE POLICY "Leaders can create requests" ON requests FOR INSERT WITH CHECK (
  auth.uid() = requester_id
);
CREATE POLICY "Requesters can update own requests" ON requests FOR UPDATE USING (auth.uid() = requester_id);

-- Request Replies: All can read, partners can reply
CREATE POLICY "Request replies viewable by everyone" ON request_replies FOR SELECT USING (true);
CREATE POLICY "Partners can create replies" ON request_replies FOR INSERT WITH CHECK (auth.uid() = partner_id);

-- Reports: Users can create, admins can view all
CREATE POLICY "Users can create reports" ON reports FOR INSERT WITH CHECK (auth.uid() = reporter_id);
CREATE POLICY "Users can view own reports" ON reports FOR SELECT USING (auth.uid() = reporter_id);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_requests_updated_at BEFORE UPDATE ON requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update product rating when review is added
CREATE OR REPLACE FUNCTION update_product_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE products
  SET 
    rating = (SELECT AVG(rating) FROM reviews WHERE product_id = NEW.product_id),
    review_count = (SELECT COUNT(*) FROM reviews WHERE product_id = NEW.product_id)
  WHERE id = NEW.product_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_product_rating_trigger
  AFTER INSERT ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_product_rating();
