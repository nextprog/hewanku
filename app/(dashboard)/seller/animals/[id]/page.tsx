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
    supabase.from('animals').select('*').eq('id', id).single().then(({ data }) => setForm(data));
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const isEligible = // ... sama seperti di add
    const { error } = await supabase.from('animals').update({
      name: form.name,
      animal_type: form.animal_type,
      age_months: form.age_months,
      price: form.price,
      description: form.description,
      location: form.location,
      is_qurban_eligible: isEligible,
    }).eq('id', id);
    if (error) toast.error(error.message);
    else { toast.success('Update berhasil'); router.push('/dashboard/seller/animals'); }
    setLoading(false);
  };

  if (!form) return <div>Loading...</div>;
  return ( ... form serupa dengan add );
}