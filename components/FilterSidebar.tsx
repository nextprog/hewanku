'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

export default function FilterSidebar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [type, setType] = useState(searchParams.get('type') || 'all');
  const [minPrice, setMinPrice] = useState(searchParams.get('min') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('max') || '');
  const [qurbanOnly, setQurbanOnly] = useState(searchParams.get('qurban') === 'true');

  const applyFilters = () => {
    const params = new URLSearchParams();
    if (type !== 'all') params.set('type', type);
    if (minPrice) params.set('min', minPrice);
    if (maxPrice) params.set('max', maxPrice);
    if (qurbanOnly) params.set('qurban', 'true');
    router.push(`/animals?${params.toString()}`);
  };

  const resetFilters = () => {
    setType('all');
    setMinPrice('');
    setMaxPrice('');
    setQurbanOnly(false);
    router.push('/animals');
  };

  return (
    <div className="w-full md:w-64 bg-white p-4 rounded-lg shadow h-fit">
      <h3 className="font-bold text-lg mb-4">Filter Hewan</h3>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Jenis Hewan</label>
        <select value={type} onChange={(e) => setType(e.target.value)} className="w-full border rounded px-2 py-1">
          <option value="all">Semua</option>
          <option value="Kambing">Kambing</option>
          <option value="Domba">Domba</option>
          <option value="Sapi">Sapi</option>
          <option value="Kerbau">Kerbau</option>
          <option value="Unta">Unta</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Harga (Rp)</label>
        <div className="flex gap-2">
          <input type="number" placeholder="Min" value={minPrice} onChange={e => setMinPrice(e.target.value)} className="w-1/2 border rounded px-2 py-1" />
          <input type="number" placeholder="Max" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} className="w-1/2 border rounded px-2 py-1" />
        </div>
      </div>
      <div className="mb-4">
        <label className="inline-flex items-center">
          <input type="checkbox" checked={qurbanOnly} onChange={e => setQurbanOnly(e.target.checked)} className="mr-2" />
          Hanya Layak Qurban
        </label>
      </div>
      <div className="flex gap-2">
        <button onClick={applyFilters} className="bg-green-600 text-white px-3 py-1 rounded w-full">Terapkan</button>
        <button onClick={resetFilters} className="bg-gray-300 text-gray-800 px-3 py-1 rounded w-full">Reset</button>
      </div>
    </div>
  );
}