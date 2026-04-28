import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import Image from 'next/image';


export default async function SellerAnimalsPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: animals } = await supabase
    .from('animals')
    .select('*')
    .eq('seller_id', user?.id)
    .order('created_at', { ascending: false });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Hewan Saya</h1>
        <Link href="/dashboard/seller/animals/add" className="bg-green-600 text-white px-4 py-2 rounded-lg">+ Tambah Hewan</Link>
      </div>
      {animals?.length === 0 ? (
        <p className="text-gray-500">Anda belum menambahkan hewan apapun.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {animals?.map((animal) => (
            <div key={animal.id} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="relative h-40">
                {animal.images?.[0] && <Image src={animal.images[0]} alt={animal.name} fill className="object-cover" />}
              </div>
              <div className="p-4">
                <h3 className="font-semibold">{animal.name || animal.animal_type}</h3>
                <p className="text-green-700 font-bold">Rp {animal.price.toLocaleString('id-ID')}</p>
                <p className={`text-sm mt-1 ${animal.status === 'available' ? 'text-green-600' : 'text-red-600'}`}>{animal.status === 'available' ? 'Tersedia' : 'Terjual'}</p>
                <div className="flex gap-2 mt-3">
                  <Link href={`/dashboard/seller/animals/${animal.id}/edit`} className="flex-1 text-center bg-blue-500 text-white py-1 rounded">Edit</Link>
                  <button formAction={async () => { 'use server'; await deleteAnimal(animal.id); }} className="flex-1 bg-red-500 text-white py-1 rounded">Hapus</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

async function deleteAnimal(id: string) {
  'use server';
  const supabase = createClient();
  await supabase.from('animals').delete().eq('id', id);
  revalidatePath('/dashboard/seller/animals');
}