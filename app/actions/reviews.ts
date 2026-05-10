'use server';

import { createClient } from '@/lib/supabase/server';
import type { Database } from '@/types/database.types';

type Review = Database['public']['Tables']['reviews']['Insert'];

export async function getProductReviews(productId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('reviews')
    .select(`
      *,
      reviewer:profiles!reviews_reviewer_id_fkey (
        id,
        full_name,
        avatar_url
      )
    `)
    .eq('product_id', productId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching reviews:', error);
    return { data: [], error: error.message };
  }

  return { data, error: null };
}

export async function createReview(reviewData: {
  product_id: string;
  order_id: string;
  seller_id: string;
  rating: number;
  comment?: string;
}) {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return { error: 'Unauthorized' };
  }

  if (reviewData.rating < 1 || reviewData.rating > 5) {
    return { error: 'Rating must be between 1 and 5' };
  }

  const { data, error } = await supabase
    .from('reviews')
    .insert({
      product_id: reviewData.product_id,
      order_id: reviewData.order_id,
      reviewer_id: user.id,
      seller_id: reviewData.seller_id,
      rating: reviewData.rating,
      comment: reviewData.comment || null,
      flagged: false,
    })
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  return { data };
}
