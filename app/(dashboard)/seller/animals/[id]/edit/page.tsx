'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';

export default function EditAnimalPage() {
  const { id } = useParams();
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<any>(null);

  useEffect(() => {
    const fetchAnimal = async () => {
      const { data, error } = await supabase
        .from('animals')
        .select('*')
        .eq('id', id)
        .single();
      if (error) {
        toast.error('Gagal mengambil data');
        router.push('/dashboard/seller/animals');
      } else {
        setForm(data);
      }
    };
    fetchAnimal();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const isEligible = () => {
      const type = form.animal_type;
      const age = form.age_months;
      if (type === 'Kambing' || type === 'Domba') return age >= 12;
      if (type === 'Sapi' || type === 'Kerbau') return age >= 24;
      if (type === 'Unta') return age >= 60;
      return false;
    };

    const { error } = await supabase
      .from('animals')
      .update({
        name: form.name,
        animal_type: form.animal_type,
        age_months: form.age_months,
        price: form.price,
        description: form.description,
        location: form.location,
        is_qurban_eligible: isEligible(),
      })
      .eq('id', id);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Update berhasil');
      router.push('/dashboard/seller/animals');
    }
    setLoading(false);
  };

  if (!form) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Edit Hewan</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-4">
        <div>
          <label className="block text-sm font-medium">Nama Hewan (opsional)</label>
          <input
            type="text"
            value={form.name || ''}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Jenis Hewan *</label>
          <select
            value={form.animal_type}
            onChange={(e) => setForm({ ...form, animal_type: e.target.value })}
            className="w-full border rounded px-3 py-2"
          >
            <option>Kambing</option>
            <option>Domba</option>
            <option>Sapi</option>
            <option>Kerbau</option>
            <option>Unta</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">Umur (bulan) *</label>
          <input
            type="number"
            value={form.age_months}
            onChange={(e) => setForm({ ...form, age_months: parseInt(e.target.value) })}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Harga (Rp) *</label>
          <input
            type="number"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: parseInt(e.target.value) })}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Lokasi</label>
          <input
            type="text"
            value={form.location || ''}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Deskripsi</label>
          <textarea
            value={form.description || ''}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-2 rounded-lg"
        >
          {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
        </button>
      </form>
    </div>
  );
}