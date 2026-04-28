import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import AddToCartButton from '@/components/AddToCartButton';
import QurbanBadge from '@/components/QurbanBadge';

export default async function AnimalDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: animal, error } = await supabase
    .from('animals')
    .select('*, profiles(full_name, phone)')
    .eq('id', params.id)
    .single();
  
  if (error || !animal) notFound();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/2 relative h-96">
            {animal.images?.[0] ? (
              <Image src={animal.images[0]} alt={animal.name} fill className="object-cover" />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">Gambar tidak tersedia</div>
            )}
          </div>
          <div className="p-6 md:w-1/2">
            <h1 className="text-3xl font-bold text-gray-800">{animal.name || animal.animal_type}</h1>
            <div className="mt-2 flex items-center gap-2">
              <QurbanBadge eligible={animal.is_qurban_eligible} type={animal.animal_type} ageMonths={animal.age_months} />
              <span className={`text-sm px-2 py-1 rounded-full ${animal.status === 'available' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {animal.status === 'available' ? 'Tersedia' : 'Terjual'}
              </span>
            </div>
            <p className="text-3xl text-green-700 font-bold mt-4">Rp {animal.price.toLocaleString('id-ID')}</p>
            <div className="mt-4 space-y-2">
              <p><strong>Jenis:</strong> {animal.animal_type}</p>
              <p><strong>Umur:</strong> {animal.age_months} bulan</p>
              <p><strong>Lokasi:</strong> {animal.location || 'Tidak disebutkan'}</p>
              <p><strong>Penjual:</strong> {animal.profiles?.full_name || 'Anonim'}</p>
              <p><strong>Deskripsi:</strong> {animal.description || '-'}</p>
            </div>
            {animal.status === 'available' && (
              <div className="mt-6">
                <AddToCartButton animal={animal} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}