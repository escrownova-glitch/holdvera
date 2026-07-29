import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function uploadImage(file: File, folder: string = 'transactions'): Promise<string | null> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

  const { data, error } = await supabase.storage
    .from('holdvera-images')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    console.error('Upload error:', error);
    return null;
  }

  const { data: urlData } = supabase.storage
    .from('holdvera-images')
    .getPublicUrl(data.path);

  return urlData.publicUrl;
}

export async function uploadBase64Image(base64: string, folder: string = 'transactions'): Promise<string | null> {
  try {
    const matches = base64.match(/^data:image\/(\w+);base64,(.+)$/);
    if (!matches) return null;

    const ext = matches[1];
    const data = matches[2];
    const buffer = Buffer.from(data, 'base64');
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;

    const { data: uploadData, error } = await supabase.storage
      .from('holdvera-images')
      .upload(fileName, buffer, {
        contentType: `image/${ext}`,
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('Upload error:', error);
      return null;
    }

    const { data: urlData } = supabase.storage
      .from('holdvera-images')
      .getPublicUrl(uploadData.path);

    return urlData.publicUrl;
  } catch (error) {
    console.error('Base64 upload error:', error);
    return null;
  }
}
