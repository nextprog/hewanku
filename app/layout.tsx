import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import Navbar from '@/components/Navbar';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'HewanKita - Jual Beli Hewan Qurban & Hewan Lainnya',
  description: 'Platform jual beli hewan sesuai syariat',
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className={inter.className}>
        <CartProvider>
          <Navbar />
          <main className="min-h-screen bg-gray-50">{children}</main>
          <Toaster position="top-right" />
        </CartProvider>
      </body>
    </html>
  );
}