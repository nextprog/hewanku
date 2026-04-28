'use client';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('buyer');
  const [loading, setLoading] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, phone, role },
      },
    });
    if (error) {
      toast.error(error.message);
    } else {
      // Insert profile manually jika trigger belum dibuat
      if (data.user) {
        await supabase.from('profiles').insert({
          id: data.user.id,
          full_name: fullName,
          phone,
          role,
        });
      }
      toast.success('Registrasi berhasil! Silakan login.');
      router.push('/login');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div><h2 className="text-center text-3xl font-extrabold text-gray-900">Daftar HewanKita</h2></div>
        <form onSubmit={handleRegister} className="mt-8 space-y-4">
          <input type="text" placeholder="Nama Lengkap" value={fullName} onChange={e => setFullName(e.target.value)} required className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm" />
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm" />
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm" />
          <input type="tel" placeholder="No. HP" value={phone} onChange={e => setPhone(e.target.value)} className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm" />
          <select value={role} onChange={e => setRole(e.target.value)} className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 bg-white">
            <option value="buyer">Pembeli</option>
            <option value="seller">Penjual</option>
          </select>
          <button type="submit" disabled={loading} className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700">
            {loading ? 'Loading...' : 'Daftar'}
          </button>
          <div className="text-sm text-center"><Link href="/login" className="font-medium text-green-600">Sudah punya akun? Masuk</Link></div>
        </form>
      </div>
    </div>
  );
}