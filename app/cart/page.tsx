'use client';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const { items, removeItem, totalPrice, loading } = useCart();
  const router = useRouter();

  if (loading) return <div className="text-center py-10">Loading keranjang...</div>;

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Keranjang Belanja</h1>
        <p className="text-gray-500 mb-6">Keranjang Anda kosong.</p>
        <Link href="/animals" className="bg-green-600 text-white px-6 py-2 rounded-lg">Belanja Sekarang</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Keranjang Belanja</h1>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-4 border-b py-4">
              <div className="relative w-20 h-20 bg-gray-100 rounded">
                {item.image && <Image src={item.image} alt={item.name} fill className="object-cover rounded" />}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-gray-600 text-sm">{item.animal_type}</p>
                <p className="text-green-700 font-bold">Rp {item.price.toLocaleString('id-ID')}</p>
              </div>
              <button onClick={() => removeItem(item.animal_id)} className="text-red-500 hover:text-red-700">Hapus</button>
            </div>
          ))}
        </div>
        <div className="lg:w-80 bg-white p-4 rounded-lg shadow h-fit">
          <h2 className="text-xl font-semibold mb-4">Ringkasan Belanja</h2>
          <div className="flex justify-between mb-2">
            <span>Total ({items.length} item)</span>
            <span className="font-bold">Rp {totalPrice.toLocaleString('id-ID')}</span>
          </div>
          <button onClick={() => router.push('/checkout')} className="w-full bg-green-600 text-white py-2 rounded-lg mt-4 hover:bg-green-700">Lanjut ke Checkout</button>
        </div>
      </div>
    </div>
  );
}