'use server';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function uploadAnimalImages(formData: FormData, animalId?: string): Promise<string[]> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  const files = formData.getAll('images') as File[];
  const urls: string[] = [];

  for (const file of files) {
    if (file.size === 0) continue;
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}_${Date.now()}_${Math.random()}.${fileExt}`;
    const { data, error } = await supabase.storage
      .from('animal-images')
      .upload(fileName, file, { cacheControl: '3600', upsert: false });
    if (error) throw new Error(`Upload gagal: ${error.message}`);
    const { data: { publicUrl } } = supabase.storage.from('animal-images').getPublicUrl(fileName);
    urls.push(publicUrl);
  }
  return urls;
}