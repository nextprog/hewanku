'use client';
import { useCart } from '@/context/CartContext';
import toast from 'react-hot-toast';

export default function AddToCartButton({ animal }: { animal: any }) {
  const { addItem } = useCart();
  const handleClick = async () => {
    try {
      await addItem(animal);
      toast.success('Ditambahkan ke keranjang');
    } catch (error) {
      toast.error('Silakan login terlebih dahulu');
    }
  };
  return (
    <button onClick={handleClick} className="w-full bg-green-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-green-700 transition">
      Tambah ke Keranjang
    </button>
  );
}