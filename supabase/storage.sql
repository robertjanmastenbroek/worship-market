-- ============================================
-- STORAGE BUCKETS SETUP
-- ============================================

-- Create storage buckets for digital assets
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('product-images', 'product-images', true),
  ('product-files', 'product-files', false),  -- Private: only accessible after purchase
  ('audio-previews', 'audio-previews', true),
  ('user-avatars', 'user-avatars', true),
  ('message-attachments', 'message-attachments', false);

-- ============================================
-- STORAGE POLICIES
-- ============================================

-- Product Images: Public read, sellers can upload
CREATE POLICY "Product images are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'product-images');
CREATE POLICY "Sellers can upload product images" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'product-images' AND auth.role() = 'authenticated'
);
CREATE POLICY "Sellers can update own product images" ON storage.objects FOR UPDATE USING (
  bucket_id = 'product-images' AND auth.uid()::text = (storage.foldername(name))[1]
);
CREATE POLICY "Sellers can delete own product images" ON storage.objects FOR DELETE USING (
  bucket_id = 'product-images' AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Product Files: Private, only buyers who purchased can access
CREATE POLICY "Buyers can access purchased files" ON storage.objects FOR SELECT USING (
  bucket_id = 'product-files' AND 
  EXISTS (
    SELECT 1 FROM orders 
    WHERE orders.buyer_id = auth.uid() 
    AND orders.product_id::text = (storage.foldername(name))[1]
    AND orders.status IN ('completed', 'in_progress')
  )
);
CREATE POLICY "Sellers can upload product files" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'product-files' AND auth.role() = 'authenticated'
);

-- Audio Previews: Public read, sellers can upload
CREATE POLICY "Audio previews are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'audio-previews');
CREATE POLICY "Sellers can upload audio previews" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'audio-previews' AND auth.role() = 'authenticated'
);

-- User Avatars: Public read, users can manage own
CREATE POLICY "Avatars are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'user-avatars');
CREATE POLICY "Users can upload own avatar" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'user-avatars' AND auth.uid()::text = (storage.foldername(name))[1]
);
CREATE POLICY "Users can update own avatar" ON storage.objects FOR UPDATE USING (
  bucket_id = 'user-avatars' AND auth.uid()::text = (storage.foldername(name))[1]
);
CREATE POLICY "Users can delete own avatar" ON storage.objects FOR DELETE USING (
  bucket_id = 'user-avatars' AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Message Attachments: Only order participants can access
CREATE POLICY "Order participants can access attachments" ON storage.objects FOR SELECT USING (
  bucket_id = 'message-attachments' AND 
  EXISTS (
    SELECT 1 FROM messages m
    JOIN orders o ON m.order_id = o.id
    WHERE m.attachment_url LIKE '%' || name || '%'
    AND (o.buyer_id = auth.uid() OR o.seller_id = auth.uid())
  )
);
CREATE POLICY "Order participants can upload attachments" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'message-attachments' AND auth.role() = 'authenticated'
);
