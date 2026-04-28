'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import toast from 'react-hot-toast';

export default function AnimalCard({ animal }: { animal: any }) {
  const { addItem } = useCart();
  const handleAddToCart = async () => {
    try {
      await addItem(animal);
      toast.success(`${animal.name} ditambahkan ke keranjang`);
    } catch (error) {
      toast.error('Gagal menambahkan, silakan login');
    }
  };
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
      <div className="relative h-48">
        {animal.images?.[0] ? (
          <Image src={animal.images[0]} alt={animal.name} fill className="object-cover" />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">No Image</div>
        )}
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-gray-800">{animal.name || animal.animal_type}</h3>
          {animal.is_qurban_eligible && <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Layak Qurban</span>}
        </div>
        <p className="text-gray-600 text-sm">Jenis: {animal.animal_type}</p>
        <p className="text-gray-600 text-sm">Umur: {animal.age_months} bulan</p>
        <p className="text-green-700 font-bold text-xl mt-2">Rp {animal.price.toLocaleString('id-ID')}</p>
        <div className="mt-3 flex gap-2">
          <Link href={`/animals/${animal.id}`} className="flex-1 text-center bg-gray-200 text-gray-800 py-2 rounded hover:bg-gray-300">Detail</Link>
          <button onClick={handleAddToCart} className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700">Keranjang</button>
        </div>
      </div>
    </div>
  );
}