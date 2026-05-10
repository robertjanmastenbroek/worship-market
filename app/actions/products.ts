'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import type { Database } from '@/types/database.types';

type Product = Database['public']['Tables']['products']['Insert'];
type ProductUpdate = Database['public']['Tables']['products']['Update'];

export async function createProduct(productData: Omit<Product, 'seller_id'>) {
  const supabase = await createClient();
  
  // Get current user
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return { error: 'Unauthorized' };
  }

  // Check if user has a profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('id, role')
    .eq('id', user.id)
    .single();

  if (!profile) {
    return { error: 'Profile not found' };
  }

  // Create product with seller_id
  const { data, error } = await supabase
    .from('products')
    .insert({
      ...productData,
      seller_id: user.id,
    })
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/marketplace');
  revalidatePath('/dashboard');
  
  return { data };
}

export async function updateProduct(productId: string, updates: ProductUpdate) {
  const supabase = await createClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return { error: 'Unauthorized' };
  }

  // Verify ownership
  const { data: product } = await supabase
    .from('products')
    .select('seller_id')
    .eq('id', productId)
    .single();

  if (!product || product.seller_id !== user.id) {
    return { error: 'Unauthorized' };
  }

  const { data, error } = await supabase
    .from('products')
    .update(updates)
    .eq('id', productId)
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/marketplace');
  revalidatePath('/dashboard');
  
  return { data };
}

export async function deleteProduct(productId: string) {
  const supabase = await createClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return { error: 'Unauthorized' };
  }

  // Verify ownership
  const { data: product } = await supabase
    .from('products')
    .select('seller_id')
    .eq('id', productId)
    .single();

  if (!product || product.seller_id !== user.id) {
    return { error: 'Unauthorized' };
  }

  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', productId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/marketplace');
  revalidatePath('/dashboard');
  
  return { success: true };
}

export async function getProducts(filters?: {
  type?: 'service' | 'asset' | 'knowledge';
  category?: string;
  key?: string;
  bpm?: number;
  vibe?: string;
  search?: string;
}) {
  const supabase = await createClient();
  
  let query = supabase
    .from('products')
    .select(`
      *,
      profiles!products_seller_id_fkey (
        id,
        email,
        full_name,
        role,
        verified
      )
    `)
    .eq('active', true)
    .order('created_at', { ascending: false });

  if (filters?.type) {
    query = query.eq('type', filters.type);
  }

  if (filters?.category) {
    query = query.eq('category', filters.category);
  }

  if (filters?.key) {
    query = query.eq('key', filters.key);
  }

  if (filters?.bpm) {
    query = query.eq('bpm', filters.bpm);
  }

  if (filters?.vibe) {
    query = query.eq('vibe', filters.vibe);
  }

  if (filters?.search) {
    query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
  }

  const { data, error } = await query;

  if (error) {
    return { error: error.message };
  }

  return { data };
}

export async function getProduct(productId: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      profiles!products_seller_id_fkey (
        id,
        email,
        full_name,
        role,
        verified,
        bio,
        avatar_url
      )
    `)
    .eq('id', productId)
    .single();

  if (error) {
    return { error: error.message };
  }

  return { data };
}

export async function getUserProducts() {
  const supabase = await createClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return { error: 'Unauthorized' };
  }

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('seller_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    return { error: error.message };
  }

  return { data };
}
