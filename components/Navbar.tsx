'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';

export default function Navbar() {
  const pathname = usePathname();
  const { totalItems } = useCart();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        const { data } = await supabase.from('profiles').select('role').eq('id', user.id).single();
        setProfile(data);
      }
    };
    getUser();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        supabase.from('profiles').select('role').eq('id', session.user.id).single().then(({ data }) => setProfile(data));
      } else {
        setProfile(null);
      }
    });

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  const getDashboardLink = () => {
    if (!profile) return '/login';
    if (profile.role === 'admin') return '/dashboard/admin/orders';
    if (profile.role === 'seller') return '/dashboard/seller/animals';
    return '/dashboard/buyer/orders';
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-green-700">HewanKita</Link>
            <div className="hidden md:flex ml-10 space-x-4">
              <Link href="/animals" className={`px-3 py-2 rounded-md text-sm font-medium ${pathname === '/animals' ? 'bg-green-100 text-green-800' : 'text-gray-700 hover:bg-gray-100'}`}>Hewan</Link>
              <Link href="/faq-qurban" className={`px-3 py-2 rounded-md text-sm font-medium ${pathname === '/faq-qurban' ? 'bg-green-100 text-green-800' : 'text-gray-700 hover:bg-gray-100'}`}>Tanya Qurban</Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/cart" className="relative p-2 text-gray-600 hover:text-green-600">
              🛒
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                  {totalItems}
                </span>
              )}
            </Link>
            {user ? (
              <div className="flex items-center space-x-3">
                <Link href={getDashboardLink()} className="text-sm bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700">
                  Dashboard
                </Link>
                <button onClick={handleLogout} className="text-sm text-red-600 hover:underline">
                  Logout
                </button>
              </div>
            ) : (
              <Link href="/login" className="text-sm bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}