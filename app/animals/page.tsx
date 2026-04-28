import { createClient } from '@/lib/supabase/server';
import AnimalCard from '@/components/AnimalCard';
import FilterSidebar from '@/components/FilterSidebar';

export default async function MarketplacePage({ searchParams }: { searchParams: { type?: string; min?: string; max?: string; qurban?: string } }) {
  const supabase = createClient();
  let query = supabase.from('animals').select('*, profiles(full_name)').eq('status', 'available');
  if (searchParams.type && searchParams.type !== 'all') query = query.eq('animal_type', searchParams.type);
  if (searchParams.qurban === 'true') query = query.eq('is_qurban_eligible', true);
  if (searchParams.min) query = query.gte('price', parseInt(searchParams.min));
  if (searchParams.max) query = query.lte('price', parseInt(searchParams.max));
  const { data: animals } = await query;
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-6">
        <FilterSidebar />
        <div className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {animals?.map((animal) => <AnimalCard key={animal.id} animal={animal} />)}
          </div>
          {(!animals || animals.length === 0) && <p className="text-center text-gray-500 py-10">Tidak ada hewan ditemukan.</p>}
        </div>
      </div>
    </div>
  );
}