import Link from 'next/link';

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto max-w-4xl p-8 bg-white dark:bg-gray-800 shadow-lg rounded-lg my-10">
      <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
        Kebijakan Privasi
      </h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        Terakhir diperbarui: 24 Juni 2025
      </p>
      <p className="mb-4 text-gray-700 dark:text-gray-300">
        Privasi Anda sangat penting bagi kami. Kebijakan Privasi ini menjelaskan bagaimana informasi Anda ditangani saat Anda menggunakan aplikasi Photobooth kami.
      </p>

      <div className="space-y-6 text-gray-700 dark:text-gray-300">
        <div>
          <h2 className="text-2xl font-semibold mb-2 text-gray-900 dark:text-white">1. Akses Kamera</h2>
          <p>
            Untuk berfungsi, aplikasi ini memerlukan izin untuk mengakses kamera perangkat Anda. Kami hanya menggunakan akses ini untuk menampilkan live feed video di layar dan untuk mengambil gambar saat Anda menekan tombol capture.
          </p>
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-2 text-gray-900 dark:text-white">2. Pengolahan dan Penyimpanan Data</h2>
          <p>
            <strong>Semua proses terjadi secara lokal di browser Anda.</strong> Ini adalah poin terpenting dari kebijakan kami:
          </p>
          <ul className="list-disc list-inside mt-2 space-y-1 pl-4">
            <li>Kami **TIDAK** mengirim, mengunggah, atau menyimpan gambar atau video Anda di server kami atau server pihak ketiga manapun.</li>
            <li>Gambar yang Anda ambil hanya ada di dalam sesi browser Anda saat ini. Jika Anda menutup tab atau browser, gambar-gambar tersebut akan hilang (kecuali Anda menyimpannya secara manual).</li>
            <li>Data gambar yang Anda download disimpan langsung ke perangkat Anda, bukan di tempat lain.</li>
          </ul>
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-2 text-gray-900 dark:text-white">3. Cookies dan Pelacakan</h2>
          <p>
            Aplikasi ini tidak menggunakan cookies atau teknologi pelacakan lainnya untuk mengumpulkan data pribadi Anda.
          </p>
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-2 text-gray-900 dark:text-white">4. Perubahan pada Kebijakan Ini</h2>
          <p>
            Kami dapat memperbarui Kebijakan Privasi ini dari waktu ke waktu. Kami akan memberitahu Anda tentang perubahan apa pun dengan memposting Kebijakan Privasi baru di halaman ini.
          </p>
        </div>
      </div>

      <Link href="/" className="inline-block mt-8 px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
        Kembali ke Photobooth
      </Link>
    </div>
  );
}
