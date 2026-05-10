'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import type { Database } from '@/types/database.types';

type Order = Database['public']['Tables']['orders']['Insert'];
type OrderUpdate = Database['public']['Tables']['orders']['Update'];

export async function createOrder(orderData: {
  product_id: string;
  amount: number;
  platform_fee: number;
  seller_payout: number;
}) {
  const supabase = await createClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return { error: 'Unauthorized' };
  }

  // Get product details to get seller_id
  const { data: product, error: productError } = await supabase
    .from('products')
    .select('seller_id, price')
    .eq('id', orderData.product_id)
    .single();

  if (productError || !product) {
    return { error: 'Product not found' };
  }

  // Generate order number
  const orderNumber = `WM-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

  const { data, error } = await supabase
    .from('orders')
    .insert({
      order_number: orderNumber,
      buyer_id: user.id,
      seller_id: product.seller_id,
      product_id: orderData.product_id,
      amount: orderData.amount,
      platform_fee: orderData.platform_fee,
      seller_payout: orderData.seller_payout,
      status: 'pending',
    })
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/purchases');
  revalidatePath('/dashboard');
  
  return { data };
}

export async function getOrders(userRole: 'buyer' | 'seller' = 'buyer') {
  const supabase = await createClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return { error: 'Unauthorized' };
  }

  const column = userRole === 'buyer' ? 'buyer_id' : 'seller_id';

  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      products (
        id,
        title,
        type,
        image_url,
        seller_id
      ),
      profiles!orders_buyer_id_fkey (
        id,
        email,
        full_name
      ),
      profiles!orders_seller_id_fkey (
        id,
        email,
        full_name
      )
    `)
    .eq(column, user.id)
    .order('created_at', { ascending: false });

  if (error) {
    return { error: error.message };
  }

  return { data };
}

export async function updateOrderStatus(orderId: string, status: Database['public']['Tables']['orders']['Row']['status']) {
  const supabase = await createClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return { error: 'Unauthorized' };
  }

  // Verify user is the seller
  const { data: order } = await supabase
    .from('orders')
    .select('seller_id')
    .eq('id', orderId)
    .single();

  if (!order || order.seller_id !== user.id) {
    return { error: 'Unauthorized' };
  }

  const updateData: OrderUpdate = { status };

  if (status === 'completed') {
    updateData.completed_at = new Date().toISOString();
  }

  const { data, error } = await supabase
    .from('orders')
    .update(updateData)
    .eq('id', orderId)
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/purchases');
  revalidatePath('/dashboard');
  
  return { data };
}

export async function getOrder(orderId: string) {
  const supabase = await createClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return { error: 'Unauthorized' };
  }

  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      products (
        *
      ),
      profiles!orders_buyer_id_fkey (
        id,
        email,
        full_name,
        avatar_url
      ),
      profiles!orders_seller_id_fkey (
        id,
        email,
        full_name,
        avatar_url
      )
    `)
    .eq('id', orderId)
    .single();

  if (error) {
    return { error: error.message };
  }

  // Verify user is buyer or seller
  if (data.buyer_id !== user.id && data.seller_id !== user.id) {
    return { error: 'Unauthorized' };
  }

  return { data };
}
