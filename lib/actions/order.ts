'use server';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function createOrder(cartItems: any[], totalAmount: number, shippingAddress: string) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Anda harus login');

  // Insert order
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      buyer_id: user.id,
      total_amount: totalAmount,
      shipping_address: shippingAddress,
      status: 'pending',
      payment_method: 'bank_transfer',
    })
    .select()
    .single();
  if (orderError) throw new Error(orderError.message);

  // Insert order items
  const orderItems = cartItems.map(item => ({
    order_id: order.id,
    animal_id: item.animal_id,
    price_at_time: item.price,
  }));
  const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
  if (itemsError) throw new Error(itemsError.message);

  // (Optional) Update animals status? Nanti setelah pembayaran confirmed
  revalidatePath('/dashboard/buyer/orders');
  return order.id;
}

export async function uploadPaymentProof(orderId: string, fileUrl: string) {
  const supabase = createClient();
  const { error } = await supabase
    .from('orders')
    .update({ payment_proof_url: fileUrl, status: 'waiting_payment' })
    .eq('id', orderId);
  if (error) throw new Error(error.message);
  revalidatePath('/dashboard/buyer/orders');
  revalidatePath('/dashboard/admin/orders');
}

export async function verifyPayment(orderId: string, status: 'paid' | 'cancelled') {
  const supabase = createClient();
  // Update order status
  const { error: orderError } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', orderId);
  if (orderError) throw new Error(orderError.message);

  // If paid, update animal status to sold
  if (status === 'paid') {
    // Get animal ids from order_items
    const { data: items } = await supabase
      .from('order_items')
      .select('animal_id')
      .eq('order_id', orderId);
    if (items && items.length) {
      const animalIds = items.map(i => i.animal_id);
      await supabase
        .from('animals')
        .update({ status: 'sold' })
        .in('id', animalIds);
    }
  }
  revalidatePath('/dashboard/admin/orders');
}