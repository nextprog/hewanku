'use server';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function deleteAnimal(animalId: string) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  // Optional: hapus gambar dari storage
  const { data: animal } = await supabase.from('animals').select('images').eq('id', animalId).single();
  if (animal?.images) {
    for (const url of animal.images) {
      const fileName = url.split('/').pop();
      if (fileName) await supabase.storage.from('animal-images').remove([fileName]);
    }
  }

  const { error } = await supabase.from('animals').delete().eq('id', animalId).eq('seller_id', user.id);
  if (error) throw new Error(error.message);
  revalidatePath('/dashboard/seller/animals');
}