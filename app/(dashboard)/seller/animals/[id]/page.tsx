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

const ANIMAL_TYPES = [
  { value: 'kambing', label: 'Kambing', minAge: 12 },
  { value: 'sapi', label: 'Sapi', minAge: 24 },
] as const;

export default function EditAnimalPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [form, setForm] = useState<AnimalForm | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 🔄 Fetch data
  useEffect(() => {
    if (!id) {
      setError('ID tidak valid');
      setFetching(false);
      return;
    }

    const fetchData = async () => {
      try {
        setFetching(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from('animals')
          .select('*')
          .eq('id', id)
          .single();

        if (fetchError) {
          console.error('Fetch error:', fetchError);
          setError('Gagal mengambil data hewan');
          toast.error('Gagal mengambil data');
          return;
        }

        if (!data) {
          setError('Data hewan tidak ditemukan');
          toast.error('Data tidak ditemukan');
          return;
        }

        // 🔥 Type-safe casting
        const formData: AnimalForm = {
          name: data.name || '',
          animal_type: data.animal_type || 'kambing',
          age_months: data.age_months || 0,
          price: data.price || 0,
          description: data.description || '',
          location: data.location || '',
        };

        setForm(formData);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Terjadi kesalahan saat mengambil data');
        toast.error('Terjadi kesalahan');
      } finally {
        setFetching(false);
      }
    };

    fetchData();
    // ✅ Fix: tambahkan supabase ke dependency array
  }, [id, supabase]);

  // 🧠 Logic kelayakan qurban
  const checkQurbanEligibility = (formData: AnimalForm): boolean => {
    if (formData.animal_type === 'kambing') return formData.age_months >= 12;
    if (formData.animal_type === 'sapi') return formData.age_months >= 24;
    return false;
  };

  // ✅ Get minimum age untuk selected animal type
  const getMinAge = (animalType: string): number => {
    const type = ANIMAL_TYPES.find((t) => t.value === animalType);
    return type?.minAge || 0;
  };

  // 📩 Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form || !id) {
      toast.error('Data tidak lengkap');
      return;
    }

    // ✅ Validasi field yang required
    if (!form.name.trim() || !form.animal_type || form.age_months <= 0 || form.price <= 0) {
      toast.error('Semua field yang diperlukan harus diisi dengan benar');
      return;
    }

    setLoading(true);

    try {
      const isEligible = checkQurbanEligibility(form);

      const { error: updateError } = await supabase
        .from('animals')
        .update({
          name: form.name.trim(),
          animal_type: form.animal_type,
          age_months: form.age_months,
          price: form.price,
          description: form.description.trim(),
          location: form.location.trim(),
          is_qurban_eligible: isEligible,
        })
        .eq('id', id);

      if (updateError) {
        throw updateError;
      }

      toast.success('Update berhasil');
      router.push('/dashboard/seller/animals');
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Terjadi kesalahan saat memperbarui data';
      console.error('Update error:', err);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // 🧱 Loading state
  if (fetching) {
    return (
      <div className="max-w-xl mx-auto p-4">
        <div className="flex items-center justify-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading data...</span>
        </div>
      </div>
    );
  }

  // ❌ Error state
  if (error || !form) {
    return (
      <div className="max-w-xl mx-auto p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h2 className="text-red-800 font-semibold mb-2">Kesalahan</h2>
          <p className="text-red-700 mb-4">{error || 'Data tidak ditemukan'}</p>
          <button
            onClick={() => router.push('/dashboard/seller/animals')}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
          >
            Kembali ke Daftar Hewan
          </button>
        </div>
      </div>
    );
  }

  const isEligible = checkQurbanEligibility(form);
  const minAge = getMinAge(form.animal_type);

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Edit Hewan</h1>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
        {/* Nama */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nama <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Masukkan nama hewan"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Jenis Hewan */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Jenis Hewan <span className="text-red-500">*</span>
          </label>
          <select
            value={form.animal_type}
            onChange={(e) => setForm({ ...form, animal_type: e.target.value })}
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            {ANIMAL_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Umur */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Umur (bulan) <span className="text-red-500">*</span>
            <span className="text-xs text-gray-500 font-normal ml-1">
              (Minimal: {minAge} bulan)
            </span>
          </label>
          <input
            type="number"
            placeholder="Masukkan umur dalam bulan"
            value={form.age_months}
            onChange={(e) => setForm({ ...form, age_months: Math.max(0, Number(e.target.value)) })}
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="0"
            required
          />
          {form.age_months > 0 && (
            <p className={`text-xs mt-1 ${isEligible ? 'text-green-600' : 'text-red-600'}`}>
              {isEligible ? '✓ Memenuhi syarat kurban' : '✗ Belum memenuhi syarat kurban'}
            </p>
          )}
        </div>

        {/* Harga */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Harga (Rp) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            placeholder="Masukkan harga"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: Math.max(0, Number(e.target.value)) })}
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="0"
            required
          />
        </div>

        {/* Deskripsi */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Deskripsi
          </label>
          <textarea
            placeholder="Masukkan deskripsi hewan (opsional)"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows={3}
          />
        </div>

        {/* Lokasi */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Lokasi
          </label>
          <input
            type="text"
            placeholder="Masukkan lokasi (opsional)"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Menyimpan...
              </span>
            ) : (
              'Update'
            )}
          </button>
          <button
            type="button"
            onClick={() => router.push('/dashboard/seller/animals')}
            disabled={loading}
            className="px-4 py-2 rounded font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Batal
          </button>
        </div>
      </form>
    </div>
  );
}