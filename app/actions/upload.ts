'use server';

import { createClient } from '@/lib/supabase/server';

export async function uploadFile(formData: FormData) {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return { error: 'Unauthorized' };
  }

  const file = formData.get('file') as File | null;
  const bucket = (formData.get('bucket') as string) || 'product-files';

  if (!file) {
    return { error: 'No file provided' };
  }

  // Validate file size (max 50MB)
  if (file.size > 50 * 1024 * 1024) {
    return { error: 'File size must be under 50MB' };
  }

  const fileExt = file.name.split('.').pop() || 'bin';
  const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(fileName, buffer, {
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    console.error('Upload error:', error);
    return { error: error.message };
  }

  // Get public URL
  const { data: urlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(fileName);

  return {
    data: {
      path: data.path,
      url: urlData.publicUrl,
      size: file.size,
      type: file.type,
    },
  };
}
