import { createClient } from '@/lib/supabase/server';
import { verifyPayment } from '@/lib/actions/order';
import Image from 'next/image';
import Link from 'next/link';

export default async function AdminOrdersPage() {
  const supabase = createClient();
  const { data: orders } = await supabase
    .from('orders')
    .select('*, profiles(full_name), order_items(animal_id, animals(name))')
    .in('status', ['waiting_payment', 'pending'])
    .order('order_date', { ascending: false });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Verifikasi Pembayaran</h1>
      {orders?.length === 0 && <p>Tidak ada pesanan menunggu verifikasi.</p>}
      <div className="space-y-6">
        {orders?.map((order) => (
          <div key={order.id} className="bg-white shadow rounded-lg p-4">
            <div className="flex justify-between">
              <div>
                <p><strong>Order ID:</strong> {order.id.slice(0,8)}</p>
                <p><strong>Pembeli:</strong> {order.profiles?.full_name}</p>
                <p><strong>Total:</strong> Rp {order.total_amount.toLocaleString('id-ID')}</p>
                <p><strong>Alamat:</strong> {order.shipping_address}</p>
              </div>
              <div>
                {order.payment_proof_url && (
                  <Link href={order.payment_proof_url} target="_blank" className="text-blue-600 underline">Lihat Bukti</Link>
                )}
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <form action={async () => { 'use server'; await verifyPayment(order.id, 'paid'); }}>
                <button className="bg-green-600 text-white px-4 py-1 rounded">Verifikasi & Konfirmasi</button>
              </form>
              <form action={async () => { 'use server'; await verifyPayment(order.id, 'cancelled'); }}>
                <button className="bg-red-600 text-white px-4 py-1 rounded">Tolak</button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}