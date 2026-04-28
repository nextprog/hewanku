import { createClient } from '@/lib/supabase/server';
import Image from 'next/image';
import { uploadPaymentProof } from '@/lib/actions/order';
import UploadProofButton from '@/components/UploadProofButton';

export default async function BuyerOrdersPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: orders } = await supabase
    .from('orders')
    .select('*, order_items(animal_id, animals(name, price))')
    .eq('buyer_id', user?.id)
    .order('order_date', { ascending: false });

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Pesanan Saya</h1>
      {orders?.length === 0 && <p>Belum ada pesanan.</p>}
      {orders?.map((order) => (
        <div key={order.id} className="bg-white shadow rounded-lg mb-6 p-4">
          <div className="flex justify-between items-start border-b pb-2">
            <div>
              <p className="text-sm text-gray-500">Order ID: {order.id.slice(0,8)}</p>
              <p className="text-sm">Tanggal: {new Date(order.order_date).toLocaleDateString('id-ID')}</p>
            </div>
            <span className={`px-2 py-1 rounded text-xs font-semibold ${order.status === 'paid' ? 'bg-green-100 text-green-800' : order.status === 'waiting_payment' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100'}`}>
              {order.status === 'pending' ? 'Menunggu Pembayaran' : order.status === 'waiting_payment' ? 'Menunggu Verifikasi' : 'Lunas'}
            </span>
          </div>
          <div className="py-2">
            {order.order_items.map((item: any) => (
              <div key={item.animal_id} className="flex justify-between text-sm">
                <span>{item.animals.name || item.animals.animal_type}</span>
                <span>Rp {item.price_at_time.toLocaleString('id-ID')}</span>
              </div>
            ))}
            <div className="flex justify-between font-bold mt-2 pt-2 border-t">
              <span>Total</span>
              <span>Rp {order.total_amount.toLocaleString('id-ID')}</span>
            </div>
          </div>
          <div className="mt-4">
            {order.status === 'pending' && (
              <UploadProofButton orderId={order.id} />
            )}
            {order.payment_proof_url && (
              <p className="text-xs text-green-600 mt-2">Bukti pembayaran telah diupload.</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}