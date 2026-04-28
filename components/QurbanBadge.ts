import React from 'react';

interface QurbanBadgeProps {
  eligible: boolean;
  type: string;
  ageMonths: number;
}

export const QurbanBadge: React.FC<QurbanBadgeProps> = ({ eligible, type, ageMonths }) => {
  if (!eligible) return null;

  let syarat = '';
  if (type === 'Kambing' || type === 'Domba') {
    syarat = 'Umur ≥ 1 tahun';
  } else if (type === 'Sapi' || type === 'Kerbau') {
    syarat = 'Umur ≥ 2 tahun';
  } else if (type === 'Unta') {
    syarat = 'Umur ≥ 5 tahun';
  } else {
    syarat = 'Sesuai syariat';
  }

  return (
    <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
      ✅ Layak Qurban ({syarat})
    </span>
  );
};