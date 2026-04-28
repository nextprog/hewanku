'use client';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { createOrder } from '@/lib/actions/order';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const router = useRouter();
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);

  if (items.length === 0) {
    router.push('/cart');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim()) {
      toast.error('Alamat harus diisi');
      return;
    }
    setLoading(true);
    try {
      const orderId = await createOrder(items, totalPrice, address);
      await clearCart();
      toast.success('Pesanan berhasil dibuat. Silakan upload bukti bayar di dashboard.');
      router.push('/dashboard/buyer/orders');
    } catch (error: any) {
      toast.error(error.message || 'Gagal membuat pesanan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4">Daftar Hewan</h2>
        {items.map(item => (
          <div key={item.id} className="flex justify-between py-2 border-b">
            <span>{item.name}</span>
            <span>Rp {item.price.toLocaleString('id-ID')}</span>
          </div>
        ))}
        <div className="flex justify-between font-bold text-lg mt-4 pt-2 border-t">
          <span>Total</span>
          <span>Rp {totalPrice.toLocaleString('id-ID')}</span>
        </div>
        <form onSubmit={handleSubmit} className="mt-6">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Alamat Pengiriman</label>
            <textarea value={address} onChange={e => setAddress(e.target.value)} required rows={3} className="w-full border rounded px-3 py-2" placeholder="Jl. Contoh No. 123, Kota ..." />
          </div>
          <div className="bg-yellow-50 p-4 rounded mb-4 text-sm">
            <p className="font-semibold">Metode Pembayaran: Transfer Bank</p>
            <p>Silakan transfer ke rekening BCA 1234567890 a.n. HewanKita. Setelah transfer, upload bukti di menu Pesanan.</p>
          </div>
          <button type="submit" disabled={loading} className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700">
            {loading ? 'Memproses...' : 'Buat Pesanan'}
          </button>
        </form>
      </div>
    </div>
  );
}