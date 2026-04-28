'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';

type AnimalForm = {
  name: string;
  animal_type: string;
  age_months: number;
  price: number;
  description: string;
  location: string;
};

export default function EditAnimalPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<AnimalForm | null>(null);

  // 🔄 Fetch data
  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      const { data, error } = await supabase
        .from('animals')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !data) {
        toast.error('Gagal mengambil data');
        return;
      }

      // 🔥 casting supaya TypeScript tidak error
      setForm(data as unknown as AnimalForm);
    };

    fetchData();
  }, [id]);

  // 🧠 Logic kelayakan qurban
  const checkQurbanEligibility = (form: AnimalForm) => {
    if (form.animal_type === 'kambing') return form.age_months >= 12;
    if (form.animal_type === 'sapi') return form.age_months >= 24;
    return false;
  };

  // 📩 Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form || !id) return;

    setLoading(true);

    try {
      const isEligible = checkQurbanEligibility(form);

      const { error } = await supabase
        .from('animals')
        .update({
          name: form.name,
          animal_type: form.animal_type,
          age_months: form.age_months,
          price: form.price,
          description: form.description,
          location: form.location,
          is_qurban_eligible: isEligible,
        })
        .eq('id', id);

      if (error) throw error;

      toast.success('Update berhasil');
      router.push('/dashboard/seller/animals');
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Terjadi kesalahan';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // 🧱 Loading state
  if (!form) return <div className="p-4">Loading...</div>;

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Edit Hewan</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Nama"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full border p-2 rounded"
          required
        />

        <select
          value={form.animal_type}
          onChange={(e) =>
            setForm({ ...form, animal_type: e.target.value })
          }
          className="w-full border p-2 rounded"
        >
          <option value="kambing">Kambing</option>
          <option value="sapi">Sapi</option>
        </select>

        <input
          type="number"
          placeholder="Umur (bulan)"
          value={form.age_months}
          onChange={(e) =>
            setForm({ ...form, age_months: Number(e.target.value) })
          }
          className="w-full border p-2 rounded"
        />

        <input
          type="number"
          placeholder="Harga"
          value={form.price}
          onChange={(e) =>
            setForm({ ...form, price: Number(e.target.value) })
          }
          className="w-full border p-2 rounded"
        />

        <textarea
          placeholder="Deskripsi"
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
          className="w-full border p-2 rounded"
        />

        <input
          type="text"
          placeholder="Lokasi"
          value={form.location}
          onChange={(e) =>
            setForm({ ...form, location: e.target.value })
          }
          className="w-full border p-2 rounded"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {loading ? 'Menyimpan...' : 'Update'}
        </button>
      </form>
    </div>
  );
}