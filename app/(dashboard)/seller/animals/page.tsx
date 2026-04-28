'use client';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { uploadAnimalImages } from '@/lib/actions/upload';
import toast from 'react-hot-toast';
import Image from 'next/image';

export default function AddAnimalPage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    name: '',
    animal_type: 'Kambing',
    age_months: 12,
    price: 0,
    description: '',
    location: '',
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImages(prev => [...prev, ...files]);
    const newPreviews = files.map(f => URL.createObjectURL(f));
    setPreviews(prev => [...prev, ...newPreviews]);
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    URL.revokeObjectURL(previews[index]);
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error('Silakan login');
      setLoading(false);
      return;
    }

    // Upload gambar
    const formData = new FormData();
    images.forEach(img => formData.append('images', img));
    let imageUrls: string[] = [];
    if (images.length > 0) {
      try {
        imageUrls = await uploadAnimalImages(formData);
      } catch (err: any) {
        toast.error(err.message);
        setLoading(false);
        return;
      }
    }

    const isEligible = () => {
      const type = form.animal_type;
      const age = form.age_months;
      if (type === 'Kambing' || type === 'Domba') return age >= 12;
      if (type === 'Sapi' || type === 'Kerbau') return age >= 24;
      if (type === 'Unta') return age >= 60;
      return false;
    };

    const { error } = await supabase.from('animals').insert({
      seller_id: user.id,
      name: form.name,
      animal_type: form.animal_type,
      age_months: form.age_months,
      price: form.price,
      description: form.description,
      location: form.location,
      is_qurban_eligible: isEligible(),
      status: 'available',
      images: imageUrls,
    });

    if (error) toast.error(error.message);
    else {
      toast.success('Hewan berhasil ditambahkan');
      router.push('/dashboard/seller/animals');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Tambah Hewan Baru</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-4">
        {/* input text sama seperti sebelumnya */}
        <div>
          <label className="block text-sm font-medium">Nama Hewan (opsional)</label>
          <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium">Jenis Hewan *</label>
          <select value={form.animal_type} onChange={e => setForm({...form, animal_type: e.target.value})} className="w-full border rounded px-3 py-2">
            <option>Kambing</option><option>Domba</option><option>Sapi</option><option>Kerbau</option><option>Unta</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">Umur (bulan) *</label>
          <input type="number" value={form.age_months} onChange={e => setForm({...form, age_months: parseInt(e.target.value)})} className="w-full border rounded px-3 py-2" required />
        </div>
        <div>
          <label className="block text-sm font-medium">Harga (Rp) *</label>
          <input type="number" value={form.price} onChange={e => setForm({...form, price: parseInt(e.target.value)})} className="w-full border rounded px-3 py-2" required />
        </div>
        <div>
          <label className="block text-sm font-medium">Lokasi</label>
          <input type="text" value={form.location} onChange={e => setForm({...form, location: e.target.value})} className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium">Deskripsi</label>
          <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={3} className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium">Foto Hewan</label>
          <input type="file" multiple accept="image/*" onChange={handleImageChange} ref={fileInputRef} className="w-full border rounded px-3 py-2" />
          <div className="flex flex-wrap gap-2 mt-2">
            {previews.map((src, idx) => (
              <div key={idx} className="relative w-20 h-20">
                <Image src={src} alt="preview" fill className="object-cover rounded" />
                <button type="button" onClick={() => removeImage(idx)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs">×</button>
              </div>
            ))}
          </div>
        </div>
        <button type="submit" disabled={loading} className="w-full bg-green-600 text-white py-2 rounded-lg">Simpan</button>
      </form>
    </div>
  );
}