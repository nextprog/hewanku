'use client';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { uploadPaymentProof } from '@/lib/actions/order';
import toast from 'react-hot-toast';

export default function UploadProofButton({ orderId }: { orderId: string }) {
  const [uploading, setUploading] = useState(false);
  const supabase = createClient();

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const fileExt = file.name.split('.').pop();
    const fileName = `${orderId}_${Date.now()}.${fileExt}`;
    const { error: uploadError } = await supabase.storage
      .from('payment-proofs')
      .upload(fileName, file);
    if (uploadError) {
      toast.error('Gagal upload bukti');
    } else {
      const { data: { publicUrl } } = supabase.storage.from('payment-proofs').getPublicUrl(fileName);
      await uploadPaymentProof(orderId, publicUrl);
      toast.success('Bukti terupload, menunggu verifikasi admin');
    }
    setUploading(false);
  };

  return (
    <label className="inline-block bg-blue-600 text-white px-4 py-1 rounded cursor-pointer hover:bg-blue-700">
      {uploading ? 'Uploading...' : 'Upload Bukti Bayar'}
      <input type="file" accept="image/*" onChange={handleUpload} className="hidden" disabled={uploading} />
    </label>
  );
}