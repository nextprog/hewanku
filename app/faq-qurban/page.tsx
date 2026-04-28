export default function FAQPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-8">Panduan Syariat Qurban</h1>
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-green-700">Syarat Hewan Qurban</h2>
          <ul className="list-disc ml-6 mt-2 space-y-1">
            <li>Kambing/Domba: minimal umur 1 tahun (12 bulan) atau sudah berganti gigi.</li>
            <li>Sapi/Kerbau: minimal umur 2 tahun (24 bulan).</li>
            <li>Unta: minimal umur 5 tahun (60 bulan).</li>
            <li>Tidak cacat: buta, pincang, kurus sekali, sakit parah.</li>
          </ul>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-green-700">Waktu Penyembelihan</h2>
          <p>Setelah shalat Idul Adha hingga hari ke-13 Dzulhijjah (hari tasyrik).</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-green-700">Hukum Qurban</h2>
          <p>Sunah muakkadah bagi yang mampu. HewanKita hanya sebagai perantara jual beli, pembeli bertanggung jawab memastikan kelayakan hewan sebelum membeli.</p>
        </div>
      </div>
    </div>
  );
}