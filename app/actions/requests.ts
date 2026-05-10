'use server';

import { createClient } from '@/lib/supabase/server';
import type { Database } from '@/types/database.types';

type Request = Database['public']['Tables']['requests']['Insert'];
type Reply = Database['public']['Tables']['request_replies']['Insert'];

export async function getRequests(filters?: { status?: string; category?: string }) {
  const supabase = await createClient();

  let query = supabase
    .from('requests')
    .select(`
      *,
      requester:profiles!requests_requester_id_fkey (
        id,
        full_name,
        avatar_url,
        verified
      ),
      replies:request_replies (
        id,
        message,
        proposed_price,
        partner:profiles!request_replies_partner_id_fkey (
          id,
          full_name,
          verified
        ),
        created_at
      )
    `)
    .order('created_at', { ascending: false });

  if (filters?.status && filters.status !== 'all') {
    query = query.eq('status', filters.status);
  }

  if (filters?.category) {
    query = query.eq('category', filters.category);
  }

  const { data, error } = await query;

  if (error) {
    return { error: error.message };
  }

  return { data };
}

export async function createRequest(requestData: {
  title: string;
  description: string;
  category: string;
  budget?: number;
  deadline?: string;
}) {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return { error: 'Unauthorized' };
  }

  const { data, error } = await supabase
    .from('requests')
    .insert({
      requester_id: user.id,
      title: requestData.title,
      description: requestData.description,
      category: requestData.category,
      budget: requestData.budget || null,
      deadline: requestData.deadline || null,
      status: 'open',
    })
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  return { data };
}

export async function replyToRequest(requestId: string, message: string, proposedPrice?: number) {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return { error: 'Unauthorized' };
  }

  const { data, error } = await supabase
    .from('request_replies')
    .insert({
      request_id: requestId,
      partner_id: user.id,
      message,
      proposed_price: proposedPrice || null,
    })
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  return { data };
}
