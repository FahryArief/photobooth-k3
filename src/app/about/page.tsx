import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="container mx-auto max-w-4xl p-8 bg-white dark:bg-gray-800 shadow-lg rounded-lg my-10">
      <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
        Tentang Aplikasi Photobooth Ini
      </h1>
      <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
        Aplikasi ini merupakan proyek Ujian Akhir Praktikum (UAP) untuk mata kuliah Pemrograman Web. Dibuat menggunakan teknologi web modern untuk memberikan pengalaman photobooth virtual yang interaktif dan menyenangkan.
      </p>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">Teknologi yang Digunakan</h2>
        <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
          <li><strong>Next.js:</strong> Kerangka kerja React untuk aplikasi web yang cepat dan modern.</li>
          <li><strong>TypeScript:</strong> Untuk kode yang lebih aman dan mudah dikelola.</li>
          <li><strong>Tailwind CSS:</strong> Untuk styling antarmuka yang cepat dan responsif.</li>
          <li><strong>React Webcam:</strong> Library untuk mengakses feed kamera pengguna.</li>
          <li><strong>Lucide React:</strong> Untuk ikon-ikon yang bersih dan konsisten.</li>
        </ul>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">Dibuat oleh Kelompok 3</h2>
        {/* Anda bisa menambahkan daftar anggota kelompok di sini */}
        <p className="text-gray-700 dark:text-gray-300">
          Terima kasih telah mencoba aplikasi kami!
        </p>
      </div>

      <Link href="/" className="inline-block px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
        Kembali ke Photobooth
      </Link>
    </div>
  );
}
